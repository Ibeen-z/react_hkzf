import React from 'react'

// 导入封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader'

// 导入样式
// import './index.scss'
import styles from './index.module.css'

export default class Map extends React.Component {
  componentDidMount() {
    /* 
      1 获取当前定位城市。
      2 使用地址解析器解析当前城市坐标。
      3 调用 centerAndZoom() 方法在地图中展示当前城市，并设置缩放级别为11。
      4 在地图中展示该城市，并添加实用控件。
    */

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
      <div className={styles.map}>
        {/* 顶部导航栏组件 */}
        <NavHeader>地图找房</NavHeader>
        {/* 地图容器元素 */}
        <div id="container" className={styles.container} />
      </div>
    )
  }
}
