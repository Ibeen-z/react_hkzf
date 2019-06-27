import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

// 导入自定义的axios
import { API } from '../../../../utils/api'

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
  获取当前筛选条件的数据：

  1 在 Filter 组件中，发送请求，获取所有筛选条件数据。
  2 将数据保存为状态：filtersData。
  3 封装渲染 FilterPicker 的方法 renderFilterPicker。

  4 在方法中，根据 openType 的类型，从 filtersData 中获取到需要的数据。
  5 将数据通过 props 传递给 FilterPicker 组件。
  6 FilterPicker 组件接收到数据后，将其作为 PickerView 组件的 data （数据源）。
*/

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: '',
    // 所有筛选条件数据
    filtersData: {}
  }

  componentDidMount() {
    this.getFiltersData()
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)

    this.setState({
      filtersData: res.data.body
    })
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

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price }
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3
    switch (openType) {
      case 'area':
        // 获取到区域数据
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }

    return (
      <FilterPicker
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
      />
    )
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
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
