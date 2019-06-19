import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}
        {/* Home 组件是父路由的内容 */}
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
      </div>
    </Router>
  )
}

export default App
