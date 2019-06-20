import React from 'react'

// 导入组件
import { Carousel } from 'antd-mobile'

// 导入axios
import axios from 'axios'

/* 
  1 安装 axios：yarn add axios 。
  2 在 Index 组件中导入 axios 。
  3 在 state 中添加轮播图数据：swipers 。
  4 新建一个方法 getSwipers 用来获取轮播图数据，并更新 swipers 状态。
  5 在 componentDidMount 钩子函数中调用该方法。
  6 使用获取到的数据渲染轮播图。
*/

export default class Index extends React.Component {
  state = {
    // 轮播图状态数据
    swipers: []
  }

  // 获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    this.setState({
      swipers: res.data.body
    })
  }

  componentDidMount() {
    this.getSwipers()
  }

  // 渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  render() {
    return (
      <div className="index">
        <Carousel autoplay infinite autoplayInterval={5000}>
          {this.renderSwipers()}
        </Carousel>
      </div>
    )
  }
}
