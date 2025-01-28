const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Room = require('../models/Rooms');
const Invoice = require('../models/Invoice');
const mongoose = require('mongoose');

// Export các hàm controller
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'customerID',
        select: 'fullname email phone username'
      })
      .populate({
        path: 'receptionistID',
        select: 'fullname username'
      })
      .populate({
        path: 'roomID',
        select: 'roomNumber roomType dailyPrice hourlyPrice'
      })
      .populate({
        path: 'services.serviceID',
        select: 'serviceName servicePrice'
      });

    // Tính lại tổng tiền cho mỗi booking để đảm bảo chính xác
    const calculatedBookings = bookings.map(booking => {
      const roomPrice = booking.bookingType === 'Daily' 
        ? booking.roomID.dailyPrice * booking.totalDays
        : booking.roomID.hourlyPrice * booking.totalHours;

      const servicesPrice = booking.services.reduce((total, service) => 
        total + (service.serviceID.servicePrice * service.quantity), 0);

      booking.totalPrice = roomPrice + servicesPrice;
      return booking;
    });

    res.json(calculatedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// Thêm hàm helper để xử lý trạng thái phòng
const updateRoomStatus = async (roomId, bookingStatus, session) => {
  let roomStatus;
  switch (bookingStatus) {
    case 'Pending':
      roomStatus = 'Reserved';
      break;
    case 'Confirmed':
      roomStatus = 'Occupied';
      break;
    default:
      roomStatus = 'Available';
      break;
  }

  await Room.findByIdAndUpdate(
    roomId,
    { status: roomStatus },
    { session }
  );
};

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customerID,
      roomID,
      bookingType,
      checkInDate,
      checkOutDate,
      totalDays,
      totalHours,
      services,
      status,
      receptionistID,
      totalPrice: submittedTotalPrice
    } = req.body;

    // Log request data để debug
    console.log('Received booking data:', req.body);

    // Validate required fields
    if (!customerID || !roomID || !checkInDate || !checkOutDate || !receptionistID || !bookingType) {
      return res.status(400).json({ 
        message: 'Missing required fields'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(customerID) || 
        !mongoose.Types.ObjectId.isValid(roomID) || 
        !mongoose.Types.ObjectId.isValid(receptionistID)) {
      return res.status(400).json({ 
        message: 'Invalid ID format',
        invalidFields: {
          customerID: !mongoose.Types.ObjectId.isValid(customerID),
          roomID: !mongoose.Types.ObjectId.isValid(roomID),
          receptionistID: !mongoose.Types.ObjectId.isValid(receptionistID)
        }
      });
    }

    // Validate dates
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    if (startDate >= endDate) {
      return res.status(400).json({ 
        message: 'Check-out date must be after check-in date' 
      });
    }

    // Calculate prices and create booking
    let totalServicePrice = 0;
    const servicesWithPrice = await Promise.all(services.map(async (service) => {
      const serviceData = await Service.findById(service.serviceID);
      if (!serviceData) {
        throw new Error(`Service not found: ${service.serviceID}`);
      }
      const serviceTotal = serviceData.servicePrice * service.quantity;
      totalServicePrice += serviceTotal;
      return {
        serviceID: service.serviceID,
        quantity: service.quantity,
        totalPrice: serviceTotal
      };
    }));

    const room = await Room.findById(roomID);
    if (!room) {
      throw new Error('Room not found');
    }

    // Tính giá phòng dựa trên loại booking
    let roomPrice;
    if (bookingType === 'Daily') {
      roomPrice = room.dailyPrice * totalDays;
    } else {
      roomPrice = room.hourlyPrice * totalHours;
    }

    // Tính tổng tiền cuối cùng
    const calculatedTotalPrice = roomPrice + totalServicePrice;

    // Tạo booking với giá đã tính
    const booking = new Booking({
      customerID,
      receptionistID,
      roomID,
      bookingType,
      checkInDate,
      checkOutDate,
      totalDays,
      totalHours,
      services: servicesWithPrice,
      status: status || 'Pending',
      totalPrice: calculatedTotalPrice
    });

    const newBooking = await booking.save({ session });

    // Cập nhật trạng thái phòng dựa trên trạng thái booking
    const roomStatus = booking.status === 'Confirmed' ? 'Occupied' : 'Reserved';
    await Room.findByIdAndUpdate(
      booking.roomID,
      { status: roomStatus },
      { session }
    );

    // Tạo invoice khi booking được confirmed
    if (req.body.status === 'Confirmed') {
      const invoice = new Invoice({
        bookingID: booking._id,
        roomCharges: roomPrice,
        serviceCharges: totalServicePrice,
        restaurantCharges: 0,
        totalAmount: roomPrice + totalServicePrice,
        status: 'Pending'
      });

      await invoice.save({ session });

      // Cập nhật reference đến invoice trong booking
      booking.invoice = invoice._id;
      await booking.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json(newBooking);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerID', 'fullname email phone')
      .populate('receptionistID', 'fullname')
      .populate('roomID', 'roomNumber roomType price')
      .populate('services.serviceID', 'serviceName servicePrice');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateData = req.body;
    const booking = await Booking.findById(id)
      .populate('roomID')
      .populate('services.serviceID')
      .session(session);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Kiểm tra nếu booking đã completed thì không cho phép cập nhật
    if (booking.status === 'Completed') {
      throw new Error('Cannot update completed booking');
    }

    // Tính toán lại giá dịch vụ nếu có cập nhật services
    let totalServicePrice = 0;
    if (updateData.services) {
      updateData.services = await Promise.all(updateData.services.map(async (service) => {
        const serviceData = await Service.findById(
          typeof service.serviceID === 'string' ? service.serviceID : service.serviceID._id
        ).session(session);
        
        if (!serviceData) {
          throw new Error(`Service not found: ${service.serviceID}`);
        }
        
        const serviceTotalPrice = service.quantity * serviceData.servicePrice;
        totalServicePrice += serviceTotalPrice;
        
        return {
          serviceID: service.serviceID,
          quantity: service.quantity,
          totalPrice: serviceTotalPrice
        };
      }));
    }

    // Tính lại giá phòng
    const room = await Room.findById(booking.roomID).session(session);
    let roomPrice = 0;
    
    if (updateData.bookingType === 'Daily') {
      roomPrice = room.dailyPrice * updateData.totalDays;
    } else {
      roomPrice = room.hourlyPrice * updateData.totalHours;
    }

    // Cập nhật tổng giá
    updateData.totalPrice = roomPrice + totalServicePrice;

    // Cập nhật invoice nếu có
    const invoice = await Invoice.findOne({ bookingID: booking._id }).session(session);
    if (invoice) {
      invoice.roomCharges = roomPrice;
      invoice.serviceCharges = totalServicePrice;
      invoice.totalAmount = roomPrice + totalServicePrice + (invoice.restaurantCharges || 0);
      await invoice.save({ session });
    }

    // Nếu đang chuyển sang trạng thái Confirmed và chưa có invoice
    if (updateData.status === 'Confirmed' && booking.status === 'Pending' && !invoice) {
      const newInvoice = new Invoice({
        bookingID: booking._id,
        customerID: booking.customerID,
        roomCharges: roomPrice,
        serviceCharges: totalServicePrice,
        restaurantCharges: 0,
        totalAmount: roomPrice + totalServicePrice,
        paymentStatus: 'Unpaid',
        paymentMethod: null,
        paymentDate: null
      });
      await newInvoice.save({ session });

      // Cập nhật reference đến invoice trong booking
      booking.invoice = newInvoice._id;
    }

    // Cập nhật trạng thái phòng nếu cần
    if (updateData.status !== booking.status) {
      const roomStatus = updateData.status === 'Confirmed' ? 'Occupied' : 
                        updateData.status === 'Pending' ? 'Reserved' : 'Available';
      await Room.findByIdAndUpdate(
        booking.roomID._id,
        { status: roomStatus },
        { session }
      );
    }

    // Cập nhật booking
    Object.assign(booking, updateData);
    await booking.save({ session });

    await session.commitTransaction();

    // Trả về booking đã được cập nhật với thông tin đầy đủ
    const updatedBooking = await Booking.findById(id)
      .populate('customerID', 'fullname email phone')
      .populate('receptionistID', 'fullname')
      .populate('roomID', 'roomNumber roomType price')
      .populate('services.serviceID', 'serviceName servicePrice')
      .populate('invoice');

    res.json(updatedBooking);

  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating booking:', error);
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.deleteBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id).session(session);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Không cho phép xóa booking đã completed
    if (booking.status === 'Completed') {
      throw new Error('Cannot delete completed booking');
    }

    // Nếu booking đã confirmed, xóa invoice liên quan
    if (booking.status === 'Confirmed') {
      await Invoice.findOneAndDelete({ bookingID: booking._id }, { session });
    }

    // Cập nhật trạng thái phòng về Available
    await Room.findByIdAndUpdate(
      booking.roomID,
      { status: 'Available' },
      { session }
    );

    await Booking.findByIdAndDelete(booking._id, { session });

    await session.commitTransaction();
    res.json({ message: 'Booking deleted successfully' });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Thêm middleware để tự động cập nhật booking khi invoice được thanh toán
exports.handleInvoicePaid = async (bookingId, session) => {
  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Cập nhật trạng thái booking thành Completed
    booking.status = 'Completed';
    await booking.save({ session });

    // Cập nhật trạng thái phòng về Available
    await Room.findByIdAndUpdate(
      booking.roomID,
      { status: 'Available' },
      { session }
    );

    return booking;
  } catch (error) {
    throw error;
  }
};

exports.updateInvoiceWithRestaurantCharges = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId } = req.params;
    const { restaurantCharges, orderedItems } = req.body;

    // Validate restaurantCharges
    if (typeof restaurantCharges !== 'number' || isNaN(restaurantCharges)) {
      throw new Error('Invalid restaurant charges amount');
    }

    const booking = await Booking.findById(bookingId)
      .populate('roomID', 'dailyPrice hourlyPrice')
      .populate('services.serviceID', 'servicePrice')
      .session(session);
      
    if (!booking) {
      throw new Error('Booking not found');
    }

    const invoice = await Invoice.findOne({ bookingID: bookingId }).session(session);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // Lấy giá trị hiện tại của invoice
    const currentTotalAmount = invoice.totalAmount || 0;
    const currentRestaurantCharges = invoice.restaurantCharges || 0;
    const currentOrderedItems = invoice.orderedItems || [];

    // Cộng thêm restaurant charges mới vào giá trị hiện tại
    const newTotalAmount = currentTotalAmount + restaurantCharges;
    const newRestaurantCharges = currentRestaurantCharges + restaurantCharges;

    // Thêm timestamp vào mỗi order mới
    const newOrderItems = orderedItems.map(item => ({
      ...item,
      orderedAt: new Date()
    }));

    // Cập nhật invoice
    invoice.totalAmount = newTotalAmount;
    invoice.restaurantCharges = newRestaurantCharges;
    invoice.orderedItems = [...currentOrderedItems, ...newOrderItems];

    console.log('Updating invoice with values:', {
      previousTotalAmount: currentTotalAmount,
      newOrderAmount: restaurantCharges,
      newTotalAmount: newTotalAmount,
      previousRestaurantCharges: currentRestaurantCharges,
      newRestaurantCharges: newRestaurantCharges,
      previousOrderCount: currentOrderedItems.length,
      newOrderCount: newOrderItems.length,
      totalOrderCount: invoice.orderedItems.length
    });

    const updatedInvoice = await invoice.save({ session });
    await session.commitTransaction();

    res.json(updatedInvoice);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating invoice:', error);
    res.status(400).json({ 
      message: error.message,
      details: 'Failed to update invoice with restaurant charges'
    });
  } finally {
    session.endSession();
  }
};

exports.getCustomerBookings = async (req, res) => {
  try {
    console.log('User from request:', req.user); // Log user info

    const bookings = await Booking.find({ 
      customerID: req.user._id,
      status: 'Confirmed'
    })
    .populate({
      path: 'roomID',
      select: 'roomNumber roomType dailyPrice hourlyPrice'
    })
    .populate({
      path: 'customerID',
      select: 'fullname email phone'
    })
    .populate({
      path: 'services.serviceID',
      select: 'serviceName servicePrice'
    })
    .populate({
      path: 'invoice',
      select: 'roomCharges serviceCharges restaurantCharges totalAmount orderedItems'
    })
    .sort({ checkInDate: -1 });

    console.log('Found bookings:', bookings); // Log found bookings

    const calculatedBookings = bookings.map(booking => {
      const roomPrice = booking.bookingType === 'Daily' 
        ? booking.roomID.dailyPrice * booking.totalDays
        : booking.roomID.hourlyPrice * booking.totalHours;

      const servicesPrice = booking.services.reduce((total, service) => 
        total + (service.serviceID.servicePrice * service.quantity), 0);

      return {
        ...booking.toObject(),
        totalPrice: roomPrice + servicesPrice
      };
    });
    
    console.log('Calculated bookings:', calculatedBookings); // Log final result
    res.json(calculatedBookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: error.message });
  }
}; 