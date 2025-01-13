import React, { useState, useMemo, useEffect } from "react";
import InvoiceItemComponent from "../InvoiceItemComponent/InvoiceItemComponent";
import styled from "styled-components";
import Pagination from "../PaginationComponent/PaginationComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

const InvoiceListContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const InvoiceHeader = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;

  @media (max-width: 680px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-wrap: wrap;

  }
`;

const InvoiceHeaderItemLayout = styled.div`
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

  @media (max-width: 680px) {
    justify-content: flex-start;
  }
`;

const InvoiceHeaderId = styled.div`
  @media (max-width: 680px) {
    display: none;
  }
`;

const InvoiceFilter = styled.select`
  font-size: 1em;
  opacity: 0.7;
  border: none;
  user-select: none;
  outline: none;
  background: transparent;
  appearance: none; /* Removes the default browser styles */
  -webkit-appearance: none; /* Safari/WebKit specific */
  -moz-appearance: none; /* Firefox specific */
  padding: 0; /* Ensure no extra padding */
  margin: 0; /* Ensure no extra margin */
  box-shadow: none; /* Removes any shadow effects from the browser */
  option {
    color: grey; /* Default option text color */
    background-color: #fff; /* Background of options */
    font-weight: semi-bold;
  }
  padding: 2px 5px;
`;
const InvoiceListComponent = ({
  invoiceItems,
  selectedInvoice,
  handleSelect,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth > 680 ? 10 : 3;

  // Filter and sort states
  const [sortDate, setSortDate] = useState("asc"); // "asc" or "desc"
  const [sortTotal, setSortTotal] = useState("asc"); // "asc" or "desc" or ""
  const [filterStatus, setFilterStatus] = useState(""); // "paid" or "unpaid"
  const [filterMethod, setFilterMethod] = useState(""); // "cash", "credit", etc.

  // Filtered items
  const filteredItems = useMemo(() => {
    return invoiceItems.filter((item) => {
      const matchesStatus =
        filterStatus !== ""
          ? item.status === (filterStatus === "paid" ? 1 : 0)
          : true;
      const matchesMethod = filterMethod
        ? item.method === parseInt(filterMethod, 10)
        : true;
      return matchesStatus && matchesMethod;
    });
  }, [invoiceItems, filterStatus, filterMethod]);

  // Apply sorting
  const sortedItems = useMemo(() => {
    let items = [...filteredItems];
    if (sortDate) {
      items.sort((a, b) =>
        sortDate === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
    }
    if (sortTotal !== "") {
      items.sort((a, b) =>
        sortTotal === "asc" ? a.total - b.total : b.total - a.total
      );
    }
    return items;
  }, [filteredItems, sortDate, sortTotal]);

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2>Invoices</h2>
      <InvoiceHeader>
        <InvoiceHeaderId>ID</InvoiceHeaderId>
        <InvoiceHeaderItemLayout>
          Date
          <InvoiceFilter
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
          >
            <option value="asc">ASC</option>
            <option value="desc">DES</option>
          </InvoiceFilter>
        </InvoiceHeaderItemLayout>
        <InvoiceHeaderItemLayout>
          <div>Method: </div>
          <InvoiceFilter
            className=""
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="">All</option>
            <option value="1" style={{ color: "lime" }}>
              Cash
            </option>
            <option value="2" style={{ color: "blue" }}>
              Credit
            </option>
            <option value="3" style={{ color: "red" }}>
              Debit
            </option>
          </InvoiceFilter>
        </InvoiceHeaderItemLayout>
        <InvoiceHeaderItemLayout>
          <div>Status: </div>
          <InvoiceFilter
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="paid" style={{ color: "lime" }}>
              Paid
            </option>
            <option value="unpaid" style={{ color: "red" }}>
              Unpaid
            </option>
          </InvoiceFilter>
        </InvoiceHeaderItemLayout>

        <TotalSortingLayout>
          <div style={{ textAlign: "right" }}>Total: </div>
          <InvoiceFilter
            value={sortTotal}
            onChange={(e) => setSortTotal(e.target.value)}
          >
            <option value="">All</option>
            <option value="asc">ASC</option>
            <option value="desc"> DES</option>
          </InvoiceFilter>
        </TotalSortingLayout>
      </InvoiceHeader>
      <InvoiceListContainer>
        {currentItems.map((item) => (
          <InvoiceItemComponent
            key={item.id}
            item={item}
            isSelected={item.id === selectedInvoice?.id}
            onClick={() => handleSelect(item)}
          />
        ))}
      </InvoiceListContainer>
      <Pagination
        totalItems={sortedItems.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InvoiceListComponent;
