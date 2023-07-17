import React from "react";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";
import {BASE_URL} from '../../utils/url'
import {API} from '../../utils/api';

import "./index.css";
import SearchHeader from "../../components/SearchHeader";

import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";


import  {getCurrentCity} from '../../utils'

const nav = [
  { id: 1, title: "整租", icon: Nav1, path: "/home/list" },
  {
    id: 2,
    title: "合租",
    icon: Nav2,
    path: "/home/list",
  },
  {
    id: 3,
    title: "地图找房",
    icon: Nav3,
    path: "/map",
  },
  {
    id: 4,
    title: "去出租",
    icon: Nav4,
    path: "/home/list",
  },
];

//获取地理位置
navigator.geolocation.getCurrentPosition((position) =>
  console.log("position", position)
);
class Index extends React.Component {
  state = {
    swipers: [],
    isloaded: false,
    groups: [],
    news: [],
    curCityName:'上海'
  };
  async getSwipers() {
    const res = await API.get("/home/swiper");
    this.setState({
      swipers: res.data.body,
      isloaded: true,
    });
  }
  async getGroups() {
    const res = await API.get("/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      groups: res.data.body,
    });
  }
  async getNews() {
    const res = await API.get("/home/news", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      news: res.data.body,
    });
  }
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="www.baidu.com"
        style={{ display: "inline-block", width: "100%", height: 212 }}
      >
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
        />
      </a>
    ));
  }
  renderFlexItem() {
    return nav.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.icon} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }
  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={BASE_URL+item.imgSrc}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  }
 async  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();
    const curCity = await getCurrentCity()
    this.setState({
      curCityName:curCity.label
    })
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          {this.state.isloaded ? (
            <Carousel autoplay infinite>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}
          {/* 搜索框 */}
          <SearchHeader cityName={this.state.curCityName} />
        </div>
        {/* 导航菜单 */}
        <Flex className="nav" justify="center">
          {this.renderFlexItem()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            columnNum={2}
            hasLine={false}
            square={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={BASE_URL+ item.imgSrc} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 最新咨询 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
export default Index;
