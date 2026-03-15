//recuperation de bouton de login
const loginBtn = document.getElementById("Loginbtn");
loginBtn.addEventListener("click",handleLogin);

//decalartion de la fonction hanlelLogin
function handleLogin(){
    loginBtn.textContent="Loading...";
    setTimeout(()=>{document.location="../Views/login.html"},200);
} 