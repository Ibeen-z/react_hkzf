import React from 'react'

/* 
  1 安装：yarn add react-router-dom
  2 导入路由组件：Router / Route / Link
  3 在 pages 文件夹中创建 Home/index.js 和 CityList/index.js 两个组件(页面)
  4 使用 Route 组件配置首页和城市选择页面
*/

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from './pages/CityList'

// 导入要使用的组件
import { Button } from 'antd-mobile'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 项目根组件 <Button>登录</Button> */}

        {/* 配置导航菜单 */}
        <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/citylist">城市选择</Link>
          </li>
        </ul>

        {/* 配置路由 */}
        {/* Home 组件是父路由的内容 */}
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
      </div>
    </Router>
  )
}

export default App
