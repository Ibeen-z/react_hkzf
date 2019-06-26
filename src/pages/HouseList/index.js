import React from 'react'

// 导入顶部搜索导航组件
import SearchHeader from '../../components/SearchHeader'

import styles from './index.module.css'

export default class HouseList extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <SearchHeader />
      </div>
    )
  }
}
