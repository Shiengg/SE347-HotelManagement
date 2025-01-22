export const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export const formatDate = (date) => {
    if(!date) return ''
    const newDate = new Date(date);  // Convert string to Date object
    
    // Extract the date parts
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(newDate.getDate()).padStart(2, '0');
    
    // Extract the time parts
    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const seconds = String(newDate.getSeconds()).padStart(2, '0');
    
    // Return the formatted date string
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  
