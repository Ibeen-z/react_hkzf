import React from 'react'

/* 
  1 在 pages 文件夹中创建 News/index.js 组件
  2 在 Home 组件中，添加一个 Route 作为子路由（嵌套的路由）的出口
  3 设置嵌套路由的 path，格式以父路由 path 开头（父组件展示，子组件才会展示）
*/

// 2.1 导入路由
import { Route } from 'react-router-dom'

// 2.2 导入News组件
import News from '../News'

export default class Home extends React.Component {
  render() {
    return (
      <div style={{ backgroundColor: 'skyblue', padding: 10 }}>
        首页
        {/* 2.3 渲染子路由 */}
        <Route path="/home/news" component={News} />
      </div>
    )
  }
}
