import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";
class Sticky extends Component {
  placeholder = createRef();
  content = createRef();
  handleScoll = () => {
    const { height } = this.props;
    const placeholderEl = this.placeholder.current;
    const contentEL = this.content.current;
    const { top } = placeholderEl.getBoundingClientRect();
    if (top < 0) {
      contentEL.classList.add(styles.fixed);
      placeholderEl.style.height = height + "px";
    } else {
      contentEL.classList.remove(styles.fixed);
      placeholderEl.style.height = "0px";
    }
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScoll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScoll);
  }
  render() {
    return (
      <div>
        <div ref={this.placeholder}></div>
        <div ref={this.content}>{this.props.children}</div>
      </div>
    );
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired,
};

export default Sticky;
