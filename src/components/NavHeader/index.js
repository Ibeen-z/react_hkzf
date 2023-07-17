import React from "react";
import { NavBar } from "antd-mobile";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./index.module.css";

function NavHeader({ children, className, history, onLeftClick, rightContent }) {
  const defaultClick = () => {
    history.go(-1);
  };
  return (
    <NavBar
      icon={<i className="iconfont icon-back" />}
      onLeftClick={onLeftClick || defaultClick}
      rightContent={rightContent}
      className={[styles.navBar, className || ''].join(' ')}
    >
      {children}
    </NavBar>
  );
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
  className: PropTypes.string,
  rightContent: PropTypes.array,
};

export default withRouter(NavHeader);
