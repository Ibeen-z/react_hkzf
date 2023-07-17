import React from "react";
import styles from "./index.module.css";
import { BASE_URL } from "../../utils/url";
class NoHouse extends React.Component {
    
  render() {
    const {children} = this.props
    return (
      <div className={styles.root}>
        <img
          className={styles.img}
          src={BASE_URL + "/img/not-found.png"}
          alt="暂无数据"
        />
        <p className={styles.msg}>{children}</p>
      </div>
    );
  }
}

export default NoHouse;
