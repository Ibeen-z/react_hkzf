import React from 'react'

import { Flex } from 'antd-mobile'

import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
// 导入吸顶组件
import Sticky from '../../components/Sticky'
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

  // 渲染房屋列表项
  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]

    // 判断 house 是否存在
    // 如果不存在，就渲染 loading 元素占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        // 注意：该组件中应该接收 style，然后给组件元素设置样式！！！
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  /* 
    加载更多房屋列表数据：

    1 在 loadMoreRows 方法中，根据起始索引和结束索引，发送请求，获取更多房屋数据。
    2 获取到最新的数据后，与当前 list 中的数据合并，再更新 state，并调用 Promise 的 resolve()。
    3 在 renderHouseList 方法中，判断 house 是否存在。
    4 不存在的时候，就渲染一个 loading 元素（防止拿不到数据时报错）。
    5 存在的时候，再渲染 HouseItem 组件。
  */

  // 用来获取更多房屋列表数据
  // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让Promise对象的状态变为已完成。
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    //   .then(response => {
    //     // Store response data in list...
    //   })
    // console.log(startIndex, stopIndex)

    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        // console.log('loadMoreRows：', res)
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })

        // 数据加载完成时，调用 resolve 即可
        resolve()
      })
    })
  }

  render() {
    const { count } = this.state
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
        <Sticky>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={count}
          >
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                        width={width} // 视口的宽度
                        height={height} // 视口的高度
                        rowCount={count} // List列表项的行数
                        rowHeight={120} // 每一行的高度
                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    )
  }
}
