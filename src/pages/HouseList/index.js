import React from 'react'

import { Flex } from 'antd-mobile'

import { List } from 'react-virtualized'

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
// 导入样式
import styles from './index.module.css'

// 获取当前定位城市信息
const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
  state = {
    // 列表数据
    list: [],
    // 总条数
    count: 0
  }

  // 初始化实例属性
  filters = {}

  componentDidMount() {
    this.searchHouseList()
  }

  // 用来获取房屋列表数据
  async searchHouseList() {
    // 获取当前定位城市id

    const res = await API.get('/houses', {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    const { list, count } = res.data.body

    this.setState({
      list,
      count
    })
  }

  // 接收 Filter 组件中的筛选条件数据
  onFilter = filters => {
    this.filters = filters

    // 调用获取房屋数据的方法
    this.searchHouseList()
  }

  /* 
    1 封装 HouseItem 组件，实现 Map 和 HouseList 页面中，房屋列表项的复用。
    2 使用 HouseItem 组件改造 Map 组件的房屋列表项。
    3 使用 react-virtualized 的 List 组件渲染房屋列表（参考 CityList 组件的使用）。
  */
  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]

    console.log(house)

    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
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

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <List
            width={300}
            height={300}
            rowCount={this.state.count} // List列表项的行数
            rowHeight={120} // 每一行的高度
            rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
          />
        </div>
      </div>
    )
  }
}
