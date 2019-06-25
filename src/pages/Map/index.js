import React from 'react'

// 导入axios
import axios from 'axios'

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
    // console.log(label, value)

    // 初始化地图实例
    const map = new BMap.Map('container')
    // 作用：能够在其他方法中通过 this 来获取到地图对象
    this.map = map
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async point => {
        if (point) {
          //  初始化地图
          map.centerAndZoom(point, 11)
          // 添加常用控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())

          // 调用 renderOverlays 方法
          this.renderOverlays(value)
          /* 
            渲染所有区覆盖物
          */
          /* const res = await axios.get(
            `http://localhost:8080/area/map?id=${value}`
          )
          res.data.body.forEach(item => {
            // 为每一条数据创建覆盖物
            const {
              coord: { longitude, latitude },
              label: areaName,
              count,
              value
            } = item

            // 创建坐标对象
            const areaPoint = new BMap.Point(longitude, latitude)
            // 创建覆盖物
            const label = new BMap.Label('', {
              position: areaPoint,
              offset: new BMap.Size(-35, -35)
            })

            // 给 label 对象添加一个唯一标识
            label.id = value

            // 设置房源覆盖物内容
            label.setContent(`
              <div class="${styles.bubble}">
                <p class="${styles.name}">${areaName}</p>
                <p>${count}套</p>
              </div>
            `)

            // 设置样式
            label.setStyle(labelStyle)

            // 添加单击事件
            label.addEventListener('click', () => {
              console.log('房源覆盖物被点击了', label.id)

              // 放大地图，以当前点击的覆盖物为中心放大地图
              map.centerAndZoom(areaPoint, 13)

              // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
              setTimeout(() => {
                // 清除当前覆盖物信息
                map.clearOverlays()
              }, 0)
            })

            // 添加覆盖物到地图中
            map.addOverlay(label)
          }) */
        }
      },
      label
    )
  }

  // 渲染覆盖物入口
  // 1 接收区域 id 参数，获取该区域下的房源数据
  // 2 获取房源类型以及下级地图缩放级别
  async renderOverlays(id) {
    const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    // console.log('renderOverlays 获取到的数据：', res)
    const data = res.data.body

    // 调用 getTypeAndZoom 方法获取级别和类型
    const { nextZoom, type } = this.getTypeAndZoom()

    data.forEach(item => {
      // 创建覆盖物
      this.createOverlays(item, nextZoom, type)
    })
  }

  // 计算要绘制的覆盖物类型和下一个缩放级别
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom() {
    // 调用地图的 getZoom() 方法，来获取当前缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type

    // console.log('当前地图缩放级别：', zoom)
    if (zoom >= 10 && zoom < 12) {
      // 区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制圆形覆盖物（区、镇）
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = 'rect'
    }

    return {
      nextZoom,
      type
    }
  }

  // 创建覆盖物
  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = data

    // 创建坐标对象
    const areaPoint = new BMap.Point(longitude, latitude)

    if (type === 'circle') {
      // 区或镇
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      // 小区
      this.createRect(areaPoint, areaName, count, value)
    }
  }

  // 创建区、镇覆盖物
  createCircle(point, name, count, id, zoom) {
    // 创建覆盖物
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-35, -35)
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', () => {
      // 调用 renderOverlays 方法，获取该区域下的房源数据
      this.renderOverlays(id)

      // 放大地图，以当前点击的覆盖物为中心放大地图
      this.map.centerAndZoom(point, zoom)

      // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
      setTimeout(() => {
        // 清除当前覆盖物信息
        this.map.clearOverlays()
      }, 0)
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
  }

  // 创建小区覆盖物
  /* 
    <div class="${styles.rect}">
      <span class="${styles.housename}">${name}</span>
      <span class="${styles.housenum}">${num}套</span>
      <i class="${styles.arrow}"></i>
    </div>
  */
  createRect(point, name, count, id) {
    // 创建覆盖物
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-50, -28)
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', () => {
      console.log('小区被点击了')
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
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
