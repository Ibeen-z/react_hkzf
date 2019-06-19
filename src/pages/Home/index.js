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

export default class Home extends React.Component {
  state = {
    // 默认选中的TabBar菜单项
    selectedTab: this.props.location.pathname
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
          <TabBar.Item
            title="首页"
            key="Life"
            icon={<i className="iconfont icon-ind" />}
            selectedIcon={<i className="iconfont icon-ind" />}
            selected={this.state.selectedTab === '/home/index'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/index'
              })

              // 路由切换
              this.props.history.push('/home/index')
            }}
            data-seed="logId"
          />
          <TabBar.Item
            icon={<i className="iconfont icon-findHouse" />}
            selectedIcon={<i className="iconfont icon-findHouse" />}
            title="找房"
            key="Koubei"
            selected={this.state.selectedTab === '/home/list'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/list'
              })
              // 路由切换
              this.props.history.push('/home/list')
            }}
            data-seed="logId1"
          />
          <TabBar.Item
            icon={<i className="iconfont icon-infom" />}
            selectedIcon={<i className="iconfont icon-infom" />}
            title="资讯"
            key="Friend"
            selected={this.state.selectedTab === '/home/news'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/news'
              })

              // 路由切换
              this.props.history.push('/home/news')
            }}
          />
          <TabBar.Item
            icon={<i className="iconfont icon-my" />}
            selectedIcon={<i className="iconfont icon-my" />}
            title="我的"
            key="my"
            selected={this.state.selectedTab === '/home/profile'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/profile'
              })
              // 路由切换
              this.props.history.push('/home/profile')
            }}
          />
        </TabBar>
      </div>
    )
  }
}
