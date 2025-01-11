import React, { useMemo } from "react";
import styled from "styled-components";
import InvoiceListComponent from "../../components/InvoiceListComponent/InvoiceListComponent";
import InvoiceDetailComponent from "../../components/InvoiceDetailComponent/InvoiceDetailComponent";
import { GenerateInvoice } from "../../utils/generator/Invoice";

const LayoutWrapper = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  height: 100vh; /* Full viewport height */

  @media (max-width: 1600px) {
    display: grid; /* Switch to grid layout on mobile */
    grid-template-columns: 1fr;
    gap: 10px;
    text-align: left;
  }
`;

const InvoiceListContainer = styled.div`
  background-color: #e8e8f0; /* Màu nền */
  padding: 20px;
  width: 100%;
  height: fit-content;
  border-radius: 30px; /* Bo góc */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */
  overflow-y: auto; /* Cuộn khi nội dung quá dài */
`;

const InvoiceDetailContainer = styled.div`
  background-color: #e8e8f0; /* Màu nền */
  padding: 20px;
  height: fit-content;
  min-height: 300px;
  width: 100%;
  max-width: 400px;
  border-radius: 30px; /* Bo góc */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */

  @media (max-width: 1080px) {
    max-width: 100%;
  }
`;

const InvoiceStaffPage = () => {
  const InvoiceItems = useMemo(() => GenerateInvoice(10), []);

  const [selectedInvoice, setSelectedInvoice] = React.useState(InvoiceItems[0]);
  return (
    <LayoutWrapper>
      {/* Invoice List */}
      <InvoiceListContainer>
        <InvoiceListComponent
          invoiceItems={InvoiceItems.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )}
          selectedInvoice={selectedInvoice}
          handleSelect={setSelectedInvoice}
        />
      </InvoiceListContainer>

      {/* Invoice Detail */}
      <InvoiceDetailContainer>
        <InvoiceDetailComponent selectedInvoice={selectedInvoice} />
      </InvoiceDetailContainer>
    </LayoutWrapper>
  );
};

export default InvoiceStaffPage;
