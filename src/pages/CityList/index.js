import React from 'react'

import axios from 'axios'
import { NavBar } from 'antd-mobile'

// 导入 List 组件
import { List, AutoSizer } from 'react-virtualized'

import './index.scss'
// 导入 utils 中获取当前定位城市的方法
import { getCurrentCity } from '../../utils'

// 数据格式化的方法
// list: [{}, {}]
const formatCityData = list => {
  const cityList = {}
  // const cityIndex = []

  // 1 遍历list数组
  list.forEach(item => {
    // 2 获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 3 判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 4 如果有，直接往该分类中push数据
      // cityList[first] => [{}, {}]
      cityList[first].push(item)
    } else {
      // 5 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })

  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}

/* 
  1 打开 AutoSizer 高阶组件的文档。
  2 导入 AutoSizer 组件。
  3 通过 render-props 模式，获取到 AutoSizer 组件暴露的 width 和 height 属性。
  4 设置 List 组件的 width 和 height 属性。
  5 设置城市选择页面根元素高度 100% ，让 List 组件占满整个页面。
  6 调整样式，让页面不要出现全局滚动条，避免顶部导航栏滚动。
*/

// 列表数据的数据源
const list = Array(100).fill('react-virtualized')

// 渲染每一行数据的渲染函数
// 函数的返回值就表示最终渲染在页面中的内容
function rowRenderer({
  key, // Unique key within array of rows
  index, // 索引号
  isScrolling, // 当前项是否正在滚动中
  isVisible, // 当前项在 List 中是可见的
  style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
}) {
  return (
    <div key={key} style={style}>
      1232 -{list[index]} {index} {isScrolling + ''}
    </div>
  )
}

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

export default class CityList extends React.Component {
  componentDidMount() {
    this.getCityList()
  }

  // 获取城市列表数据的方法
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(res.data.body)

    // 获取热门城市数据
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')

    // 获取当前定位城市
    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')

    console.log(cityList, cityIndex, curCity)
  }

  render() {
    return (
      <div className="citylist">
        {/* 顶部导航栏 */}
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>

        {/* 城市列表 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={list.length}
              rowHeight={50}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
