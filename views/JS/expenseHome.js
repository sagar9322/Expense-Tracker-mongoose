function displayExpenseForm() {
    
    if (document.getElementById("expense-form-container").style.display == "block") {
        document.getElementById("expense-form-container").style.display = "none";
        document.querySelector('.page').style.display = 'flex';
    } else {
        document.getElementById("expense-form-container").style.display = "block";
        document.getElementById("income-form-container").style.display = "none";
        document.querySelector('.page').style.display = 'none';
    }
}

function displayIncomeForm() {
    
    if (document.getElementById("income-form-container").style.display == "block") {
        document.getElementById("income-form-container").style.display = "none";
        document.querySelector('.page').style.display = 'flex';
    } else {
        document.getElementById("income-form-container").style.display = "block";
        document.getElementById("expense-form-container").style.display = "none";
        document.querySelector('.page').style.display = 'none';
    }
}

async function submitExpense(event) {
    document.querySelector('.page').style.display = 'flex';
    event.preventDefault();
    const category = document.getElementById('category').value;
    const description = document.getElementById('expense-name').value;
    const amount = document.getElementById('expense-amount').value;

    const expenseDetails = {
        category: category,
        description: description,
        amount: amount
    };
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post('http://localhost:3000/expense', expenseDetails, { headers });
        await getExpenseDetails(1);
        await getIncomeDetail(event);
        document.getElementById('category').value = "";
        document.getElementById('expense-name').value = "";
        document.getElementById('expense-amount').value = "";
        document.getElementById("expense-form-container").style.display = "none";
    } catch (error) {
        console.error('Error submitting expense:', error);
    }
}

async function submitIncome(event) {
    document.querySelector('.page').style.display = 'flex';
    event.preventDefault();
    const income = document.getElementById('income-amount').value;

    const incomeDetail = {
        income: income
    };
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post('http://localhost:3000/income', incomeDetail, { headers });
        document.getElementById('income-amount').value = "";
        document.getElementById("income-form-container").style.display = "none";
        await getIncomeDetail();
    } catch (error) {
        console.error('Error submitting income:', error);
    }
}

async function deleteFromServer(listId) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        await axios.delete(`http://localhost:3000/delete-list/${listId}`, { headers });
        await getExpenseDetails(1, "day");
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

async function getIncomeDetail() {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('http://localhost:3000/get-income', {}, { headers });

        const totalIncome = response.data.income;

        document.getElementById('income').textContent = `Income: ${totalIncome}`;
    } catch (error) {
        console.error('Error fetching income data:', error);
    }
}

async function buyPremiumMembership(event) {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('http://localhost:3000/buy-premium', {},  { headers });
        console.log(response.data)
        const options = {
            "key": response.data.key_id,
            "order_id": response.data.order1.orderid,
            "handler": async (response) => {
                await axios.post('http://localhost:3000/update-tarnsaction-status', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers });

                alert("You Are a Premium User Now");
                window.location.reload();
            }
        };
        const rzpl = new Razorpay(options);
        rzpl.open();
        event.preventDefault();

        rzpl.on('payment failed', function (response) {
            alert('something went wrong');
        });
    } catch (error) {
        console.error('Error buying premium membership:', error);
    }
}

function showLeaderboard() {

    axios.get('http://localhost:3000/leaderboard').then((response) => {
        const sortedUsers = response.data.detail.sort((a, b) => b.totalexpense - a.totalexpense);

        // Create a new div to contain the leaderboard
        const listGroup = document.getElementById('list-group');
        listGroup.innerHTML = ''; // Clear the existing list items
        listGroup.style.alignItems = "center";

        // Iterate over each user and create a list item to display their details
        sortedUsers.forEach((user) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.userId.name} - Total Expense: ${user.totalExpense}`;
            listItem.style.fontSize = "25px";
            listItem.style.listStyle = "number";
            listGroup.appendChild(listItem);
        });

        // Append the leaderboard div to the document body
        document.getElementById('pagination').style.display = "none";
       
    });
}

async function initializeApp() {
    try {
        await getExpenseDetails(1, "year");
        await getIncomeDetail();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}


async function getExpenseDetails(pageNumber, filter) {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': token,
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await axios.post(`http://localhost:3000/get-expense/12?pageNumber=${pageNumber}&filter=${filter}`, {}, { headers });
      const expenses = response.data.detail;
      
      let totalExpense = 0;
      
      const listGroup = document.getElementById('list-group');
      listGroup.innerHTML = "";
      listGroup.style.alignItems = "stretch";
      // Iterate over the expenses and create list items
      expenses.forEach(expense => {
        const listId = expense._id;
        totalExpense = Number(totalExpense) + Number(expense.amount);
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = 'list-item';
  
        // Create expense details container div
        const expenseDetails = document.createElement('div');
        expenseDetails.className = 'expense-details';
  
        // Create separate divs for each expense detail
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'detail';
        categoryDiv.textContent = expense.category;
  
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'detail';
        descriptionDiv.textContent = expense.description;
  
        const amountDiv = document.createElement('div');
        amountDiv.className = 'detail';
        amountDiv.textContent = expense.amount;
  
        // Append expense details divs to the expense details container
        expenseDetails.appendChild(categoryDiv);
        expenseDetails.appendChild(descriptionDiv);
        expenseDetails.appendChild(amountDiv);
  
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'X';
  
        // Add click event listener to delete button
        deleteButton.onclick = (event) => {
          event.preventDefault();
          deleteFromServer(listId);
        };
  
        // Append expense details container and delete button to list item
        listItem.appendChild(expenseDetails);
        listItem.appendChild(deleteButton);
  
        // Append list item to list group
        listGroup.appendChild(listItem);
      });

      
        
        document.getElementById('day').style.color = "white";
        document.getElementById('month').style.color = "white";
        document.getElementById('year').style.color = "white";
        document.getElementById(`${filter}`).style.color = "black";
  
      document.getElementById('expense').textContent = `Expense: ${totalExpense}`;
  
      const paginationContainer = document.getElementById('pagination');
      document.getElementById('pagination').style.display = "flex";
      paginationContainer.innerHTML = "";
  
      const totalPages = response.data.totalPages;
      
      // Create page buttons
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page');
        pageButton.style.alignItems = "center";
  
        // Highlight the current page button
        if (i === pageNumber) {
          pageButton.classList.add('active');
        }
  
        // Attach click event listener to each page button
        pageButton.addEventListener('click', () => {
          getExpenseDetails(i, filter);
        });
  
        paginationContainer.appendChild(pageButton);
      }
  
      const isPremiumUser = response.data.ispremiumuser;
      
      if (isPremiumUser === true) {
        document.getElementById('premium').textContent = "⭐";
        document.getElementById('premium').style.fontSize = "30px";
        document.getElementById('list-header').style.display = "none";
        const button = document.getElementById('account-btn');
        button.onclick = (event) => {
          event.preventDefault();
        };
      } else {
        document.getElementById('premium').textContent = "Buy Premium";
        document.getElementById('leaderboard').style.display = "none";
        document.getElementById('download-button').style.display = "none";
        document.getElementById('list-header').style.display = "flex";
        document.getElementById('month-header').style.display = "none";
      }
    } catch (error) {
      console.error('Error fetching expense data:', error);
    }
  }


async function downloadExpense(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    const response = await axios.get('http://localhost:3000/download', { headers });
    if (response.status === 200) {
        let a = document.createElement('a');
        a.href = response.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
    } else {
        throw new Error("somthing went wrong");
    }

}





window.addEventListener("DOMContentLoaded", initializeApp);