const Expense = require('../models/expense');
const Leaderboard = require('../models/leaderboard');
const User = require('../models/user');
const AWS = require('aws-sdk');
require('dotenv').config();


exports.postExpenseDetail = async (req, res, next) => {

  try {
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
    const user = await Leaderboard.findOne({ userId: req.user });


    if (!user) {
      const leaderBoard = new Leaderboard({
        userId: req.user,
        totalExpense: amount
      })
      await leaderBoard.save()

    } else {
      user.totalExpense = Number(user.totalExpense) + Number(amount);
      await user.save();

    }
    const expense = new Expense({
      category: category,
      description: description,
      amount: amount,
      createdAt: new Date()
    });
    await expense.save();

    const updateUserWithExpense = async (userId, expenseIdToAdd) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $push: { expenseId: expenseIdToAdd } }, { new: true });

      } catch (err) {
        console.log('Error:', err);
      }
    };

    updateUserWithExpense(req.user, expense._id);



    res.status(200).json({ message: "submitted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.getExpenseDetail = async (req, res, next) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 5;
  const filter = req.query.filter || 'all'; // Default to 'all' if no filter provided

  try {
    const user = await User.findById(req.user).populate({
      path: 'expenseId',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare the filtering criteria based on the 'filter' parameter
    const currentDate = new Date();
    const filterCriteria = {};

    if (filter === 'month') {
      const currentMonth = currentDate.getMonth();
      filterCriteria.createdAt = {
        $gte: new Date(currentDate.getFullYear(), currentMonth, 1),
        $lt: new Date(currentDate.getFullYear(), currentMonth + 1, 1),
      };
    } else if (filter === 'day') {
      const currentDay = currentDate.getDate();
      filterCriteria.createdAt = {
        $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDay),
        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDay + 1),
      };
    } else if (filter === 'year') {
      const currentYear = currentDate.getFullYear();
      filterCriteria.createdAt = {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1),
      };
    }

    // Fetch paginated and filtered expenses directly from the user's 'expenseId' array
    const totalItems = user.expenseId.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedExpenses = user.expenseId.slice(startIndex, endIndex);

    res.status(200).json({
      detail: paginatedExpenses,
      ispremiumuser: req.user.isPremeumuser,
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: pageNumber
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete({
      _id: req.params.listId
    });
    const userLead = await Leaderboard.findOne({ userId: req.user });
   
    userLead.totalExpense = Number(userLead.totalExpense) - Number(expense.amount);
    await userLead.save();
    const user = await User.findOne({ _id: req.user });

    const updatedExpense = user.expenseId.filter(expense => {
      return expense._id.toString() !== req.params.listId.toString();
    })
    user.expenseId = updatedExpense;
    await user.save();
    res.status(200).json({ message: "done" });
  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  })


  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  }


  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("somthing went wrong");
        reject(err);
      } else {
        console.log("success", data);
        resolve(data.Location);
      }
    });
  })


}


exports.downloadExpense = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.user}).populate('expenseId');
    
    const expenses = user.expenseId;

    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpenses, filename);

    res.status(200).json({ fileUrl: fileUrl, success: true });
  } catch (err) {
    res.status(500).json({ fileUrl: "", success: false });
  }

}