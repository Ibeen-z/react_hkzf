import Home from "./pages/Home";
import { BrowserRouter as Router, Route ,Redirect } from "react-router-dom";
import React from "react";
import Map from './pages/Map'
import CityList from './pages/CityList'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
function App() {
  return (
    <Router>
      <div className="App">
      <Route path="/" render={()=><Redirect to= '/login'/>}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/detail/:id" component={HouseDetail}></Route>
        <Route path="/login" component={Login}></Route>
      </div>
    </Router>
  );
}

export default App;
