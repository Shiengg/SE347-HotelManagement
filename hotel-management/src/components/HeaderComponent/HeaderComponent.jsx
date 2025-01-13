import React from "react";
import { Col } from "antd";
import { LogoName, LogoWrapper, WrapperHeader } from "./style";
import logo from "../../svg/AppLogo.svg";
import SearchComponent from "../SearchComponent/SearchComponent";

const HeaderComponent = () => {
  return (
    <WrapperHeader>
      <LogoWrapper id="logo">
        <img
          src={logo}
          alt="Logo"
          style={{ width: "32px", height: "auto" }}
        />
        <LogoName>Le Continental</LogoName>
      </LogoWrapper>
      <SearchComponent />
    </WrapperHeader>
  );
};

export default HeaderComponent;
