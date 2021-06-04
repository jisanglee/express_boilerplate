const express = require('express');
const app = express();
const port = 5000;

const config = require('./config/key')
const bodyParser = require('body-parser');
const { User } = require('./models/User');

//client에서 bodyParser를 통해 데이터 가져올수있게
//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

//application/json  //postman에서 json 타입으로 전송하는게 중요.
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!1111')
});
// 회원 가입을 위한 router
app.post('/register', (req, res) => {
    //회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 database에 넣음
    const user = User(req.body);
    
    //model안에 세이브 save하기전에 bcrypt로 비번을 암호화
    user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
    
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
