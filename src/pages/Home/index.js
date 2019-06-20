import React from 'react'
// 导入路由
import { Route } from 'react-router-dom'
// 导入 TabBar
import { TabBar } from 'antd-mobile'

// 导入TabBar菜单的组件
import News from '../News'
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'

// 导入组件自己的样式文件
import './index.css'

// TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
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
        <Route exact path="/home" component={Index} />
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
