import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Button, Badge, Tag, InputNumber, message, Modal, Spin, Select, Empty } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MenuSection = styled.div`
  .ant-card {
    margin-bottom: 16px;
  }
`;

const CartSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 24px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
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

    @media (max-width: 576px) {
      height: 180px;
    }

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
      background: #10b981;
      color: white;
    }

    .price-badge {
      position: absolute;
      bottom: 12px;
      right: 12px;
      padding: 10px 16px;
      border-radius: 25px;
      background: #ffcc00;
      color: #1a3353;
      font-size: 16px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(255, 204, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 4px;
      backdrop-filter: blur(4px);
      border: 2px solid rgba(255, 255, 255, 0.5);
      transform: translateY(0);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 204, 0, 0.4);
        background: #ffd700;
      }

      .currency {
        font-size: 14px;
        font-weight: 500;
        opacity: 0.8;
      }

      @media (max-width: 576px) {
        padding: 8px 12px;
        font-size: 14px;
      }
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

    .description {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @media (max-width: 576px) {
      padding: 12px;

      .header {
        .name {
          font-size: 15px;
        }
      }
    }
  }
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  .item-info {
    flex: 1;
    margin-right: 16px;
  }

  .item-name {
    font-weight: 500;
  }

  .item-price {
    color: #666;
    font-size: 0.9em;
  }
`;

const TotalSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #eee;
  
  .total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &.final {
      font-size: 1.2em;
      font-weight: bold;
      color: #1890ff;
    }
  }
`;

const BookingSelect = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;

  .select-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #1a3353;
    font-weight: 500;
  }

  .ant-select {
    width: 100%;
  }

  .booking-option {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .room-number {
      font-weight: 500;
      color: #1a3353;
    }
    
    .dates {
      font-size: 12px;
      color: #666;
    }
  }
`;

const BookingOption = styled.div`
  padding: 8px 0;

  .room-number {
    font-weight: 600;
    color: #1a3353;
    font-size: 15px;
    margin-bottom: 4px;
  }

  .dates {
    color: #666;
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .price {
    font-weight: 500;
    font-size: 14px;
  }
`;

const CustomerRestaurant = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null); // Lấy từ URL hoặc props
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/restaurant', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setMenuItems(data.filter(item => item.isAvailable));
      } catch (error) {
        message.error('Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Thêm useEffect để fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Please login first');
          return;
        }

        const response = await fetch('http://localhost:5000/api/bookings/customer', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch bookings');
        }

        const data = await response.json();
        console.log('Fetched bookings:', data); // Log để debug

        if (data.length === 0) {
          message.info('You have no active bookings');
        }

        setBookings(data);
      } catch (error) {
        console.error('Error:', error);
        message.error(error.message);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i._id === item._id);
      if (existingItem) {
        return prevCart.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!selectedBooking) {
      message.error('Please select a booking first');
      return;
    }

    try {
      const orderTotal = calculateTotal();

      // Validate total before sending
      if (typeof orderTotal !== 'number' || isNaN(orderTotal)) {
        throw new Error('Invalid order total');
      }

      const orderItems = cart.map(item => ({
        itemId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking._id}/update-invoice`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          restaurantCharges: orderTotal,
          orderedItems: orderItems
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const updatedInvoice = await response.json();
      console.log('Updated invoice:', updatedInvoice);

      message.success('Order placed successfully');
      setCart([]);
    } catch (error) {
      console.error('Checkout error:', error);
      message.error(error.message);
    }
  };

  return (
    <PageContainer>
      <MenuSection>
        <h1>Restaurant Menu</h1>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Loading menu items...</div>
          </div>
        ) : (
          <MenuGrid>
            {menuItems.map(item => (
              <ItemCard key={item._id}>
                <div className="image-container">
                  <img
                    src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <div className="status-badge">
                    Available
                  </div>
                  <div className="price-badge">
                    <span>{item.price.toLocaleString('vi-VN')}</span>
                    <span className="currency">₫</span>
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
                  <div className="description">
                    {item.description || 'No description available'}
                  </div>
                  <div className="footer">
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                        message.success(`Added ${item.name} to cart`);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </ItemCard>
            ))}
          </MenuGrid>
        )}
      </MenuSection>

      <CartSection>
        <h2>Your Order</h2>

        <BookingSelect>
          <div className="select-header">
            <span>Select Your Booking</span>
          </div>
          <Select
            loading={bookingsLoading}
            placeholder="Choose a booking"
            value={selectedBooking?._id}
            onChange={(value) => {
              const booking = bookings.find(b => b._id === value);
              setSelectedBooking(booking);
            }}
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ color: '#666' }}>
                    No active bookings found.<br />
                    Please make a booking first.
                  </div>
                }
              />
            }
            style={{ width: '100%' }}
          >
            {bookings.map(booking => (
              <Option key={booking._id} value={booking._id}>
                <BookingOption>
                  <div className="room-number">
                    Room {booking.roomID?.roomNumber} - {booking.roomID?.roomType}
                  </div>
                  <div className="dates">
                    Check-in: {dayjs(booking.checkInDate).format('DD/MM/YYYY HH:mm')}
                    <br />
                    Check-out: {dayjs(booking.checkOutDate).format('DD/MM/YYYY HH:mm')}
                  </div>
                  <div className="price" style={{ color: '#00a854' }}>
                    Total: {booking.totalPrice?.toLocaleString('vi-VN')}đ
                  </div>
                </BookingOption>
              </Option>
            ))}
          </Select>
        </BookingSelect>

        {cart.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your cart is empty"
          />
        ) : (
          <>
            {cart.map(item => (
              <CartItem key={item._id}>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
                <InputNumber
                  min={0}
                  value={item.quantity}
                  onChange={(value) => updateQuantity(item._id, value)}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item._id)}
                />
              </CartItem>
            ))}

            <TotalSection>
              {selectedBooking && (
                <>
                  <div className="total-row">
                    <span>Room:</span>
                    <span>#{selectedBooking.roomID.roomNumber}</span>
                  </div>
                  <div className="total-row final">
                    <span>Total Amount:</span>
                    <span>{calculateTotal().toLocaleString('vi-VN')}đ</span>
                  </div>
                </>
              )}
            </TotalSection>

            <Button
              type="primary"
              block
              size="large"
              style={{ marginTop: 16 }}
              disabled={!selectedBooking || cart.length === 0}
              onClick={handleCheckout}
            >
              Place Order
            </Button>
          </>
        )}
      </CartSection>
    </PageContainer>
  );
};

export default CustomerRestaurant; 