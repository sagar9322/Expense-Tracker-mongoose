
const User = require('../models/user');

exports.postIncomeDetail = async (req, res, next) => {
  try {
    const incomeDe = req.body.income;
    const user = await User.findOne({_id: req.user})
    user.income = Number(user.income) + Number(incomeDe);
    user.save();


    res.status(200).json({ message: "submitted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.getIncomeDetail = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user });
    const income = user.income;
    res.status(200).json({income: income});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};