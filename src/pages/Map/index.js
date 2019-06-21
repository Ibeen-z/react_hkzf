import React from 'react'

// 导入样式
import './index.scss'

export default class Map extends React.Component {
  componentDidMount() {
    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    const map = new window.BMap.Map('container')
    // 设置中心点坐标
    const point = new window.BMap.Point(116.404, 39.915)
    // 初始化地图
    map.centerAndZoom(point, 15)
  }
  render() {
    return (
      <div className="map">
        {/* 地图容器元素 */}
        <div id="container" />
      </div>
    )
  }
}
