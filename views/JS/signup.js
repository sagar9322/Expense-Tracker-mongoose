async function submitUserDetails(event) {
    event.preventDefault();
    // document.getElementById('container').style.transform = "translate(-5px, -10px)";
    let name = document.getElementById('name-ip').value;
    let email = document.getElementById('email-ip').value;
    let password = document.getElementById('password-ip').value;

    const userDetails = {
        name: name,
        email: email,
        password: password
    }

    try {
        const response = await axios.post('http://localhost:3000/sign-up', userDetails).then((response) => {
            window.location.href = "../HTML/login.html";
        });
        document.getElementById('name-ip').value = "";
        document.getElementById('email-ip').value = "";
        document.getElementById('password-ip').value = "";
        document.getElementById('error-heading').textContent = "";
        var checkbox = document.querySelector('.checkbox');
        checkbox.checked = false;
    } catch (error) {
        // Handle error response
        if (error.response && error.response.status === 409) {
            document.getElementById('error-heading').textContent = "This Email is already in use. Try different one.";
            document.getElementById('name-ip').value = "";
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
            var checkbox = document.querySelector('.checkbox');
            checkbox.checked = false;
        } else {
            console.log('Error:', error.message);
        }
    }
}