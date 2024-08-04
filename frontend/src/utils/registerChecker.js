const registerDataChecker = (username, fullName, password, mobNo) => {
  const fields = {
    fullName: { value: fullName, message: "Please enter fullname" },
    username: { value: username, message: "Please enter username" },
    password: { value: password, message: "Please enter password" },
    mobNo: { value: mobNo, message: "Please enter mobile number" },
  };

  for (let f in fields) {
    if (fields[f].value?.trim() === "") {
      return fields[f].message;
    }
  }

  return null;
};

export default registerDataChecker;
