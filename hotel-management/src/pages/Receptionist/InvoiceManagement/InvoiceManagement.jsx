import React from "react";
import styled from "styled-components";
import InvoicePage from "../../InvoicePage/InvoicePage";

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  overflow-x: hidden;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  @media (max-width: 768px) {
    padding: 16px;
    min-height: calc(100vh - 56px);
  }

  @media print {
    padding: 0;
    background: white;
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  transform: translateZ(0);
  -webkit-transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }

  @media print {
    box-shadow: none;
    padding: 0;
  }
`;

const InvoiceWrapper = styled.div`
  transform: translateZ(0);
  -webkit-transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const InvoiceManagement = () => {
  return <InvoicePage />;
};

export default InvoiceManagement;
