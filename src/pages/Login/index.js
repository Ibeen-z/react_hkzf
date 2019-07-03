import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

// 导入 API
import { API } from '../../utils'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

/* 
  登录功能：

  1 添加状态：username（账号） 和 password（密码）。
  2 使用受控组件方式获取表单元素值。
  3 给 form 表单添加 onSubmit。
  4 创建方法 handleSubmit，实现表单提交。

  5 在方法中，通过 username 和 password 获取到账号和密码。
  6 使用 API 调用登录接口，将 username 和 password 作为参数。
  7 判断返回值 status 为 200 时，表示登录成功。
  8 登录成功后，将 token 保存到本地存储中（hkzf_token）。
  9 返回登录前的页面。
*/

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  getUserName = e => {
    this.setState({
      username: e.target.value
    })
  }

  getPassword = e => {
    this.setState({
      password: e.target.value
    })
  }

  // 表单提交事件的事件处理程序
  handleSubmit = async e => {
    // 阻止表单提交时的默认行为
    e.preventDefault()

    // 获取账号和密码
    const { username, password } = this.state

    // console.log('表单提交了', username, password)
    // 发送请求
    const res = await API.post('/user/login', {
      username,
      password
    })

    console.log('登录结果：', res)
    const { status, body, description } = res.data

    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)
      this.props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  }

  render() {
    const { username, password } = this.state

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={username}
                onChange={this.getUserName}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={password}
                onChange={this.getPassword}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
