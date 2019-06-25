import React from 'react'

// 导入封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader'

// 导入样式
// import './index.scss'
import styles from './index.module.css'

// 解决脚手架中全局变量访问的问题
const BMap = window.BMap

export default class Map extends React.Component {
  componentDidMount() {
    this.initMap()
  }

  // 初始化地图
  initMap() {
    /* 
      1 获取当前定位城市。
      2 使用地址解析器解析当前城市坐标。
      3 调用 centerAndZoom() 方法在地图中展示当前城市，并设置缩放级别为11。
      4 在地图中展示该城市，并添加比例尺和平移缩放控件。
    */

    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    console.log(label, value)

    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    const map = new BMap.Map('container')
    // 设置中心点坐标
    // const point = new window.BMap.Point(116.404, 39.915)

    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          //  初始化地图
          map.centerAndZoom(point, 11)
          // map.addOverlay(new BMap.Marker(point))

          // 添加常用控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())
        }
      },
      label
    )

    // 初始化地图
    // map.centerAndZoom(point, 15)
  }

  render() {
    return (
      <div className={styles.map}>
        {/* 顶部导航栏组件 */}
        <NavHeader>地图找房</NavHeader>
        {/* 地图容器元素 */}
        <div id="container" className={styles.container} />
      </div>
    )
  }
}
