const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization');

        const user = jwt.verify(token, process.env.TOKEN_SECRET_KEY , function(err, decoded) {
            if (err) throw err;
            return decoded;
        });
        
        User.findById(user.userId).then(user => {
            req.user = user;
            next();
        })
    }catch(err){
        console.log(err);

    }
}