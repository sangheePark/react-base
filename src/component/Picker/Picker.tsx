import * as React from 'react'
import classNames from 'classnames'
import { IPickerProps } from './PickerTypes'
import PickerMixin from './PickerMixin'
import './Picker.css'

export interface IPickerProp {
  select: (...arg: any[]) => void
  doScrollingComplete: (...arg: any[]) => void
  computeChildIndex: (...arg: any[]) => number
}
class Picker extends React.Component<IPickerProp & IPickerProps, any> {
  static defaultProps = {
    prefixCls: 'zin-picker'
  }

  rootRef: any
  maskRef: any
  contentRef: any
  indicatorRef: any
  itemHeight: any
  scrollValue: any

  scrollHanders = (() => {
    let scrollY = -1
    let lastY = 0
    let startY = 0
    let scrollDisabled = false
    let isMoving = false

    const setTransform = (nodeStyle: CSSStyleDeclaration, value: any) => {
      nodeStyle.transform = value
      nodeStyle.webkitTransform = value
    }

    const setTransition = (nodeStyle: CSSStyleDeclaration, value: any) => {
      nodeStyle.transition = value
      nodeStyle.webkitTransition = value
    }

    const scrollTo = (_x: number, y: number, time = 0.3) => {
      if (scrollY !== y) {
        scrollY = y
        if (time && !this.props.noAnimate) {
          setTransition(this.contentRef.style, `cubic-bezier(0,0,0.2,1.15) ${time}s`)
        }
        setTransform(this.contentRef.style, `translate3d(0,${-y}px,0)`)
        setTimeout(() => {
          this.scrollingComplete()
          if (this.contentRef) {
            setTransition(this.contentRef.style, '')
          }
        }, +time * 1000)
      }
    }

    const Velocity = ((minInterval = 30, maxInterval = 100) => {
      let _time = 0
      let _y = 0
      let _velocity = 0
      const recorder = {
        record: (y: any) => {
          const now = +new Date()
          _velocity = (y - _y) / (now - _time)
          if (now - _time >= minInterval) {
            _velocity = now - _time <= maxInterval ? _velocity : 0
            _y = y
            _time = now
          }
        },
        getVelocity: (y: any) => {
          if (y !== _y) {
            recorder.record(y)
          }
          return _velocity
        }
      }
      return recorder
    })()

    const onFinish = () => {
      isMoving = false
      let targetY = scrollY

      const height = ((this.props.children as any).length - 1) * this.itemHeight

      let time = 0.3

      const velocity = Velocity.getVelocity(targetY) * 4
      if (velocity) {
        targetY = velocity * 40 + targetY
        time = Math.abs(velocity) * 0.1
      }

      if (targetY % this.itemHeight !== 0) {
        targetY = Math.round(targetY / this.itemHeight) * this.itemHeight
      }

      if (targetY < 0) {
        targetY = 0
      } else if (targetY > height) {
        targetY = height
      }

      scrollTo(0, targetY, time < 0.3 ? 0.3 : time)
      this.onScrollChange()
    }

    const onStart = (y: number) => {
      if (scrollDisabled) {
        return
      }

      isMoving = true
      startY = y
      lastY = scrollY
    }

    const onMove = (y: number) => {
      if (scrollDisabled || !isMoving) {
        return
      }

      if (this.props.isValid) {
        const top = lastY - y + startY
        const { selectedValue } = this.props
        const children = React.Children.toArray(this.props.children)
        const index = this.props.computeChildIndex(top, this.itemHeight, children.length)
        const child: any = children[index]

        if (child.props && !this.props.isValid(selectedValue, child.props.value)) {
          return
        }
      }
      scrollY = lastY - y + startY
      Velocity.record(scrollY)
      this.onScrollChange()
      setTransform(this.contentRef.style, `translate3d(0,${-scrollY}px,0)`)
    }

    return {
      touchstart: (evt: TouchEvent) => onStart(evt.touches[0].pageY),
      mousedown: (evt: MouseEvent) => onStart(evt.pageY),
      touchmove: (evt: TouchEvent) => {
        evt.preventDefault()
        onMove(evt.touches[0].pageY)
      },
      mousemove: (evt: MouseEvent) => {
        evt.preventDefault()
        onMove(evt.pageY)
      },
      touchend: () => onFinish(),
      touchcancel: () => onFinish(),
      mouseup: () => onFinish(),
      getValue: () => {
        return scrollY
      },
      scrollTo,
      setDisabled: (disabled: boolean = false) => {
        scrollDisabled = disabled
      }
    }
  })()

  constructor(props: any) {
    super(props)

    let selectedValueState
    const { selectedValue, defaultSelectedValue } = this.props
    if (selectedValue !== undefined) {
      selectedValueState = selectedValue
    } else if (defaultSelectedValue !== undefined) {
      selectedValueState = defaultSelectedValue
    } else {
      const children: any = React.Children.toArray(this.props.children)
      selectedValueState = children && children[0] && children[0].props.value
    }
    this.state = {
      selectedValue: selectedValueState
    }
  }

  componentDidMount() {
    const { contentRef, indicatorRef, maskRef, rootRef } = this
    const rootHeight = rootRef.getBoundingClientRect().height
    this.itemHeight = indicatorRef.getBoundingClientRect().height
    const itemHeight = this.itemHeight
    let num = Math.floor(rootHeight / itemHeight)
    if (num % 2 === 0) {
      num--
    }
    num--
    num /= 2
    contentRef.style.padding = `${itemHeight * num}px 0`
    indicatorRef.style.top = `${itemHeight * num}px`
    maskRef.style.backgroundSize = `100% ${itemHeight * num}px`
    this.scrollHanders.setDisabled(this.props.disabled)
    this.props.select(this.state.selectedValue, this.itemHeight, this.scrollTo)

    const passiveSupported = this.passiveSupported()
    const willPreventDefault = passiveSupported ? { passive: false } : false
    const willNotPreventDefault = passiveSupported ? { passive: true } : false
    ;(rootRef as HTMLDivElement).addEventListener('touchstart', this.scrollHanders.touchstart, willNotPreventDefault)
    ;(rootRef as HTMLDivElement).addEventListener('touchmove', this.scrollHanders.touchmove, willPreventDefault)
    ;(rootRef as HTMLDivElement).addEventListener('touchend', this.scrollHanders.touchend, willNotPreventDefault)
    ;(rootRef as HTMLDivElement).addEventListener('touchcancel', this.scrollHanders.touchcancel, willNotPreventDefault)
    ;(rootRef as HTMLDivElement).addEventListener('mousedown', this.scrollHanders.mousedown, willNotPreventDefault)
    ;(rootRef as HTMLDivElement).addEventListener('mousemove', this.scrollHanders.mousemove, willPreventDefault)
    ;(rootRef as HTMLDivElement).addEventListener('mouseup', this.scrollHanders.mouseup, willNotPreventDefault)
  }

  componentWillUnmount() {
    ;(this.rootRef as HTMLDivElement).removeEventListener('touchstart', this.scrollHanders.touchstart)
    ;(this.rootRef as HTMLDivElement).removeEventListener('touchmove', this.scrollHanders.touchmove)
    ;(this.rootRef as HTMLDivElement).removeEventListener('touchend', this.scrollHanders.touchend)
    ;(this.rootRef as HTMLDivElement).removeEventListener('touchcancel', this.scrollHanders.touchcancel)
    ;(this.rootRef as HTMLDivElement).removeEventListener('mousedown', this.scrollHanders.mousedown)
    ;(this.rootRef as HTMLDivElement).removeEventListener('mousemove', this.scrollHanders.mousemove)
    ;(this.rootRef as HTMLDivElement).removeEventListener('mouseup', this.scrollHanders.mouseup)
  }

  passiveSupported() {
    let passiveSupported = false

    try {
      const options = Object.defineProperty({}, 'passive', {
        get: () => {
          passiveSupported = true
        }
      })
      window.addEventListener('test', null as any, options)
    } catch (err) {}
    return passiveSupported
  }

  componentWillReceiveProps(nextProps: IPickerProp & IPickerProps) {
    if ('selectedValue' in nextProps) {
      if (this.state.selectedValue !== nextProps.selectedValue) {
        // if (this.state.selectedValue >= nextProps.selectedValue) {
        this.setState(
          {
            selectedValue: nextProps.selectedValue
          },
          () => {
            this.props.select(nextProps.selectedValue, this.itemHeight, nextProps.noAnimate ? this.scrollToWithoutAnimation : this.scrollTo)
          }
        )
        // }
      }
    }
    this.scrollHanders.setDisabled(nextProps.disabled)
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.state.selectedValue !== nextState.selectedValue || this.props.children !== nextProps.children
  }

  componentDidUpdate() {
    this.props.select(this.state.selectedValue, this.itemHeight, this.scrollToWithoutAnimation)
  }

  scrollTo = (top: any) => {
    this.scrollHanders.scrollTo(0, top)
  }

  scrollToWithoutAnimation = (top: any) => {
    this.scrollHanders.scrollTo(0, top, 0)
  }

  fireValueChange = (selectedValue: any) => {
    if (selectedValue !== this.state.selectedValue) {
      if (!('selectedValue' in this.props)) {
        this.setState({
          selectedValue
        })
      }
      if (this.props.onValueChange) {
        this.props.onValueChange(selectedValue)
      }
    }
  }

  onScrollChange = () => {
    const top = this.scrollHanders.getValue()
    if (top >= 0) {
      const children = React.Children.toArray(this.props.children)
      const index = this.props.computeChildIndex(top, this.itemHeight, children.length)
      if (this.scrollValue !== index) {
        this.scrollValue = index
        const child: any = children[index]
        if (child && this.props.onScrollChange) {
          this.props.onScrollChange(child.props.value)
        } else if (!child && console.warn) {
          console.warn('child not found', children, index)
        }
      }
    }
  }

  scrollingComplete = () => {
    const top = this.scrollHanders.getValue()
    if (top >= 0) {
      this.props.doScrollingComplete(top, this.itemHeight, this.fireValueChange)
    }
  }

  getValue() {
    if ('selectedValue' in this.props) {
      return this.props.selectedValue
    }
    const children: any = React.Children.toArray(this.props.children)
    return children && children[0] && children[0].props.value
  }

  render() {
    const { props } = this
    const { prefixCls, itemStyle, indicatorStyle, indicatorClassName = '', children } = props
    const { selectedValue } = this.state
    const itemClassName = `${prefixCls}-item`
    const selectedItemClassName = `${itemClassName} ${prefixCls}-item-selected`
    const map = (item: any) => {
      const { className = '', style, value } = item.props
      return (
        <div
          style={{ ...itemStyle, ...style }}
          className={`${selectedValue === value ? selectedItemClassName : itemClassName} ${className}`}
          key={value}
        >
          {item.children || item.props.children}
        </div>
      )
    }
    // compatibility for preact
    const items = React.Children ? React.Children.map(children, map) : ([] as any[]).concat(children).map(map)

    const pickerCls = {
      [props.className as string]: !!props.className,
      [prefixCls as string]: true
    }
    return (
      <div className={classNames(pickerCls)} ref={(el) => (this.rootRef = el)} style={this.props.style}>
        <div className={`${prefixCls}-mask`} ref={(el) => (this.maskRef = el)} />
        <div className={`${prefixCls}-indicator ${indicatorClassName}`} ref={(el) => (this.indicatorRef = el)} style={indicatorStyle}>
          <div className={`${prefixCls}-subfix`}></div>
          <div className={`${prefixCls}-subfix`}>{this.props.subfix || ''}</div>
        </div>
        <div className={`${prefixCls}-content`} ref={(el) => (this.contentRef = el)}>
          {items}
        </div>
      </div>
    )
  }
}
export type CompoPicker = typeof Picker
export default PickerMixin(Picker)
