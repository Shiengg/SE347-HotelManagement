import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Modal, Form, Input, Select, InputNumber, message, Space, Table, Tag, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CoffeeOutlined, BarChartOutlined, LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const PageContainer = styled.div`
  padding: 12px;
  height: calc(100vh - 84px);
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid gold;
  height: 100%;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
  }
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
  height: 100%;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const MenuContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 16px;
  margin-bottom: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    width: 100%;
    height: 200px;
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

    .price-badge {
      position: absolute;
      bottom: 8px;
      right: 8px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.9);
      color: #059669;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .content {
    padding: 16px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .name {
        font-size: 16px;
        font-weight: 600;
        color: #1a3353;
      }
    }

    .stats {
      display: flex;
      gap: 24px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;

        .label {
          font-size: 13px;
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
`;

const DetailContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 12px;
  border: 2px solid gold;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
  }
`;

const FormWrapper = styled.div`
  padding: 16px;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

const ItemDetailSection = styled.div`
  padding: 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a3353;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #ffd700;
    display: flex;
    align-items: center;
    gap: 8px;

    .anticon {
      color: #ffd700;
    }
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #e2e8f0;

    .label {
      color: #6b7280;
      font-weight: 500;
    }

    .value {
      color: #1a3353;
      font-weight: 600;
    }
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    border-color: #ffd700;
    background: #fffef0;
  }

  input[type="file"] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
  }

  .image-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 8px;

    .icon {
      font-size: 24px;
      color: #bfbfbf;
      margin-bottom: 4px;
    }

    .ant-upload-text {
      font-size: 13px;
      color: #8c8c8c;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .main-text {
        font-weight: 500;
      }

      .sub-text {
        font-size: 12px;
        color: #bfbfbf;
      }
    }
  }
`;

// Thêm styled component cho EmptyState
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: #fff;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  margin: 24px 0;

  .icon {
    font-size: 48px;
    color: #94a3b8;
    margin-bottom: 16px;
  }

  .title {
    font-size: 1.2em;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #64748b;
    text-align: center;
    max-width: 400px;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  .add-button {
    padding: 12px 24px;
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    border: none;
    border-radius: 8px;
    color: #1a3353;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
`;

const RestaurantManagementPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

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

  // Cập nhật hàm resetForm
  const resetForm = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    setImageUrl(''); // Reset image URL
    form.resetFields();
  };

  // Cập nhật hàm handleSubmit
  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        // Xử lý update
        const response = await fetch(`http://localhost:5000/api/restaurant/${editingItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          message.success('Item updated successfully');
          fetchItems();
          resetForm(); // Sử dụng hàm resetForm
        }
      } else {
        // Xử lý create
        const response = await fetch('http://localhost:5000/api/restaurant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          message.success('Item created successfully');
          fetchItems();
          resetForm(); // Sử dụng hàm resetForm
        }
      }
    } catch (error) {
      message.error('Failed to save item');
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

  // Tính toán items cho trang hiện tại
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };

  // Thêm hàm xử lý upload ảnh
  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/restaurant/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.imageUrl);
        form.setFieldsValue({ image: data.imageUrl });
        message.success('Image uploaded successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      message.error('Failed to upload image');
    } finally {
      setUploading(false);
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
                setSelectedItem(null);
                setFormMode('create');
                form.resetFields();
              }}
            >
              Add New Item
            </Button>
          </HeaderSection>

          {items.length > 0 ? (
            <>
              <MenuContainer>
                {getCurrentPageItems().map(item => (
                  <ItemCard 
                    key={item._id} 
                    isAvailable={item.isAvailable}
                    onClick={() => {
                      setSelectedItem(item);
                      setFormMode('detail');
                    }}
                  >
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
                      <div className="price-badge">
                        {item.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                    <div className="content">
                      <div className="header">
                        <div className="name">{item.name}</div>
                        <Tag color={
                          item.category === 'Food' ? 'green' :
                          item.category === 'Beverage' ? 'blue' :
                          'purple'
                        }>
                          {item.category}
                        </Tag>
                      </div>
                      <div className="stats">
                        <div className="stat-item">
                          <span className="label">Orders:</span>
                          <span className="value">123</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Rate:</span>
                          <span className="value">85%</span>
                        </div>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </MenuContainer>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                  current={currentPage}
                  total={items.length}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <EmptyState>
              <CoffeeOutlined className="icon" />
              <div className="title">No Menu Items Found</div>
              <div className="subtitle">
                Get started by adding your first menu item. You can add food, beverages, or desserts to your restaurant menu.
              </div>
              <button 
                className="add-button"
                onClick={() => {
                  setEditingItem(null);
                  setSelectedItem(null);
                  setFormMode('create');
                  form.resetFields();
                }}
              >
                <PlusOutlined /> Add First Item
              </button>
            </EmptyState>
          )}
        </ContentWrapper>

        <DetailContainer>
          {formMode === 'create' ? (
            <FormWrapper>
              <DetailHeader>
                <div className="icon-wrapper">
                  <PlusOutlined />
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>Add New Item</h2>
                  <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Create a new menu item</p>
                </div>
              </DetailHeader>
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
                  label="Image"
                >
                  <ImageUpload>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {imageUrl ? (
                      <div className="image-preview" onClick={() => document.getElementById('imageInput').click()}>
                        <img src={imageUrl} alt="Preview" />
                      </div>
                    ) : (
                      <div className="upload-placeholder" onClick={() => document.getElementById('imageInput').click()}>
                        <div className="icon">
                          {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                        </div>
                        <div className="ant-upload-text">
                          <span className="main-text">Click to upload</span>
                          <span className="sub-text">PNG, JPG up to 10MB</span>
                        </div>
                      </div>
                    )}
                  </ImageUpload>
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
                    <Button onClick={resetForm}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                      {editingItem ? 'Update' : 'Create'}
                    </Button>
                  </Space>
                </Form.Item>
              </StyledForm>
            </FormWrapper>
          ) : (
            selectedItem && (
              <>
                <DetailHeader>
                  <div className="icon-wrapper">
                    <CoffeeOutlined />
                  </div>
                  <div>
                    <h2 style={{ margin: 0 }}>{selectedItem.name}</h2>
                    <Tag color={
                      selectedItem.category === 'Food' ? 'green' :
                      selectedItem.category === 'Beverage' ? 'blue' :
                      'purple'
                    }>
                      {selectedItem.category}
                    </Tag>
                  </div>
                </DetailHeader>

                <ItemDetailSection>
                  <div className="section-title">
                    <CoffeeOutlined />
                    Item Details
                  </div>
                  <div className="detail-row">
                    <span className="label">Price</span>
                    <span className="value">{selectedItem.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status</span>
                    <Tag color={selectedItem.isAvailable ? 'success' : 'error'}>
                      {selectedItem.isAvailable ? 'Available' : 'Unavailable'}
                    </Tag>
                  </div>
                  <div className="detail-row">
                    <span className="label">Description</span>
                    <span className="value">{selectedItem.description || 'No description'}</span>
                  </div>
                </ItemDetailSection>

                <ItemDetailSection>
                  <div className="section-title">
                    <BarChartOutlined />
                    Statistics
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Orders</span>
                    <span className="value">123</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Order Rate</span>
                    <span className="value">85%</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Revenue</span>
                    <span className="value">{(selectedItem.price * 123).toLocaleString('vi-VN')}đ</span>
                  </div>
                </ItemDetailSection>

                <Space style={{ justifyContent: 'flex-end' }}>
                  <Button 
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingItem(selectedItem);
                      form.setFieldsValue(selectedItem);
                      setIsModalVisible(true);
                    }}
                  >
                    Edit Item
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: 'Are you sure you want to delete this item?',
                        content: 'This action cannot be undone.',
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk: () => handleDelete(selectedItem._id)
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              </>
            )
          )}
        </DetailContainer>
      </GridContainer>

      <StyledModal
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        open={isModalVisible}
        onCancel={resetForm} // Sử dụng hàm resetForm
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
            label="Image"
          >
            <ImageUpload>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imageUrl ? (
                <div className="image-preview" onClick={() => document.getElementById('imageInput').click()}>
                  <img src={imageUrl} alt="Preview" />
                </div>
              ) : (
                <div className="upload-placeholder" onClick={() => document.getElementById('imageInput').click()}>
                  <div className="icon">
                    {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                  </div>
                  <div className="ant-upload-text">
                    <span className="main-text">Click to upload</span>
                    <span className="sub-text">PNG, JPG up to 10MB</span>
                  </div>
                </div>
              )}
            </ImageUpload>
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
              <Button onClick={resetForm}>Cancel</Button>
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