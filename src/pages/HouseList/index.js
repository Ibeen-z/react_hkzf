import React from 'react'

import { Flex } from 'antd-mobile'

import { API } from '../../utils/api'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
  /* 
    1 将筛选条件数据 filters 传递给父组件 HouseList。
    2 HouseList 组件中，创建方法 onFilter，通过参数接收 filters 数据，并存储到 this 中。
    3 创建方法 searchHouseList（用来获取房屋列表数据）。
    4 根据接口，获取当前定位城市 id 参数。
    5 将筛选条件数据与分页数据合并后，作为接口的参数，发送请求，获取房屋数据。
  */

  // 用来获取房屋列表数据
  async searchHouseList() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get('/houses', {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })

    console.log(res)
  }

  // 接收 Filter 组件中的筛选条件数据
  onFilter = filters => {
    this.filters = filters

    // console.log('HouseList：', this.filters)

    // 调用获取房屋数据的方法
    this.searchHouseList()
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 顶部搜索导航 */}
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={label} className={styles.searchHeader} />
        </Flex>

        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
      </div>
    )
  }
}
