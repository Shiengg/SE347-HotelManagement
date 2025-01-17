import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #111827;
`;

const InvoicesManagementPage = () => {
  return (
    <PageContainer>
      <Title>Invoices Management</Title>
      {/* Add your invoices management content here */}
    </PageContainer>
  );
};

export default InvoicesManagementPage; 