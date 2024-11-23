const valid = ({ email, password, cf_password, username }) => {
  const err = {};

  if (!username) {
    err.username = "Vui lòng điền username!";
  } else if (username.length < 6) {
    err.username = "Username phải có ít nhất 6 ký tự!";
  }

  if (!email) {
    err.email = "Vui lòng điền email!";
  } else if (!validateEmail(email)) {
    err.email = "Email không chính xác!";
  }

  if (!password) {
    err.password = "Vui lòng điền password!";
  } else if (password.length < 6) {
    err.password = "Password phải có ít nhất 6 ký tự!";
  } else if (!validatePassword(password)) {
    err.password =
      "Password phải có ít nhất một ký tự hoa, một số và một ký tự đặc biệt!";
  }

  if (password !== cf_password) {
    err.cf_password = "Mật khẩu không trùng khớp!";
  }

  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

// Kiểm tra email hợp lệ
const validateEmail = (email) => {
  if (!email) return false;
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

// Kiểm tra password hợp lệ
const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
  return passwordRegex.test(password);
};

export default valid;
