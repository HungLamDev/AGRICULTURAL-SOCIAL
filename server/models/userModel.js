const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
      fullname:{
            type: String,
            require: true,
            trim: true, 
            maxlength: 25,
      },
      username:{
            type: String,
            require: true,
            trim: true, 
            maxlength: 25,
            unique: true
      },
      email:{
            type: String,
            require: true,
            trim: true, 
            unique: true
      },
      password:{
            type: String,
            require: true,
      },
      avatar:{
            type: String,
            default: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
      },
      role:{
            type: String,
            default: 'user'
      },
      gender:{
            type: String,
            default: 'Nam'
      },
      mobile:{
            type: String,
            default: ''
      },
      address:{
            type: String,
            default: ''
      },
      story:{
            type: String,
            default: '',
            maxlength: 200
      },
      website:{
            type: String,
            default: 'male'
      },
      followers:[{
            type: mongoose.Types.ObjectId, 
            ref: 'user'
      }],
      following:[{
            type: mongoose.Types.ObjectId, 
            ref: 'user'
      }],
      

},{
      timeseries: true
})

module.exports = mongoose.model('user', userSchema)