import * as React from 'react'
import classnames from 'classnames'
import MultiPickerProps from './MultiPickerProps'
import MultiPickerMixin from './MultiPickerMixin'

export interface IMultiPickerProp {
  getValue: () => any
}

const MultiPicker = (props: IMultiPickerProp & MultiPickerProps) => {
  const { prefixCls, className, rootNativeProps, children, style } = props
  const selectedValue = props.getValue()
  const colElements = React.Children.map(children, (col: any, i) => {
    if (col === null) {
      return col
    }

    return React.cloneElement(col, {
      selectedValue: selectedValue[i],
      onValueChange: (...args: any) => props.onValueChange!(i, ...args),
      onScrollChange: props.onScrollChange && ((...args: any) => props.onScrollChange!(i, ...args))
    })
  })
  return (
    <div {...rootNativeProps} style={style} className={classnames(className, prefixCls)}>
      {colElements}
    </div>
  )
}

export type CompoMultiPicker = typeof MultiPicker
export default MultiPickerMixin(MultiPicker)
