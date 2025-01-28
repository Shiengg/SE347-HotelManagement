import React from 'react';
import styled from 'styled-components';
import InvoicePage from '../../InvoicePage/InvoicePage';

const PageContainer = styled.div`
  padding: 0px;
`;

const InvoicesManagementPage = () => {
  return (
    <PageContainer>
      <InvoicePage/>
    </PageContainer>
  );
};

export default InvoicesManagementPage; 