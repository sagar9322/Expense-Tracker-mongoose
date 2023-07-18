const express = require('express');
const cors = require('cors');
const User = require('./models/userSignUp');
const ExpenseDetail = require('./models/expense');
const Income = require('./models/income');
const Order = require('./models/orders');
const Leaderboard = require('./models/leaderboard');
const ForgotPasswordRequest = require('./models/forgotPassword');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');


const app = express();
app.use(express.static(path.join(__dirname, 'views')));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'acess.log'), {flag: 'a'});
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));
const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
app.use(userRoutes);
app.use((req, res, next) =>{
  console.log("done");
  res.sendFile(path.join(__dirname, `views/${req.url}`));
})


User.hasMany(ExpenseDetail, { onDelete: 'CASCADE' });
ExpenseDetail.belongsTo(User);
Income.hasMany(User);
User.hasMany(Income, { onDelete: 'CASCADE' });
User.hasMany(Order, { onDelete: 'CASCADE' });
Order.belongsTo(User);
Leaderboard.hasMany(User);
User.hasOne(Leaderboard, { onDelete: 'CASCADE' });
User.hasMany(ForgotPasswordRequest, { onDelete: 'CASCADE' });




sequelize
  .sync()
  .then(result => {
    // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT ||3000);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });