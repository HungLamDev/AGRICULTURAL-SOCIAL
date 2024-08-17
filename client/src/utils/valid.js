const valid = ({fullname, username, email, password, cf_password, gender}) => {
      const err = {}

      if(!fullname) {
            err.fullname ='Vui lòng điển đầy đủ họ và tên!'
      }else if(fullname.length > 25){
            err.fullname ='Họ và tên phải nhỏ hơn 25 ký tự '
      }

      if(!username) {
            err.username ='Vui lòng điền tên!'
      }else if (username.replace(/ /g, '').length > 25){
            err.username ='Tên của phải nhỏ hơn 25 ký tự '
      }

      if(!email) {
            err.email ='Vui lòng điển email!'
      }else if (!validateEmail(email)){
            err.email ='Email không chính xác!'
      }

      if(!password) {
            err.password ='Vui lòng điển password!'
      }else if (password.length < 6){
            err.password ='Password phải có ít nhất 6 ký tự!'
      }

      if(password !== cf_password) {
            err.cf_password ='Mật khẩu không trùng khớp!'
      }

      return {
            errMsg: err,
            errLength: Object.keys(err).length
      }
}


const validateEmail = (email) => {
      return String(email)
          .toLowerCase()
          .match(
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          );
  };

export default valid