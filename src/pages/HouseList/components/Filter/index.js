import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

/* 
  控制 FilterPicker 组件的展示和隐藏：

  1 在 Filter 组件中，提供控制对话框展示或隐藏的状态： openType（表示展示的对话框类型）。
  2 在 render 中判断 openType 值为 area/mode/price 时，就展示 FilterPicker 组件，以及遮罩层。
  3 在 onTitleClick 方法中，修改状态 openType 为当前 type，展示对话框。
  4 在 Filter 组件中，提供 onCancel 方法，作为取消按钮和遮罩层的事件处理程序。
  5 在 onCancel 方法中，修改状态 openType 为空，隐藏对话框。
  6 将 onCancel 通过 props 传递给 FilterPicker 组件，在取消按钮的单击事件中调用该方法。
  7 在 Filter 组件中，提供 onSave 方法，作为确定按钮的事件处理程序，逻辑同上。
*/

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: ''
  }

  // 点击标题菜单实现高亮
  // 注意：this指向的问题！！！
  // 说明：要实现完整的功能，需要后续的组件配合完成！
  onTitleClick = type => {
    this.setState(prevState => {
      return {
        titleSelectedStatus: {
          // 获取当前对象中所有属性的值
          ...prevState.titleSelectedStatus,
          [type]: true
        },

        // 展示对话框
        openType: type
      }
    })
  }

  // 取消（隐藏对话框）
  onCancel = () => {
    // 隐藏对话框
    this.setState({
      openType: ''
    })
  }

  // 确定（隐藏对话框）
  onSave = () => {
    // 隐藏对话框
    this.setState({
      openType: ''
    })
  }

  render() {
    const { titleSelectedStatus, openType } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {openType === 'area' ||
          openType === 'mode' ||
          openType === 'price' ? (
            <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
          ) : null}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
