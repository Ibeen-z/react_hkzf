import React from "react";
import { List, AutoSizer } from "react-virtualized";
// import axios from "axios";
import { Toast } from 'antd-mobile'
// import Filter from "./componments/Filter";
import {API} from '../../utils/api';
import { getCurrentCity } from "../../utils";
import NavHeader from '../../components/NavHeader'
import './index.css'
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

function formatCityData(list) {
  const cityList = {};
  
  list.forEach((item) => {
    const frist = item.short.substr(0, 1);
    if (cityList[frist]) {
      cityList[frist].push(item);
    } else {
      cityList[frist] = [item];
    }
  });

  const cityIndex = Object.keys(cityList).sort();

  return { cityList, cityIndex };
}
const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
class City extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cityList: {},
      cityIndex: [],
      // 指定右侧字母索引列表高亮的索引号
      activeIndex: 0,
    };

    // 创建ref对象
    this.cityListComponent = React.createRef();
  }
  
  async componentDidMount() {
    await this.getCityList()
    // console.log( this.cityListComponent.current);
    this.cityListComponent.current.measureAllRows()
    
  }
  // 获取城市列表数据的方法
  async getCityList() {
    const res = await API.get("/area/city?level=1");
    const { cityList, cityIndex } = formatCityData(res.data.body);

    // 获取热门城市数据
    const hotRes = await API.get("/area/hot");
    cityList["hot"] = hotRes.data.body;
    cityIndex.unshift("hot");

    // 获取当前定位城市
    const curCity = await getCurrentCity();
    cityList["#"] = [curCity];
    cityIndex.unshift("#");

    // console.log(cityList, cityIndex, curCity)
    this.setState({
      cityList,
      cityIndex,
    });

    
  }

  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    // 获取到 cityIndex，并遍历其，实现渲染
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          // console.log('当前索引号：', this.cityListComponent.current)
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }
   // 用于获取List组件中渲染行的信息
   rowRendered = ({ startIndex }) => {
    // console.log('startIndex：', startIndex)
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }


  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在 List 中是可见的
    style, // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
  }) => {
    // 获取每一行的字母索引
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    // 获取指定字母索引下的城市列表数据
    // console.log(cityList[letter])

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      // 有
      localStorage.setItem('local_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源数据', 1, null, false)
    }
  }
  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    // 索引标题高度 + 城市数量 * 城市名称的高度
    // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    const { cityList, cityIndex } = this.state;
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
  };

  render() {
    return (
      <div className="citylist">
        <NavHeader>
          城市列表
        </NavHeader>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                ref={this.cityListComponent}
                // 组件的宽度
                width={width}
                // 组件的高度
                height={height}
                rowCount={this.state.cityIndex.length}
                // 每行的高度
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.rowRendered}
                scrollToAlignment="start"
              />
            );
          }}
        </AutoSizer>
        <ul  className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
export default City;
