import React, { useState, useMemo, useEffect, useRef } from "react";
import InvoiceItemComponent from "../InvoiceItemComponent/InvoiceItemComponent";
import styled from "styled-components";
import Pagination from "../PaginationComponent/PaginationComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faCoins,
  faCreditCard,
  faMoneyBill,
  faReceipt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Input, Select, Space } from "antd";
import PaymentStatusComponent from "../PaymentStatusComponent/PaymentStatusComponent";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseSquareOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeaderSection = styled.div`
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const SearchSection = styled.div`
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 30px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #1a3353;
  font-size: 1.8em;
  font-weight: 600;

  @media (max-width: 680px) {
    font-size: 1.3em;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9em;
`;
const InvoiceListContainer = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const InvoiceFilterSection = styled.div`
  font-size: 1.2em;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

  border: 1px solid #eee;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;

  @media (max-width: 1600px) {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  @media (max-width: 680px) {
    font-size: 0.8em;
  }
`;

const InvoiceFilterItemLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
`;
const TotalSortingLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 5px;
  align-items: center;

  @media (max-width: 1600px) {
    justify-content: flex-start;
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    padding: 0 16px !important;
    border-radius: 8px !important;
    border: 1.5px solid #eee !important;

    .ant-select-selection-item {
      line-height: 45px !important;
      font-size: 1.2em;
      @media (max-width: 680px) {
        font-size: 1em;
      }
    }
  }

  &:hover .ant-select-selector {
    border-color: #ffd700 !important;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #ffd700 !important;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2) !important;
  }
`;

const InvoiceHeaderId = styled.div`
  @media (max-width: 1600px) {
    display: none;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 40px;
  padding: 5px 7px;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 1.2em;
  background: linear-gradient(
    135deg,
    #ffcc00,
    #ff9900
  ); /* Gold to Orange gradient */
`;

const SearchButton = styled.button`
  background: black;
  cursor: pointer;
  border-radius: 50%;
  aspect-ratio: 1/1;
  height: 42px;
  color: white;
  font-size: 1em;

  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 680px) {
    height: 32px;
  }
`;

export const SearchBox = styled.input`
  font-size: 0.8em;
  padding: 0px 5px;
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
`;
const InvoiceListComponent = ({
  invoiceItems = [],
  selectedInvoice,
  handleSelect,
  handlePagination,
  handleSearchInvoice,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = isMobile ? 5 : 10;

  // Filter and sort states
  const [sortDate, setSortDate] = useState("desc"); // "asc" or "desc"
  const [sortTotal, setSortTotal] = useState("all"); // "asc" or "desc" or "all"
  const [filterStatus, setFilterStatus] = useState("all"); // true or false or "all"
  const [filterMethod, setFilterMethod] = useState("all"); // "cash", "credit", etc.

  const searchRef = useRef("");

  const handleKeyDown = (event) => {
    // Disable space key
    if (event.key === " ") {
      event.preventDefault();
    }

    // Detect when Enter key is pressed
    if (event.key === "Enter") {
      handleSearchInvoice(searchRef.current.value);
    }
  };
  const fetchInvoices = () => {
    setIsLoading(true);
    handlePagination(
      currentPage,
      itemsPerPage,
      sortDate,
      filterMethod,
      filterStatus,
      sortTotal
    ).then((data) => {
      setTotalInvoices(data?.totalInvoices);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [sortDate, sortTotal, filterMethod, filterStatus, currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(totalInvoices / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ContentLayout>
      <HeaderSection>
        <TitleSection>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faReceipt} size="xl" />
          </div>
          <div className="text-content">
            <Title>Invoices Management</Title>
            <Subtitle>Manage your invoices</Subtitle>
          </div>
        </TitleSection>
      </HeaderSection>

      <InvoiceFilterSection>
        <InvoiceHeaderId>ID</InvoiceHeaderId>
        <InvoiceFilterItemLayout>
          Date
          <StyledSelect
            value={sortDate}
            onChange={(value) => setSortDate(value)}
          >
            <Option value="asc">
              <Space>Oldest</Space>
            </Option>
            <Option value="desc">
              <Space>Newest</Space>
            </Option>
          </StyledSelect>
        </InvoiceFilterItemLayout>
        <InvoiceFilterItemLayout>
          <div>Method: </div>
          <StyledSelect
            className=""
            value={filterMethod}
            onChange={(value) => setFilterMethod(value)}
          >
            <Option value="all">
              <Space>
                <FontAwesomeIcon icon={faCoins} />
                All
              </Space>
            </Option>
            <Option value="Cash">
              <Space style={{ color: "#10b981" }}>
                <FontAwesomeIcon icon={faMoneyBill} />
                Cash
              </Space>
            </Option>
            <Option value="CreditCard">
              <Space style={{ color: "#6366f1" }}>
                <FontAwesomeIcon icon={faCreditCard} />
                Credit
              </Space>
            </Option>
            <Option value="DebitCard">
              <Space style={{ color: "#ef4444" }}>
                <FontAwesomeIcon icon={faCreditCard} />
                Debit
              </Space>
            </Option>
          </StyledSelect>
        </InvoiceFilterItemLayout>
        <InvoiceFilterItemLayout>
          <div>Status: </div>
          <StyledSelect
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
          >
            <Option value="all">
              <Space>
                <CheckCircleOutlined />
                All Status
              </Space>
            </Option>
            <Option value={true}>
              <Space>
                <CheckCircleOutlined style={{ color: " #10b981" }} />
                Paid
              </Space>
            </Option>
            <Option value={false}>
              <Space>
                <CloseCircleOutlined style={{ color: "#ef4444" }} />
                Unpaid
              </Space>
            </Option>
          </StyledSelect>
        </InvoiceFilterItemLayout>

        <TotalSortingLayout>
          <div style={{ textAlign: "right" }}>Total: </div>
          <StyledSelect
            value={sortTotal}
            onChange={(value) => setSortTotal(value)}
          >
            <Option value="all">
              <Space>
                <UnorderedListOutlined />
                Unsorted
              </Space>
            </Option>
            <Option value="asc">
              <Space>
                <SortAscendingOutlined />
                Low to High
              </Space>
            </Option>
            <Option value="desc">
              <Space>
                <SortDescendingOutlined />
                High to Low
              </Space>
            </Option>
          </StyledSelect>
        </TotalSortingLayout>
      </InvoiceFilterSection>

      <SearchSection>
        <SearchWrapper>
          <SearchBox
            ref={searchRef}
            placeholder="Invoice id"
            onKeyDown={handleKeyDown}
          />
          <SearchButton
            onClick={() => {
              handleSearchInvoice(searchRef.current.value);
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </SearchButton>
        </SearchWrapper>
      </SearchSection>
      <InvoiceListContainer>
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, i) => (
              <InvoiceItemComponent key={i} isLoading={true} />
            ))
          : invoiceItems.map((item) => (
              <InvoiceItemComponent
                key={item._id}
                item={item}
                isSelected={item._id === selectedInvoice?._id}
                onClick={() => handleSelect(item)}
              />
            ))}
      </InvoiceListContainer>
      <Pagination
        totalItems={totalInvoices}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </ContentLayout>
  );
};

export default InvoiceListComponent;
