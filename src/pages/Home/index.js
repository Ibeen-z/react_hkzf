import React from 'react'
import { Route } from 'react-router-dom'

import News from '../News'
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'

// 导入 TabBar
import { TabBar } from 'antd-mobile'

/* 
  1 根据 TabBar 组件 文档 设置不渲染内容部分（只保留菜单项，不显示内容）。
  2 给 TabBar.Item 绑定点击事件。
  3 在点击事件中调用 history.push() 实现路由切换。
  4 创建 TabBar 组件菜单项对应的其他 3 个组件，并在 Home 组件中配置路由信息。
  5 给菜单项添加 selected 属性，设置当前匹配的菜单项高亮。
*/

// 导入组件自己的样式文件
import './index.css'

// TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home/index'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

export default class Home extends React.Component {
  state = {
    // 默认选中的TabBar菜单项
    selectedTab: this.props.location.pathname
  }

  // 渲染 TabBar.Item
  renderTabBarItem() {
    return tabItems.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path
          })

          // 路由切换
          this.props.history.push(item.path)
        }}
      />
    ))
  }

  render() {
    // console.log(this.props.location.pathname)
    return (
      <div className="home">
        {/* 2.3 渲染子路由 */}
        <Route path="/home/news" component={News} />
        <Route path="/home/index" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/profile" component={Profile} />
        {/* TabBar */}

        <TabBar tintColor="#21b97a" noRenderContent={true} barTintColor="white">
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    )
  }
}
