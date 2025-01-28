const API_URL = "http://localhost:5000/api";
export const getInvoices = async (
  page = 1,
  limit = 10,
  dateSort,
  paymentMethod,
  paymentStatus,
  totalAmountSort
) => {
  try {
    // Initialize the query parameters
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append("page", page);
    params.append("limit", limit);

    // Conditionally add sorting and filtering parameters
    if (dateSort) params.append("dateSort", dateSort); // e.g., "asc" or "desc"
    if (paymentMethod) params.append("paymentMethod", paymentMethod); // e.g., "Cash"
    if (paymentStatus !== undefined)
      params.append("paymentStatus", paymentStatus); // e.g., true/false
    if (totalAmountSort) params.append("totalAmountSort", totalAmountSort); // e.g., "asc" or "desc"

    // Build the full API URL with query parameters
    const apiUrl = `${API_URL}/invoices?${params.toString()}`;
    // Build the API URL with pagination query parameters
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the invoices data
    return data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error; // Propagate the error
  }
};

export const getCustomerInvoices = async (
  page = 1,
  limit = 10,
  dateSort,
  paymentMethod,
  paymentStatus,
  totalAmountSort,
  customerId
) => {
  try {
    // Initialize query parameters
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append("page", page);
    params.append("limit", limit);

    // Conditionally add filtering and sorting parameters
    if (dateSort) params.append("dateSort", dateSort); // e.g., "asc" or "desc"
    if (paymentMethod) params.append("paymentMethod", paymentMethod); // e.g., "Cash"
    if (paymentStatus !== undefined)
      params.append("paymentStatus", paymentStatus); // e.g., true/false
    if (totalAmountSort) params.append("totalAmountSort", totalAmountSort); // e.g., "asc" or "desc"

    // Build the full API URL with customer ID and query parameters
    const apiUrl = `${API_URL}/invoices/customer/${customerId}?${params.toString()}`;
    // Build the API URL with pagination query parameters and customer ID
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch customer invoices");
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the invoices data for the customer
    return data;
  } catch (error) {
    console.error("Error fetching customer invoices:", error);
    throw error; // Propagate the error
  }
};

export const getInvoiceById = async (id, userId) => {
  if (!id) return;
  try {
    const response = await fetch(
      `${API_URL}/invoices/${id.trim()}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch invoice");
    }

    // Parse the JSON response
    const data = await response.json();
    console.log(data);
    // Return the invoices data for the customer
    return data;
  } catch (error) {
    console.error("Error searching invoice:", error);
    throw error; // Propagate the error
  }
};
