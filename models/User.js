const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //salt가몇글자인지? 10자리.



const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    email: {
        type: String,
        trim: true,
        unique:1
    },
    password: {
        type: String,
        minlength:5
    },
    lastname: {
        type: String,
        maxlength:50
    },
    role: {
        type: Number,
        default:0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type:Number
    }
})

//user save하기전에 이걸 진행하고 그다음에 저장을함.
userSchema.pre('save', function (next) {
    var user = this;

    //password가 변할때만 암호화 해준다(다른것이 바뀔때 암호화를 다시하면 안되므로)
    if (user.isModified('password')) {
        
        //비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB. hash가 암호화된 비번.
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    }
})

//스키마 model로 감싸기
const User = mongoose.model('User', userSchema)

module.exports = { User }