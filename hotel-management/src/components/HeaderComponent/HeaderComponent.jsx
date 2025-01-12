import React from "react";
import { Col } from "antd";
import { WrapperHeader } from "./style";
import logo from "../../images/logo2.png";
import SearchComponent from "../SearchComponent/SearchComponent";

const HeaderComponent = () => {
  return (
    <WrapperHeader>
      <img
        id="logo"
        src={logo}
        alt="Logo"
        style={{ width: "170px", height: "auto", borderRadius: "8px" }}
      />
      <SearchComponent />
    </WrapperHeader>
  );
};

export default HeaderComponent;
