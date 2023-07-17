import React from "react";
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";

import "./index.css";
import News from "../News";
import Index from "../Index";
import HouseList from "../HouseList";
import Profile from "../Profile";



const tabBarItem = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/list",
  },
  {
    title: "咨询",
    icon: "icon-infom",
    path: "/home/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/my",
  },
];
class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
  };

  TabBarItem(){
    return tabBarItem.map(item =>
      <TabBar.Item
      title={item.title}
      key={item.title}
      icon={<i className={`iconfont ${item.icon}`}></i>}
      selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
      selected={this.state.selectedTab === item.path}
      onPress={() => {
        this.setState({
          selectedTab: item.path,
        });
        this.props.history.push( item.path);
      }}
    ></TabBar.Item>
    )
  }
  componentDidUpdate(prevprops){
    if (prevprops.location.pathname!==this.props.location.pathname){
      this.setState({
        selectedTab:this.props.location.pathname
      })
    }
  }
  render() {
    return (
      <div className="home">
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/my" component={Profile}></Route>
        
        <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent="true">
          {this.TabBarItem()}
        </TabBar>
      </div>
    );
  }
}
export default Home;
