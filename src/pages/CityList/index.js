import React from 'react'

// 导入axios
import axios from 'axios'

// 1 导入 NavBar组件
import { NavBar } from 'antd-mobile'

// 导入样式
import './index.scss'

// 导入 utils 中获取当前定位城市的方法
import { getCurrentCity } from '../../utils'

/*
// 接口返回的数据格式：
[{ "label": "北京", "value": "", "pinyin": "beijing", "short": "bj" }]

// 渲染城市列表的数据格式为：
{ a: [{}, {}], b: [{}, ...] }
// 渲染右侧索引的数据格式：
['a', 'b']
*/

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

export default class CityList extends React.Component {
  componentDidMount() {
    this.getCityList()
  }

  // 获取城市列表数据的方法
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    // console.log('城市列表数据：', res)
    const { cityList, cityIndex } = formatCityData(res.data.body)

    /* 
      1 获取热门城市数据
      2 将数据添加到 cityList 中
      3 将索引添加到 cityIndex 中
    */
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // console.log('热门城市数据：', hotRes)
    cityList['hot'] = hotRes.data.body
    // 将索引添加到 cityIndex 中
    cityIndex.unshift('hot')

    // 获取当前定位城市
    const curCity = await getCurrentCity()

    /* 
      1 将当前定位城市数据添加到 cityList 中
      2 将当前定位城市的索引添加到 cityIndex 中
    */
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
      </div>
    )
  }
}
