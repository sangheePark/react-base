/* tslint:disable:no-console */
import * as React from 'react'
import { IPickerProps } from './PickerTypes'
import { CompoPicker } from './Picker'

export interface IItemProps {
  className?: string
  value: any
  children?: React.ReactNode
}

const Item = (_props: IItemProps) => null

export default function (Component: CompoPicker) {
  return class extends React.Component<IPickerProps, any> {
    static Item = Item

    select = (value: any, itemHeight: any, scrollTo: any) => {
      const children: any = React.Children.toArray(this.props.children)
      for (let i = 0, len = children.length; i < len; i++) {
        if (children[i].props.value === value) {
          this.selectByIndex(i, itemHeight, scrollTo)
          return
        }
      }
      this.selectByIndex(0, itemHeight, scrollTo)
    }

    selectByIndex(index: any, itemHeight: any, zscrollTo: any) {
      if (index < 0 || index >= React.Children.count(this.props.children) || !itemHeight) {
        return
      }
      zscrollTo(index * itemHeight)
    }

    computeChildIndex(top: any, itemHeight: any, childrenLength: any) {
      const index = Math.round(top / itemHeight)
      return Math.min(index, childrenLength - 1)
    }

    doScrollingComplete = (top: any, itemHeight: any, fireValueChange: any) => {
      const children = React.Children.toArray(this.props.children)
      const index = this.computeChildIndex(top, itemHeight, children.length)
      const child: any = children[index]
      if (child) {
        fireValueChange(child.props.value)
      } else if (console.warn) {
        console.warn('child not found', children, index)
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          doScrollingComplete={this.doScrollingComplete}
          computeChildIndex={this.computeChildIndex}
          select={this.select}
        />
      )
    }
  }
}
