import React from "react";
import { Col } from "antd";
import { WrapperHeader } from "./style";
import logo from "../../images/logo2.png";
import SearchComponent from "../SearchComponent/SearchComponent";


const HeaderComponent = () => {
    return (
        <div>
            <WrapperHeader>
                <Col span={18} push={6}> <SearchComponent /></Col>
                <Col span={6} pull={18}><img src={logo} alt="Logo" style={{ width: "170px", height: "auto", borderRadius: "8px" }} />
                </Col>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent