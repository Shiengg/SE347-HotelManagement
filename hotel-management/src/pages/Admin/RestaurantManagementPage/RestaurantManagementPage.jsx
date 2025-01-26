import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Modal, Form, Input, Select, InputNumber, message, Space, Table, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CoffeeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const PageContainer = styled.div`
  padding: 12px;
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid gold;
`;

const HeaderSection = styled.div`
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

    .anticon {
      font-size: 24px;
      color: #1a3353;
    }
  }

  .text-content {
    h1 {
      margin: 0;
      font-size: 24px;
      color: #1a3353;
    }

    .subtitle {
      color: #6b7280;
      font-size: 14px;
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 600;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 12px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const MenuContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    width: 100%;
    height: 180px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .status-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background: ${props => props.isAvailable ? '#10b981' : '#ef4444'};
      color: white;
    }
  }

  .content {
    padding: 16px;

    .name {
      font-size: 16px;
      font-weight: 600;
      color: #1a3353;
      margin-bottom: 8px;
    }

    .category {
      margin-bottom: 8px;
    }

    .price {
      font-size: 15px;
      font-weight: 500;
      color: #059669;
      margin-bottom: 12px;
    }

    .stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .label {
          font-size: 12px;
          color: #6b7280;
        }

        .value {
          font-size: 14px;
          font-weight: 600;
          color: #1a3353;
        }
      }
    }
  }

  .actions {
    padding: 12px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
`;

const DetailContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 12px;
  border: 2px solid gold;
  height: fit-content;
`;

const RestaurantManagementPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/restaurant', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      message.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const url = editingItem 
        ? `http://localhost:5000/api/restaurant/${editingItem._id}`
        : 'http://localhost:5000/api/restaurant';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success(`Item ${editingItem ? 'updated' : 'created'} successfully`);
        setIsModalVisible(false);
        form.resetFields();
        fetchItems();
      } else {
        throw new Error('Failed to save item');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/restaurant/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        message.success('Item deleted successfully');
        fetchItems();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <PageContainer>
      <GridContainer>
        <ContentWrapper>
          <HeaderSection>
            <TitleSection>
              <div className="icon-wrapper">
                <CoffeeOutlined />
              </div>
              <div className="text-content">
                <h1>Restaurant Management</h1>
                <div className="subtitle">Manage your restaurant menu items</div>
              </div>
            </TitleSection>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingItem(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Add New Item
            </Button>
          </HeaderSection>

          <MenuContainer>
            {items.map(item => (
              <ItemCard key={item._id} isAvailable={item.isAvailable}>
                <div className="image-container">
                  <img 
                    src={item.image || 'https://via.placeholder.com/300x200'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200';
                    }}
                  />
                  <div className="status-badge">
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                <div className="content">
                  <div className="name">{item.name}</div>
                  <Tag className="category" color={
                    item.category === 'Food' ? 'green' :
                    item.category === 'Beverage' ? 'blue' :
                    'purple'
                  }>
                    {item.category}
                  </Tag>
                  <div className="price">
                    {item.price.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="stats">
                    <div className="stat-item">
                      <span className="label">Orders</span>
                      <span className="value">123</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Rate</span>
                      <span className="value">85%</span>
                    </div>
                  </div>
                </div>
                <div className="actions">
                  <Button
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(item);
                      form.setFieldsValue(item);
                      setIsModalVisible(true);
                    }}
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      Modal.confirm({
                        title: 'Are you sure you want to delete this item?',
                        content: 'This action cannot be undone.',
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk: () => handleDelete(item._id)
                      });
                    }}
                  />
                </div>
              </ItemCard>
            ))}
          </MenuContainer>
        </ContentWrapper>

        <DetailContainer>
          <h2>Restaurant Statistics</h2>
        </DetailContainer>
      </GridContainer>

      <StyledModal
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
      >
        <StyledForm
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isAvailable: true }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select>
              <Option value="Food">Food</Option>
              <Option value="Beverage">Beverage</Option>
              <Option value="Dessert">Dessert</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isAvailable"
            valuePropName="checked"
          >
            <Select>
              <Option value={true}>Available</Option>
              <Option value={false}>Unavailable</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingItem(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </StyledForm>
      </StyledModal>
    </PageContainer>
  );
};

export default RestaurantManagementPage; 