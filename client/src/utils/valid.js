const valid = ({ email, password, cf_password, username }) => {
  const err = {};

  if (!username) {
    err.username = "Vui lòng điển username!";
  } else if (username.length < 6) {
    err.username = "username phải có ít nhất 6 ký tự!";
  }

  if (!email) {
    err.email = "Vui lòng điển email!";
  } else if (!validateEmail(email)) {
    err.email = "Email không chính xác!";
  }

  if (!password) {
    err.password = "Vui lòng điển password!";
  } else if (password.length < 6) {
    err.password = "Password phải có ít nhất 6 ký tự!";
  }

  if (password !== cf_password) {
    err.cf_password = "Mật khẩu không trùng khớp!";
  }

  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

const validateEmail = (email) => {
  if (!email) return false;
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

export default valid;
