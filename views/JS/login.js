async function getUserDetail(event) {
    event.preventDefault();
    // document.getElementById('container').style.transform = "translate(-5px, -10px)";
    let email = document.getElementById('email-ip').value;
    let password = document.getElementById('password-ip').value;

    const userDetails = {
        email: email,
        password: password
    }
    console.log("coming");

    try {
        const response = await axios.post('http://localhost:3000/log-in', userDetails).then((response) => {
            
            const token = response.data.token;
            localStorage.setItem("token", token);
            window.location.href = "../HTML/expenseHome.html";
            
        });
        if (response.status === 200) {
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
            document.getElementById('error-heading').textContent = "Login Sucsessfully";
            document.getElementById('error-heading').style.color = "green";
        }
    } catch (error) {
        // Handle error response
        if (error.response && error.response.status === 404) {
            document.getElementById('error-heading').textContent = "Email or Password doesn't match";
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
        } else if (error.response && error.response.status === 401) {
            document.getElementById('error-heading').textContent = "Password is incorrect";
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
        }
        else {
            console.log('Error:', error.message);
        }
    }
}


async function forgotForm(event){
   event.preventDefault();
   const email = document.getElementById("email-ip").value;

   const detail = {
    email: email
   }
   
   document.getElementById('term-condition').style = "block";
   document.getElementById('term-condition').style.color = "green";

   const response = await axios.post('http://localhost:3000/forgot-password', detail);
  

   if(response.status === 200){
    alert("Please Check Your MailBox");
    window.location.href = "/HTML/login.html";
   }
   document.getElementById("email-ip").value = "";
}

async function resetPassword(event) {
    event.preventDefault();
    const email = document.getElementById('email-ip').value;
    const password = document.getElementById('password-ip').value;
    const confirmPassword = document.getElementById('confirm_password-ip').value;

    if (password === confirmPassword) {
      const response = await axios.post('http://localhost:3000/reset-password', { email: email, password: password });
      console.log(">>>>", response)
      if (response.status === 200) {
        
        window.location.href = "/HTML/login.html";
        console.log("done")
      }
    }

  }


