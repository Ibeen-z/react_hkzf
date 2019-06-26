import React from 'react'

import { Flex } from 'antd-mobile'

// 导入路由的高阶组件
import { withRouter } from 'react-router-dom'

// 导入样式
import './index.scss'

function SearchHeader({ history }) {
  // 从本地存储中获取当前定位城市名称
  const curCityName = JSON.parse(localStorage.getItem('hkzf_city')).label

  return (
    <Flex className="search-box">
      {/* 左侧白色区域 */}
      <Flex className="search">
        {/* 位置 */}
        <div className="location" onClick={() => history.push('/citylist')}>
          <span className="name">{curCityName}</span>
          <i className="iconfont icon-arrow" />
        </div>

        {/* 搜索表单 */}
        <div className="form" onClick={() => history.push('/search')}>
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      {/* 右侧地图图标 */}
      <i className="iconfont icon-map" onClick={() => history.push('/map')} />
    </Flex>
  )
}

export default withRouter(SearchHeader)
