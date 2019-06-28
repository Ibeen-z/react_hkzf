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

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: '',
    // 所有筛选条件数据
    filtersData: {},
    // 筛选条件的选中值
    selectedValues
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

  /* 
    // 高亮：
    // selectedVal 表示当前 type 的选中值
    // 
    // 如果 type 为 area，此时，selectedVal.length !== 2 || selectedVal[0] !== 'area'，就表示已经有选中值
    // 如果 type 为 mode，此时，selectedVal[0] !== 'null'，就表示已经有选中值
    // 如果 type 为 price，此时，selectedVal[0] !== 'null'，就表示已经有选中值
    // 如果 type 为 more, ...

    实现步骤：

    1 在标题点击事件 onTitleClick 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象。
    2 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）。
    3 使用 Object.keys() 方法，遍历标题选中状态对象。
    4 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）。

    5 否则，分别判断每个标题的选中值是否与默认值相同。
    6 如果不同，则设置该标题的选中状态为 true。
    7 如果相同，则设置该标题的选中状态为 false。
    8 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatus。
  */

  // 点击标题菜单实现高亮
  // 注意：this指向的问题！！！
  // 说明：要实现完整的功能，需要后续的组件配合完成！
  onTitleClick = type => {
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 遍历标题选中状态对象
    // Object.keys() => ['area', 'mode', 'price', 'more']
    Object.keys(titleSelectedStatus).forEach(key => {
      // key 表示数组中的每一项，此处，就是每个标题的 type 值。
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true
        return
      }

      // 其他标题：
      const selectedVal = selectedValues[key]
      if (
        key === 'area' &&
        (selectedVal.length !== 2 || selectedVal[0] !== 'area')
      ) {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'more') {
        // 更多选择项 FilterMore 组件
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    // console.log('newTitleSelectedStatus：', newTitleSelectedStatus)

    this.setState({
      // 展示对话框
      openType: type,
      // 使用新的标题选中状态对象来更新
      titleSelectedStatus: newTitleSelectedStatus
    })

    /* this.setState(prevState => {
      return {
        titleSelectedStatus: {
          // 获取当前对象中所有属性的值
          ...prevState.titleSelectedStatus,
          [type]: true
        },

        // 展示对话框
        openType: type
      }
    }) */
  }

  // 取消（隐藏对话框）
  onCancel = () => {
    // 隐藏对话框
    this.setState({
      openType: ''
    })
  }

  // 确定（隐藏对话框）
  onSave = (type, value) => {
    console.log(type, value)
    // 隐藏对话框
    this.setState({
      openType: '',

      selectedValues: {
        ...this.state.selectedValues,
        // 只更新当前 type 对应的选中值
        [type]: value
      }
    })
  }

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
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
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }

  /* 
    1 封装 renderFilterMore 方法，渲染 FilterMore 组件。
    2 从 filtersData 中，获取数据（roomType, oriented, floor, characteristic），通过 props 传递给 FilterMore 组件。
    3 FilterMore 组件中，通过 props 获取到数据，分别将数据传递给 renderFilters 方法。
    4 在 renderFilters 方法中，通过参数接收数据，遍历数据，渲染标签。
  */
  renderFilterMore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state
    if (openType !== 'more') {
      return null
    }

    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    return <FilterMore data={data} type={openType} onSave={this.onSave} />
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
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
