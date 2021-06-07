const { User } = require('../models/User');
let auth = (req, res, next) => {
    //인증 처리를 하는 곳
    //클라이언트 쿠키에서 토큰을 가져옴 쿠키 파서 이용함.
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후 디비에서 유저 찾기
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });
        
        //req에 토큰과 유저를 넣어주는 이유는 여기서 넣어줘야 auth에서 사용가능하기 때문. 안넣어주면 그냥 미들웨어까지만임.
        req.token = token;
        req.user = user;
        next();
    })
    //유저가 있으면 인증 O 없으면 X
}

module.exports = { auth };