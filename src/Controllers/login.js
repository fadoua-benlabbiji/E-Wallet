import finduserbymail from "../Models/database";
//Recuperation de bouton
const submitBtn = document.getElementById("submitbtn");

submitBtn.addEventListener("click",handleConnecte);
function handleConnecte(){
    //recuperation du champs
    const emailInput = document.getElementById("mail");
    const passwordInput = document.getElementById("password");
    //les valeurs de champs
    const mail=emailInput.value;
    const pwd=passwordInput.value;
    submitBtn.textContent="Checking..."
    setTimeout(()=>{
        if(!mail || !pwd){
            submitBtn.textContent="Se connecter"
            alert("Erreur : champs Vides !");
            return;
        }
        const user=finduserbymail(mail,pwd);
        console.log(user);
        if(user){
         sessionStorage.setItem("currentuser", JSON.stringify(user));
         submitBtn.textContent="Se connecter";
         document.location="../Views/dashboard.html";
        }else{
            submitBtn.textContent="Se connecter";
            alert("Erreur : Email ou mot de passe incorrect !");
            return;
        }
    },200);
}
