import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Table } from 'antd';
import InvoiceListComponent from "../../components/InvoiceListComponent/InvoiceListComponent";
import InvoiceDetailComponent from "../../components/InvoiceDetailComponent/InvoiceDetailComponent";
import { GenerateInvoice } from "../../utils/generator/Invoice";
import authService from "../../services/authService";
import {
  getCustomerInvoices,
  getInvoiceById,
  getInvoices,
} from "../../services/InvoiceService";

const PageWrapper = styled.div`
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -16px;
  padding: 0 16px;

  @media (max-width: 768px) {
    margin: 0 -8px;
    padding: 0 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    font-size: 14px;
    
    @media (max-width: 768px) {
      font-size: 13px;
    }
  }

  .ant-table-thead > tr > th {
    white-space: nowrap;
    background: #f8fafc;
    padding: 12px 16px;
    font-weight: 600;

    @media (max-width: 768px) {
      padding: 8px 12px;
    }
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: 8px 12px;
    }
  }

  @media (max-width: 576px) {
    .desktop-column {
      display: none;
    }
  }

  @media (min-width: 577px) {
    .mobile-column {
      display: none;
    }
  }
`;

const InvoiceContainer = styled.div`
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  -webkit-transform: translate3d(0,0,0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #1a1a1a;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  font-size: 1em;
  transform: translateZ(0);
  -webkit-transform: translate3d(0,0,0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

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
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transform: translateZ(0);
  -webkit-transform: translate3d(0,0,0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

const InvoiceDetailContainer = styled.div`
  padding: 20px;
  height: fit-content;
  min-height: 300px;
  max-width: 400px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateZ(0);
  -webkit-transform: translate3d(0,0,0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  @media (max-width: 1600px) {
    grid-row: 1;
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
