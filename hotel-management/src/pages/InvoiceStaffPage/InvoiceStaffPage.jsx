import React, { useMemo } from "react";
import styled from "styled-components";
import InvoiceListComponent from "../../components/InvoiceListComponent/InvoiceListComponent";
import InvoiceDetailComponent from "../../components/InvoiceDetailComponent/InvoiceDetailComponent";
import { GenerateInvoice } from "../../utils/generator/Invoice";

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;

  @media (max-width: 1600px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;

  }
`;

const InvoiceListContainer = styled.div`
  background-color: #e8e8f0; /* Màu nền */
  padding: 20px;
  height: fit-content;
  border-radius: 20px; /* Bo góc */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */
  overflow-y: auto; /* Cuộn khi nội dung quá dài */
`;

const InvoiceDetailContainer = styled.div`
  background-color: #e8e8f0; /* Màu nền */
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

const InvoiceStaffPage = () => {
  const InvoiceItems = useMemo(() => GenerateInvoice(20), []);

  const [selectedInvoice, setSelectedInvoice] = React.useState(InvoiceItems[0]);
  return (
    <LayoutWrapper>
      {/* Invoice List */}
      <InvoiceListContainer>
        <InvoiceListComponent
          invoiceItems={InvoiceItems}
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
