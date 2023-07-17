import React from "react";
import { Flex, Toast } from "antd-mobile";
import SearchHeader from "../../components/SearchHeader";
import Filter from "./componments/Filter";
import {
  List,
  WindowScroller,
  AutoSizer,
  InfiniteLoader,
} from "react-virtualized";
import Sticky from "../../components/Sticky";
import NoHouse from "../../components/NoHouse";
import {getCurrentCity} from '../../utils'
import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";
import styles from "./index.module.css";
import HouseItem from "../../components/HouseItem";
// import { useHistory } from 'react-router-dom'

// const { label, value } = JSON.parse(localStorage.getItem("local_city"));

class HouseList extends React.Component {
  state = {
    list: [],
    count: 0,
    isLoading: false,
  };

  label = ''
  value = ''
  fifter = {};
  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value
    this.searchHouses();
  }
  onFifter = (fifter) => {
    window.scrollTo(0, 0);
    this.fifter = fifter;
    console.log("first", fifter);
    this.searchHouses();
  };

  async searchHouses() {
    Toast.loading("加载中...", 0, null, false);
    this.setState({
      isLoading: true,
    });
    const res = await API.get("/houses", {
      params: {
        cityId: this.value,
        ...this.fifter,
        start: 1,
        end: 20,
      },
    });
    Toast.hide();
    const { list, count } = res.data.body;
    if (count !== 0) {
      Toast.info(`共找到${count}套房源`);
    }
    this.setState({
      list,
      count,
      isLoading: false,
    });
    console.log(res);
  }
  renderHouseList = ({ key, index, style }) => {
    const { list } = this.state;
    const house = list[index];

    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loadding}></p>
        </div>
      );
    }

    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
        onClick={()=>this.props.history.push(`/detail/${house.houseCode}`)}
      />
    );
  };

  isRowLoaded = (index) => {
    return !!this.state.list[index];
  };
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise((resolve) => {
      API.get("/houses", {
        params: {
          cityId: this.value,
          ...this.fifter,
          start: startIndex + 1,
          end: stopIndex,
        },
      }).then((res) => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list],
        });
      });
      resolve();
    });
  };

  renderList = () => {
    const { count, isLoading } = this.state;
    if (count === 0 && !isLoading) {
      return <NoHouse>没有搜索到房源,换个条件试试吧~</NoHouse>;
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    F
                    autoHeight
                    // 组件的宽度
                    width={width}
                    // 组件的高度
                    height={height}
                    rowCount={count}
                    // 每行的高度
                    rowHeight={120}
                    rowRenderer={this.renderHouseList}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  };
  render() {
    return (
      <div>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader cityName={this.label} className={styles.searchHeader} />
        </Flex>

        <Sticky height={40}>
          <Filter onFifter={this.onFifter} />
        </Sticky>

        {this.renderList()}
      </div>
    );
  }
}
export default HouseList;
