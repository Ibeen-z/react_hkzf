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
    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    console.log(label, value)

    // 初始化地图实例
    const map = new BMap.Map('container')
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          //  初始化地图
          map.centerAndZoom(point, 11)
          // 添加常用控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())

          /* 
            1 创建 Label 实例对象。
            2 调用 setStyle() 方法设置样式。
            3 在 map 对象上调用 addOverlay() 方法，将文本覆盖物添加到地图中。
          */
          const opts = {
            position: point
            // offset: new BMap.Size(30, -30)
          }

          const label = new BMap.Label('文本覆盖物', opts)

          // 设置样式
          label.setStyle({
            color: 'green'
          })

          // 添加覆盖物到地图中
          map.addOverlay(label)
        }
      },
      label
    )
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
