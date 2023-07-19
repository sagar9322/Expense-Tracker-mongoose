const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RazorPay = require('razorpay');
const Order = require('../models/orders');
const Leaderboard = require('../models/leaderboard');
const ForgotPassword = require('../models/forgotPassword');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
require('dotenv').config();

function generateAccessToken(id) {
    return jwt.sign({ userId: id }, process.env.TOKEN_SECRET_KEY);
}

exports.postUserDetails = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const availableUser = await User.find({ email: email });

        if (availableUser.length !== 0) {
            
            return res.status(409).json({ message: 'User is already available' });
        }else{
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await new User({
                name: name,
                email: email,
                password: hashedPassword,
                isPremeumuser: false,
                expenseId: [],
                income: 0,
                orderId: [],
                forgotPasswordId: []
            })
            await user.save()
    
            res.status(200).json({ message: "submitted" });
        }

        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error occurred while saving user details" });
    }
};

exports.getUserDetail = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        

        if (!user) {
            return res.status(404).json({ message: "Email or Password doesn't match" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({ message: 'Login Successfully', token: generateAccessToken(user._id) });
        } else {
            return res.status(401).json({ message: "Password is incorrect" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.buyPremium = async (req, res, next) => {
    try {
        const rzp = new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 250;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            try {
                
                const order1 = new Order({
                    paymentid: null,
                    orderid: order.id,
                    status: order.status
                })
                await order1.save();
                await User.findByIdAndUpdate(req.user, { $push: { orderId: order1._id } }, { new: true });
                res.status(201).json({ order1, key_id: rzp.key_id });
            } catch (err) {
                throw new Error(err);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
};

exports.updatePremium = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.paymentid = payment_id;
        order.status = "SUCCESSFUL"
        order.save();

        const user = await User.findById(req.user)
             user.isPremeumuser = true;
             user.save();

        res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.getLeaderboard = async (req, res, next) => {
    try {
        const details = await Leaderboard.find().populate('userId').sort({ totalExpense: -1 });
       
        res.status(200).json({ detail: details });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
}


exports.getPassword = async (req, res, next)=> {
    const email = req.body.email;

  try {
    const user = await User.findOne({email: email });
    if (!user) {
      return res.status(404).json({ message: "Email not available" });
    }
const request = new ForgotPassword({
    uid: req.user,
    isactive: true
})
await request.save();
user.forgotPasswordId = request._id;
await user.save();
    
    
    const link = `http://localhost:3000/password/${request._id}`;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SIB_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "sagarcorporateacc@gmail.com",
    };
    const receivers = [
      {
        email: `${req.body.email}`,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Forgot Email Recovery",
      textContent: `Reset Your Password by Clicking Below Link: ${link}`,
    });
    const confirmation = await ForgotPassword.findOne({_id: request._id})

    async function waitForConfirmation() {
        while (confirmation.isactive === false) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        }
        console.log("Email sent successfully");
        res.status(200).json({ message: "Sending done" });
      }
      
      waitForConfirmation();
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.setPassword = async (req, res, next)=> {
    const uuId = req.params.uuId;

    const request = await ForgotPassword.findOne({ _id: uuId });

    if(request){
      res.redirect('/HTML/forgotPasswordForm.html');
    }
    else{
        res.status(404).json({message: "somthing went wrong"});
    }
}

exports.updatePassword = async (req, res, next) => {
    const updatePassword = req.body.password;
    const email = req.body.email;
    try{
        const user = await User.findOne({email: email});

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(updatePassword, saltRounds);
    
        user.password = hashedPassword;
        await user.save();
    
        const request = await ForgotPassword.findOneAndDelete({uid: user._id});
    
        res.status(200).json({message: "done"});
    }catch(err){
        console.log(err);
    }
    
    
}