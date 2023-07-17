import React from "react";
import NavHeader from "../../components/NavHeader";
import { Flex, WingBlank } from "antd-mobile";
import { Link } from 'react-router-dom'
import { Form, Field, ErrorMessage } from 'formik'
import styles from "./index.module.css";

export default class Login extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <NavHeader className={styles.navbar}>账号登录</NavHeader>

        <WingBlank>
          <Form>
            {/* 账号 */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage
              className={styles.error}
              name="username"
              component="div"
            />
            {/* 密码 */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage
              className={styles.error}
              name="password"
              component="div"
            />
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}
