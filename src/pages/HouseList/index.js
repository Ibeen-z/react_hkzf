import React from 'react'

import { Flex } from 'antd-mobile'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'

// 导入样式
import styles from './index.module.css'

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

/*
  1 在找房页面 SearchHeader 组件基础上，调整结构（添加返回icon等）。
  2 给 SearchHeader 组件传递 className 属性，来调整组件样式，让其适应找房页面效果。
*/
export default class HouseList extends React.Component {
  render() {
    return (
      <div>
        <Flex className={styles.header}>
          <i className="iconfont icon-back" />
          <SearchHeader cityName={label} className={styles.searchHeader} />
        </Flex>
      </div>
    )
  }
}
