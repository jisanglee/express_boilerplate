if (process.env.NODE_ENV === 'production') { //환경변수가 만약
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}