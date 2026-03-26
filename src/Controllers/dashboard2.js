import {getbeneficiaries ,finduserbyaccount,findbeneficiarieByid} from "../Models/database.js";
const user = JSON.parse(sessionStorage.getItem("currentuser"));
// DOM elements
const greetingName = document.getElementById("greetingName");
const currentDate = document.getElementById("currentDate");
const solde = document.getElementById("availableBalance");
const incomeElement = document.getElementById("monthlyIncome");
const expensesElement = document.getElementById("monthlyExpenses");
const activecards = document.getElementById("activeCards");
const transactionsList = document.getElementById("recentTransactionsList");
const transferBtn = document.getElementById("quickTransfer");
const transferSection = document.getElementById("transfer-section");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCard = document.getElementById("sourceCard");
//const sourceCards = document.getElementsByClassName("sourceCard");
const submitTransferBtn=document.getElementById("submitTransferBtn");

// Events
  transferBtn.addEventListener("click", handleTransfersection);
  closeTransferBtn.addEventListener("click", closeTransfer);
  cancelTransferBtn.addEventListener("click", closeTransfer);
  submitTransferBtn.addEventListener("click",handleTransfer)
  

checkAuth(user).then(mess=>{
    console.log(mess);
    renderDashboard();
  }).catch(err=>{
    //console.log(err);
    document.location="login.html";
  })
   //récupération des données du tableau de bord
  const getDashboardData=()=>{
    //les retenus
    const monthlyIncome=user.wallet.transactions.filter(t=>t.type==="credit").reduce((total,t)=>total + t.amount,0);
  
    //les depenses
    const monthlyExpenses=user.wallet.transactions.filter(t=>t.type==="debit").reduce((total,t)=>total + t.amount,0);
    return {
        userName: user.name,
        currentDate: new Date().toLocaleDateString("fr-FR"),
        availableBalance:`${user.wallet.balance} ${user.wallet.currency}`,
        activeCards: user.wallet.cards.length,
        monthlyIncome: `${monthlyIncome} MAD`,
        monthlyExpenses: `${monthlyExpenses} MAD`,
    } ; 
};
// affichage des données du tableau de bord

function renderDashboard(){
const dashboardData = getDashboardData();
if (dashboardData) {
console.log(dashboardData);
console.log(user);
  greetingName.textContent = dashboardData.userName;
  currentDate.textContent = dashboardData.currentDate;
  solde.textContent = dashboardData.availableBalance;
  incomeElement.textContent = dashboardData.monthlyIncome;
  expensesElement.textContent = dashboardData.monthlyExpenses;
  activecards.textContent = dashboardData.activeCards;
}
//affichage des transactions
transactionsList.innerHTML = "";
user.wallet.transactions.forEach(transaction => {
  const transactionItem = document.createElement("div");
  transactionItem.className = "transaction-item";
  transactionItem.innerHTML = `
    <div>${transaction.date}</div>
    <div>${transaction.amount} MAD</div>
    <div>${transaction.type}</div>
  `;
    if(transaction.etat === "echec"){
    const Div = document.createElement("div");
     Div.textContent = "(Échec)";
    Div.style.color = "red";
    transactionItem.appendChild(Div);
  }
  
  transactionsList.appendChild(transactionItem);
});

}
//popup de transfert
function closeTransfer() {
  transferSection.classList.add("hidden");
  document.body.classList.remove("popup-open");
}

function handleTransfersection() {
  transferSection.classList.remove("hidden");
  document.body.classList.add("popup-open");
}
function checkAuth(user){
    var p=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log("checkAuth appelée");
            if(user){
                resolve("Utilisateur authentifié");
            }else{
                reject("Utilisateur non authentifié");
            }
        },200);
    })
    return p;
  }
  
function renderBeneficiaries() {
  getbeneficiaries(user.id).forEach((beneficiary) => {
    const option = document.createElement("option");
    option.value = beneficiary.id;
    option.textContent = beneficiary.name;
    beneficiarySelect.appendChild(option);
  });
}
renderBeneficiaries();
function renderCards() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type+"****"+card.numcards;
    sourceCard.appendChild(option);
  });
}

renderCards();

function checkUser(numCompte){
    const p=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const beneficiary=finduserbyaccount(numCompte);
            if(beneficiary){
                resolve(beneficiary);
            }else{
                reject("Beneficiary not found");
            }
        },2000)
    })
           return p;
}
function checkSolde(expediteur,amount){
 const p=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        if(expediteur.wallet.balance > amount){
            resolve("Sufficient balance");
        }else{
            reject("Insufficient balance");
        }
    },3000)
 })
   return p;
}

function updateSolde(expediteur,destinataire,amount){
    setTimeout(()=>{
        expediteur.wallet.balance-=amount;
        destinataire.wallet.balance+=amount;
        console.log("update balance done");
  },200);
}
function addtransactions(expediteur,destinataire,amount){
   setTimeout(()=>{
    // create credit transaction
    const now = Date.now();
    const dateStr = new Date().toLocaleDateString("fr-FR");
 const credit={
    id:now,
    type:"credit",
    amount: amount,
    date: dateStr,
    from: expediteur.name,
    etat:"succes"
 }
 //create debit transaction
const debit={
    id:now,
    type:"debit",
    amount: amount,
    date: dateStr,
    to: destinataire.name, 
     etat:"succes"
 }
  expediteur.wallet.transactions.push(debit);
  destinataire.wallet.transactions.push(credit);
  sessionStorage.setItem("currentuser", JSON.stringify(expediteur));
   console.log("transaction added successfully");
   closeTransfer();
   renderDashboard();
   },3000)

}
//transfer function
function transfer(expediteur,numcompte,amount){
    checkUser(numcompte)//p0
    .then((destinataire)=>{//p1
        console.log("Étape 1: Destinataire trouve -", destinataire.name);
        return checkSolde(expediteur,amount)//p2
        .then(mess=> {//p3
            return {mess,destinataire};  //on regourpe le mess de checksolde et le destinatire et les retourner
        });
    }).then((objsolde)=>{//p4
        console.log(objsolde.mess);
        updateSolde(expediteur,objsolde.destinataire,amount);
        addtransactions(expediteur,objsolde.destinataire,amount);
    }).catch(erreur=>{
        console.log(erreur);
    })
}
function handleTransfer(e) {
 e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount=findbeneficiarieByid(user.id,beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

transfer(user, beneficiaryAccount, amount);

} 
//Recharger avec les promises-------------------
//les elements Dom
const rechargeSection = document.getElementById("recharge-section");
const quickTopupBtn = document.getElementById("quickTopup");
const closeRechargeBtn = document.getElementById("closeRechargeBtn");
const cancelRechargeBtn = document.getElementById("cancelRechargeBtn");
const sourceCardR=document.getElementById("sourceCardR");
const amountR=document.getElementById("amountR");
const submitR=document.getElementById("submitRechargeBtn");
const carte=document.getElementById('sourceCardR').value;
// Ouvrir la pop-up
quickTopupBtn.addEventListener("click", () => {
  rechargeSection.classList.remove("hidden");
});

// Fermer la pop-up avec X
closeRechargeBtn.addEventListener("click", () => {
  rechargeSection.classList.add("hidden");
});

// Fermer la pop-up avec  "Annuler"
cancelRechargeBtn.addEventListener("click", () => {
  rechargeSection.classList.add("hidden");
});
submitR.addEventListener("click",recharger);
//affichage de liste des cartes disponible
//on utilisant une class?
function renderCardsR() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type+"****"+card.numcards;
    sourceCardR.appendChild(option);
  });
}

renderCardsR();
function checkMontantR(montant){
  const p=new Promise((resolve,reject)=>{
    setTimeout(()=>{
       if(montant >= 10 && montant <= 5000 ){
           resolve("montant valide");
       }else{
           reject("Montant ne respect pas les limites");
       }
    },2000);
  });
  return p;
}
function updateSoldeR(amount){
    setTimeout(()=>{
        user.wallet.balance+=amount;
        console.log("update balance done");
  },500);
}

function addtransactionR(amount,Etat){
   setTimeout(()=>{
    // creation de transation de recharge 
    const now = Date.now();
    const dateStr = new Date().toLocaleDateString("fr-FR");
    const recharge={
    id:now,
    type:"recharge",
    amount: amount,
    date: dateStr,
    etat:Etat
    }
    user.wallet.transactions.push(recharge);
    sessionStorage.setItem("currentuser", JSON.stringify(user));
    console.log("transaction added successfully");
    closeTransfer();
    renderDashboard();
    },500)

}
function checkExpiry(carte){
  const p= new Promise((resolve, reject) => {
     setTimeout(()=>{
       const DateCarte = new Date(carte.expiry);
       const now=new Date();
      if (now <= DateCarte) {
        resolve("Carte valide");
      } else {
        reject("Carte expirée");
      }
     },200);
   });
     return p;
  }

function recharger(e){
  e.preventDefault(); 
  const amount = Number(amountR.value);
  console.log("Étape 1: vérification de la carte ");
  checkExpiry(carte).then(()=>{
    console.log("Étape 2: vérification du montant ");
     return checkMontantR(amount);
   }).then((msg)=>{
        console.log(msg);
        updateSoldeR(amount);
        addtransactionR(amount,"succes");
        rechargeSection.classList.add("hidden");
    })
    .catch(erreur=>{
        console.log(erreur);
        addtransactionR(amount,"echec");
        rechargeSection.classList.add("hidden");
    });
    
}