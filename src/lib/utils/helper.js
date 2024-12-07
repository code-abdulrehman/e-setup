export const generateRandomId =() => {
    // Generate an array of random IDs (5 numbers)
    randomId = Math.floor(Math.random() * 1000)
    return randomId
  }


  export const formatDate = (dateString, month='long') => {
    const options = { year: 'numeric', month: month, day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Add more helper functions as needed
  