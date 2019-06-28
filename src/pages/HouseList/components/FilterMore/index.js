import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

/* 
  获取选中值以及设置高亮：

  1 在 state 中添加状态 selectedValues（表示选中项的值）。
  2 给标签绑定单击事件，通过参数获取到当前项的 value。
  3 判断 selectedValues 中是否包含当前项的 value 值。
  4 如果不包含，就将当前项的 value 添加到 selectedValues 数组中。
  5 如果包含，就从 selectedValues 数组中移除（使用数组的 splice 方法，根据索引号删除）。
  6 在渲染标签时，判断 selectedValues 数组中，是否包含当前项的 value，包含，就添加高亮类。
*/

export default class FilterMore extends Component {
  state = {
    selectedValues: []
  }

  onTagClick(value) {
    const { selectedValues } = this.state
    // 创建新数组
    const newSelectedValues = [...selectedValues]

    if (newSelectedValues.indexOf(value) <= -1) {
      // 没有当前项的值
      newSelectedValues.push(value)
    } else {
      // 有
      const index = newSelectedValues.findIndex(item => item === value)
      newSelectedValues.splice(index, 1)
    }

    this.setState({
      selectedValues: newSelectedValues
    })
  }

  // 渲染标签
  renderFilters(data) {
    const { selectedValues } = this.state
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const isSelected = selectedValues.indexOf(item.value) > -1

      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          onClick={() => this.onTagClick(item.value)}
        >
          {item.label}
        </span>
      )
    })
  }

  render() {
    const {
      data: { roomType, oriented, floor, characteristic }
    } = this.props

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} />
      </div>
    )
  }
}
