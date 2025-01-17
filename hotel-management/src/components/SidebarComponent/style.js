import styled from "styled-components";

export const MenuWrapper = styled.div`
  background: #ffffff;
  padding: 24px 16px;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid #e5e7eb;

  @media (max-width: 680px) {
    padding: 20px 8px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 3px;
  }
`;

export const MenuSection = styled.div`
  margin-bottom: 16px;

  .section-title {
    font-size: 12px;
    text-transform: uppercase;
    color: #6b7280;
    font-weight: 600;
    margin: 16px 12px 8px;
    letter-spacing: 0.05em;

    @media (max-width: 680px) {
      display: none;
    }
  }
`;

export const MenuItem = styled.div`
  margin: 2px 0;

  a {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: #4b5563;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-weight: 500;
    font-size: 14px;

    .anticon {
      font-size: 20px;
      margin-right: 12px;
      opacity: 0.8;

      @media (max-width: 680px) {
        margin-right: 0;
        font-size: 22px;
      }
    }

    .text {
      font-size: 14px;
      
      @media (max-width: 680px) {
        display: none;
      }
    }

    &:hover {
      background: #f3f4f6;
      color: #4f46e5;

      .anticon {
        opacity: 1;
      }
    }

    &.active {
      background: #4f46e5;
      color: white;

      .anticon {
        opacity: 1;
      }
    }
  }

  @media (max-width: 680px) {
    a {
      padding: 12px;
      justify-content: center;
    }
  }
`;
