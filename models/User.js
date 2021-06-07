const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //salt가몇글자인지? 10자리.
const jwt = require('jsonwebtoken');
const config = require('../config/key');


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
    } else {
        //다른것을 바꾸는 경우 바로 next
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //비밀번호 비교시 plainPassword가 그냥 비밀번호(ex 1234567) 암호화된 비밀번호!#!#^^ 두개가 맞는지 체크를 해야함. 복호화를 다시 할순없음.
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
            //비교했을시 에러는 없고 매치한다면 콜백으로 에러는 null, isMatch=true를 날린다.
        cb(null, isMatch);
    })
}

//jsonwebtoken 을 이용해서 토큰 생성하기
userSchema.methods.generateToken = function (cb) {
    var user = this
    var token = jwt.sign(user._id.toJSON(), config.token) //user.id+'secretToken' = token  .toJSON()이나  .toHexString()을 붙여줘야한다. 그래야 string type이됨. user._id는 타입이 오브젝트임.
    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null,user) //여기서 이 정보가 index에서 토큰생성하는 부분으로 콜백쏨.
    })
}

//토큰 복호화 하고 디비에서 유저 찾는 메소드
userSchema.statics.findByToken = function (token,cb) {
    var user = this;
    //token decode
    jwt.verify(token, config.token, function (err, decoded) {
        //유저 아이디 이용해서 유저를 찾은 다음에 클라에서 가져온 토큰과 디비에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}

//스키마 model로 감싸기
const User = mongoose.model('User', userSchema)

module.exports = { User }