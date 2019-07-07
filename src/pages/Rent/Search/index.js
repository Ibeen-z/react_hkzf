import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity, API } from '../../../utils'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value
  // 定时器id
  timerId = null

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  /* 
    关键词搜索小区信息

    1 给 SearchBar 组件，添加 onChange 配置项，获取文本框的值。
    2 判断当前文本框的值是否为空。
    3 如果为空，清空列表，然后 return，不再发送请求。
    4 如果不为空，使用 API 发送请求，获取小区数据。
    5 使用定时器 setTimeout 来延迟搜索，提升性能。
  */
  handleSearchTxt = value => {
    this.setState({ searchTxt: value })

    if (!value) {
      // 文本框的值为空
      return this.setState({
        tipsList: []
      })
    }

    // 清除上一次的定时器
    clearTimeout(this.timerId)

    this.timerId = setTimeout(async () => {
      // 获取小区数据
      const res = await API.get('/area/community', {
        params: {
          name: value,
          id: this.cityId
        }
      })

      // console.log(res)

      this.setState({
        tipsList: res.data.body
      })
    }, 500)
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleSearchTxt}
          showCancelButton={true}
          onCancel={() => history.go(-1)}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
