import React from 'react'

// 导入封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader'

// 导入样式
// import './index.scss'
import styles from './index.module.css'

// 解决脚手架中全局变量访问的问题
const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

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
            1 调用 Label 的 setContent() 方法，传入 HTML 结构，修改 HTML 内容的样式。
            2 调用 setStyle() 修改覆盖物样式。
            3 给文本覆盖物添加单击事件。

            <div class="${styles.bubble}">
              <p class="${styles.name}">${name}</p>
              <p>${num}套</p>
            </div>
          */
          const opts = {
            position: point,
            offset: new BMap.Size(-35, -35)
          }

          // 说明：设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
          const label = new BMap.Label('', opts)

          // 设置房源覆盖物内容
          label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">浦东</p>
              <p>99套</p>
            </div>
          `)

          // 设置样式
          label.setStyle(labelStyle)

          // 添加单击事件
          label.addEventListener('click', () => {
            console.log('房源覆盖物被点击了')
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
