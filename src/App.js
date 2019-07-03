import React from 'react'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
// 房源详情组件
import HouseDetail from './pages/HouseDetail'
// 登录
import Login from './pages/Login'
import Registe from './pages/Registe'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 默认路由匹配时，跳转到 /home 实现路由重定向到首页 */}
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        {/* 配置路由 */}
        {/* Home 组件是父路由的内容 */}
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <Route path="/map" component={Map} />

        {/* 房源详情的路由规则： */}
        <Route path="/detail/:id" component={HouseDetail} />
        <Route path="/login" component={Login} />
        <Route path="/registe" component={Registe} />
      </div>
    </Router>
  )
}

export default App
