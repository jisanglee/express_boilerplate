const express = require('express');
const app = express();
const port = 5000;

const config = require('./config/key')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');
//client에서 bodyParser를 통해 데이터 가져올수있게
//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

//application/json  //postman에서 json 타입으로 전송하는게 중요.
app.use(bodyParser.json());
//cookie-parser 사용
app.use(cookieParser());


//mongodb connection
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!1111')
});
// 회원 가입을 위한 router
app.post('/api/users/register', (req, res) => {
    //회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 database에 넣음
    const user = User(req.body);
    
    //model안에 세이브 save하기전에 bcrypt로 비번을 암호화
    user.save((err, userInfo) => {
    if (err) return res.json({ registerSuccess: false, err })
    return res.status(200).json({
      registerSuccess: true
    })
  })  
})

// login route
app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾음
    User.findOne({ email: req.body.email }, (err, user) => {
        // console.log(user)
        if (!user) {
            return res.json({
                loginSuccess: false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청한 데이터가 데이터베이스에 있다면 비밀번호가 맞는비번인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            //비번이 맞다면 토큰 생성.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //토큰을 저장한다 어디에 ? 쿠키도 되고 세션도 되고 로컬스토리즈도 되고. 각기 장단점이있음. 여기선 쿠키에 저장해본다.
                res.cookie("x_auth", user.token)
                    .status(200)
                .json({loginSuccess:true,userId:user._id})

            })
        })
    })
})
//auth route 
//end point에서 req받아서 콜백 펑션 하기 전에 auth미들웨어에서 무언가(여기선 인증처리) 처리해줌.
//cookie에서 저장된 token을 서버에서 가져와서 복호화 >> 복호화 하면 userID가 나오는데 그 아이디를 이용해서 데이터베이스 Users(기본적으로 s를 붙여 생성이되어있음) Collection에서 유저를 찾은 후 쿠키에서 받아온 token이 유저도 갖고있는지 확인. 일치하면 authentication true, 그 해당하는 유저의 정보들을 선별해서
app.get('/api/users/auth', auth, (req, res) => {
  //  여기에 왔다는건 미들웨어를 잘 통화해서 Authentication이 True 임.
    //클라에 status200과 정보 전달 그리고 role에따라 일반유저>>0 아니면 관리자
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth:true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image:req.user.image,
    })
})

//logout
app.get('/api/users/logout', auth, (req, res) => {
    //유저 id로 찾기
    User.findOneAndUpdate({ _id: req.user._id },
    //토큰 지우기
        { token: "" },
        (err, user) => {
            if (err) return res.json({ logoutSuccess: false, err });
            return res.status(200).send({
                logoutSuccess:true
            })
        }
    )
})


//hello
app.get('/api/hello', (req, res) => {
    res.send('Hello Guys!!');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
