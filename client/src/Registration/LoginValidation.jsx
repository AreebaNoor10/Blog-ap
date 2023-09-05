function validation(values) {
    let error = {};
  
    if (values.email === "") {
      error.email = "Email should not be empty";
    } else {
      error.email = "";
    }
  
    if (values.password === "") {
      error.password = "Password should not be empty";
    } else {
      error.password = "";
    }
  
    // Check if there are any errors, and return null if no errors
    for (let key in error) {
      if (error[key] !== "") {
        return error; // There are errors, return the error object
      }
    }
  
    return null; // No errors, return null
  }
  
  export default validation;
  