import { Toast } from "antd-mobile";
// import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import NavHeader from "../../components/NavHeader";
import { BASE_URL } from "../../utils/url";
import { API } from "../../utils/api";
import styles from "./index.module.css";
import HouseItem from "../../components/HouseItem";
const BMapGL = window.BMapGL;

const labelstyles = {
  cursor: "pointer",
  border: "0px solid rgb(255,0,0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(2255,255,255)",
  textAlign: "center",
};

export default class Map extends React.Component {
  state = {
    housesList: [],
    isShowList: false,
  };
  componentDidMount() {
    const { label, value } = JSON.parse(localStorage.getItem("local_city"));
    // 初始化地图实例
    //注意：在react脚手架中全局对象需要使用window来访问，否则，会造成EESLint校验错误
    var map = new BMapGL.Map("container");
    map.centerAndZoom(new BMapGL.Point(116.331398, 39.897445), 12);
    //创建地址解析器实例
    var myGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    this.map = map;
    myGeo.getPoint(
      label,
      async (point) => {
        map.centerAndZoom(point, 11);
        map.addControl(new BMapGL.ScaleControl());
        map.addControl(new BMapGL.ZoomControl());
        this.renderOverlays(value);
      },
      label
    );

    map.addEventListener("movestart", () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false,
        });
      }
    });
    map.addEventListener("click", () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false,
        });
      }
    });
  }
  async getHouseList(value) {
    try {
      Toast.loading("加载中...", 0, null, false);

      const res = await API.get(`/houses?cityId=${value}`);
      Toast.hide();
      console.log("res", res);
      this.setState({
        housesList: res.data.body.list,
        isShowList: true,
      });
    } catch (error) {
      Toast.hide();
    }
  }

  async renderOverlays(id) {
    try {
      Toast.loading("加载中...", 0, null, false);
      const res = await API.get(`/area/map?id=${id}`);
      Toast.hide();
      const data = res.data.body;

      const { nextZoom, type } = this.getTypeAndZoom();
      console.log(nextZoom, type);
      data.forEach((item) => {
        this.createOverlays(item, nextZoom, type);
      });
      return res;
    } catch (error) {
      Toast.hide();
    }
  }

  getTypeAndZoom() {
    let nextZoom, type;
    const zoom = this.map.getZoom();

    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13;
      type = "circle";
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15;
      type = "circle";
    } else if (zoom >= 14 && zoom < 15) {
      type = "rect";
    }
    return {
      nextZoom,
      type,
    };
  }

  createOverlays(item, nextZoom, type) {
    const {
      coord: { latitude, longitude },
      label: areaName,
      count,
      value,
    } = item;

    //创建点坐标
    const areaPoint = new BMapGL.Point(longitude, latitude);

    if (type === "circle") {
      this.createCircle(areaName, areaPoint, count, value, nextZoom);
    } else {
      this.createRect(areaName, areaPoint, count, value);
    }
  }

  createCircle(areaName, areaPoint, count, value, zoom) {
    const map = this.map;
    var label = new BMapGL.Label("", {
      // 创建文本标注
      position: areaPoint, // 设置标注的地理位置
      // offset: new BMapGL.Size(-35, -35), // 设置标注的偏移量
    });

    label.setStyle(labelstyles);

    label.id = value;
    label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${areaName}</p>
               <p>${count}</p>
            </div>
          `);

    label.addEventListener("click", () => {
      this.renderOverlays(value);
      console.log("点击了", label.id);
      map.centerAndZoom(areaPoint, zoom);
      map.clearOverlays();
    });
    map.addOverlay(label);
  }

  async createRect(areaName, areaPoint, count, value) {
    const res = await API.get(`/houses?cityId=${value}`);
    this.setState({
      houseList: res.data,
    });
    const map = this.map;
    var label = new BMapGL.Label("", {
      // 创建文本标注
      position: areaPoint, // 设置标注的地理位置
      // offset: new BMapGL.Size(-35, -35), // 设置标注的偏移量
    });

    label.setStyle(labelstyles);

    label.id = value;
    label.setContent(`
    <div class="${styles.rect}">
      <span class="${styles.housename}">${areaName}</span>
      <span class="${styles.housenum}">${count}</span>
      <i class="${styles.arrow}"></i>
      </div>
          `);

    label.addEventListener("click", (e) => {
      this.getHouseList(value);
      console.log(e);
      const target = e.domEvent.changedTouches[0];
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      );
    });
    map.addOverlay(label);
  }


  //房屋列表
  renderHousesList() {
    return this.state.housesList.map(
      (item) => (
        <HouseItem
          key={item.houseCode}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    );
  }
  
  render() {
    return (
      <div className={styles.map}>
        {/* 地图容器 */}
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}>
          {/* 房源详情 */}
        </div>
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : "",
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>
          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    );
  }
}
