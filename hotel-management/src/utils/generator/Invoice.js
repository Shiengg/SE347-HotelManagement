export const GenerateInvoice = (n = 1) => {
      const mockServices = [
        { id: 1, name: "Food and drinks", price: 1000000, quantity: 1 },
        { id: 2, name: "Cleaning", price: 2000000, quantity: 1 },
        { id: 3, name: "Room Reservation", price: 2000000, quantity: 1 },
      ]
      const mockPaymentMethod = [
        "Cash","Credit Card","Debit Card"
      ]
  
    return Array.from({ length: n }, (_, index) => {
      const randomDate = new Date(
        2021,
        7, // August (0-indexed)
        Math.floor(Math.random() * 30) + 1
      )
        .toISOString()
        .split("T")[0];
  
      const services = mockServices.map((service) => ({
        ...service,
        quantity: Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
      }));
  
      const totalAmount = services.reduce(
        (sum, service) => sum + service.price * service.quantity,
        0
      );
  
      return {
        id: index + 1,
        created_at: randomDate,
        paymentMethod: mockPaymentMethod[Math.floor(Math.random() * 3)], // Random integer 1-3 (e.g., 1 = Cash, 2 = Credit, 3 = Debit)
        paymentStatus: Math.random() < 0.5, // Random integer 0 or 1
        totalAmount, // Calculated total
        services,
      };
    });
  };
  