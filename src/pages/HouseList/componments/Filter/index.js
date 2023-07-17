import React from "react";
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import { Spring } from "react-spring/renderprops";
import { API } from "../../../../utils/api";
import styles from "./index.module.css";

const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: [],
};

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
export default class Filter extends React.Component {
  state = {
    titleSelectedStatus,
    openType: "",
    fifltData: {},
    selectedValues,
  };

  componentDidMount() {
    this.htmlBody = document.body;
    this.getFifltData();
  }

  async getFifltData() {
    const { value } = JSON.parse(localStorage.getItem("local_city"));
    const res = await API.get(`/houses/condition?id=${value}`);
    this.setState({
      fifltData: res.data.body,
    });
  }
  // 标题点击高亮
  onTitleClick = (type) => {
    this.htmlBody.className = "bodyHidden";
    const { titleSelectedStatus, selectedValues } = this.state;
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    Object.keys(titleSelectedStatus).forEach((key) => {
      if (key === type) {
        newTitleSelectedStatus[key] = true;
        return;
      }

      const selectedVal = selectedValues[key];

      //菜单高亮处理
      if (
        key === "area" &&
        (selectedVal.length !== 2 || selectedVal[0] !== "area")
      ) {
        newTitleSelectedStatus[key] = true;
      } else if (key === "mode" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[key] = true;
      } else if (key === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[key] = true;
      } else if (key === "more" && selectedVal.length !== 0) {
        newTitleSelectedStatus[key] = true;
      } else {
        newTitleSelectedStatus[key] = false;
      }
    });
    console.log("first", newTitleSelectedStatus);
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus,
    });
    // this.setState((prevState) => {
    //   return {
    //     titleSelectedStatus: {
    //       ...prevState.titleSelectedStatus,
    //       [type]: true,
    //     },
    //     openType: type,
    //   };
    // });
  };

  // 底部按钮（取消）
  onCancel = (type) => {
    // 确定处理高亮
    this.htmlBody.className = "";
    const { titleSelectedStatus, selectedValues } = this.state;
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    const selectedVal = selectedValues[type];

    //菜单高亮处理
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: "",
    });
  };

  // 底部按钮（确定）
  onSave = (type, value) => {
    this.htmlBody.className = "";
    // 确定处理高亮
    const { titleSelectedStatus } = this.state;
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    const selectedVal = value;

    //菜单高亮处理
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }

    // 点击确定筛选数据
    const newSelectValues = {
      ...this.state.selectedValues,
      [type]: value,
    };

    const { area, mode, price, more } = newSelectValues;

    // 筛选条件数据
    const fifter = {};

    //区域
    const areaKey = area[0];
    let areaValue = "null";
    if (area.length === 3) {
      areaValue = area[2] !== "null" ? area[2] : area[1];
    }

    fifter[areaKey] = areaValue;

    //方式和租金
    fifter.mode = mode[0];
    fifter.price = price[0];
    fifter.more = more.join(",");

    this.props.onFifter(fifter);
    console.log("fifter", fifter);

    this.setState({
      openType: "",
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectValues,
    });
  };

  // FilterPicker组件渲染方法
  renderFilterPicker = () => {
    const {
      openType,
      fifltData: { area, subway, price, rentType },
      selectedValues,
    } = this.state;

    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }

    // 给子组件pickview传递数据
    let data = [];
    let cols = 1; //行数
    let defaultValue = selectedValues[openType];
    console.log(defaultValue);
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        break;
      case "price":
        data = price;
        break;

      default:
        break;
    }

    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={this.state.openType}
        defaultValue={defaultValue}
      />
    );
  };
  renderFilterMore = () => {
    const {
      selectedValues,
      openType,
      fifltData: { roomType, oriented, floor, characteristic },
    } = this.state;
    if (openType !== "more") return null;

    const data = {
      roomType,
      oriented,
      floor,
      characteristic,
    };

    const defaultValue = selectedValues.more;
    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        defaultValue={defaultValue}
        onCancel={this.onCancel}
      />
    );
  };
  renderMasker() {
    const { openType } = this.state;

    const isHide = openType === "more" || openType === "";

    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {(props) => {
          if (props.opacity === 0) {
            return null;
          } else {
            return (
              <div
                style={props}
                className={styles.mask}
                onClick={() => this.onCancel(openType)}
              />
            );
          }
        }}
      </Spring>
    );
  }
  render() {
    const { titleSelectedStatus } = this.state;

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMasker()}
        
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
