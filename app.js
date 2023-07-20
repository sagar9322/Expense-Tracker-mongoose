const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');


const app = express();
app.use(express.static(path.join(__dirname, 'views')));

app.use(cors());
app.use(express.json());


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require('./routes/user');
app.use(userRoutes);
app.use((req, res, next) =>{
  console.log("done");
  res.sendFile(path.join(__dirname, `views/${req.url}`));
})



mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@cluster0.nu2y6hy.mongodb.net/?retryWrites=true&w=majority`)
.then(result => {
  console.log("connected");
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})


