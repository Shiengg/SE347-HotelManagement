import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import InvoiceListComponent from "../../components/InvoiceListComponent/InvoiceListComponent";
import InvoiceDetailComponent from "../../components/InvoiceDetailComponent/InvoiceDetailComponent";
import { GenerateInvoice } from "../../utils/generator/Invoice";
import authService from "../../services/authService";
import {
  getCustomerInvoices,
  getInvoiceById,
  getInvoices,
} from "../../services/InvoiceService";

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  font-size: 1.2em;

  @media (max-width: 680px) {
    font-size: 0.9em;
  }

  @media (max-width: 1600px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
`;

const InvoiceListContainer = styled.div`
  padding: 20px;
  height: fit-content;
  border-radius: 20px; /* Bo góc */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */
  overflow-y: auto; /* Cuộn khi nội dung quá dài */
`;

const InvoiceDetailContainer = styled.div`
  padding: 20px;
  height: fit-content;
  min-height: 300px;
  max-width: 400px;
  border-radius: 20px; /* Bo góc */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */

  @media (max-width: 1600px) {
    grid-row: 1; /* Move to the second row on mobile */
    max-width: 100%;
  }
`;

const InvoicePage = () => {
  const [InvoiceItems, setInvoiceItems] = useState([]);

  const [selectedInvoice, setSelectedInvoice] = React.useState(null);

  const searchInvoice = async (id) => {
    try {
      getInvoiceById(id, authService.getCurrentUser().id).then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSelectedInvoice(data);
        } else {
          alert("Invoice not found");
        }
      });
    } catch (error) {
      console.error("Error searching invoices:", error);
      return null;
    }
  };

  const fetchInvoice = async (
    page,
    limit = 10,
    dateSort,
    paymentMethod,
    paymentStatus,
    totalAmountSort
  ) => {
    try {
      let response;
      if (
        authService.getCurrentUser().role === "admin" ||
        authService.getCurrentUser().role === "receptionist"
      ) {
        // Fetch all invoices if the user is an admin or receptionist
        response = await getInvoices(
          page,
          limit,
          dateSort,
          paymentMethod,
          paymentStatus,
          totalAmountSort
        );
      } else if (authService.getCurrentUser().role === "customer") {
        // Fetch customer-specific invoices
        response = await getCustomerInvoices(
          page,
          limit,
          dateSort,
          paymentMethod,
          paymentStatus,
          totalAmountSort,
          authService.getCurrentUser().id
        );
      } else {
        console.log("Unknown role");
        return;
      }

      console.log(response);

      // Update the state with fetched invoices
      setInvoiceItems(response.data);

      return response;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <LayoutWrapper>
      {/* Invoice List */}
      <InvoiceListContainer className="panel">
        <InvoiceListComponent
          invoiceItems={InvoiceItems}
          selectedInvoice={selectedInvoice}
          handleSelect={setSelectedInvoice}
          handlePagination={fetchInvoice}
          handleSearchInvoice={searchInvoice}
        />
      </InvoiceListContainer>

      {/* Invoice Detail */}
      {selectedInvoice && (
        <InvoiceDetailContainer className="panel">
          <InvoiceDetailComponent selectedInvoice={selectedInvoice} />
        </InvoiceDetailContainer>
      )}
    </LayoutWrapper>
  );
};

export default InvoicePage;
