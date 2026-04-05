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


  //reject js lance automatiquement une exception 
async function ouverture(){
  try{
     const mess= await checkAuth(user);
    console.log(mess);
    renderDashboard();
  }catch(err){
    //console.log(err);
    document.location="login.html";
  }
}
ouverture();
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
    ${transaction.etat === "echec" ? `<div style="color:red">${transaction.etat}</div>` : ""} `;
  transactionsList.appendChild(transactionItem);
})
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
async function checkAuth(user){
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

async function checkUser(numCompte){
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
async function checkSolde(expediteur,amount){
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
    from: expediteur.name
 }
 //create debit transaction
const debit={
    id:now,
    type:"debit",
    amount: amount,
    date: dateStr,
    to: destinataire.name
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
async function transfer(expediteur,numcompte,amount){
    try{
      const destinataire=await checkUser(numcompte);
      console.log("Étape 1: Destinataire trouve -", destinataire.name);
      const  mess=await checkSolde(expediteur,amount); 
      console.log("Étape 2:", mess);
      updateSolde(expediteur,destinataire,amount);
      addtransactions(expediteur,destinataire,amount);
    }catch (err){
        console.log(err);
    }
}
function handleTransfer(e) {
 e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount=findbeneficiarieByid(user.id,beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

transfer(user, beneficiaryAccount, amount);

} 
// Events
  transferBtn.addEventListener("click", handleTransfersection);
  closeTransferBtn.addEventListener("click", closeTransfer);
  cancelTransferBtn.addEventListener("click", closeTransfer);
  submitTransferBtn.addEventListener("click",handleTransfer)
//Recharger avec les promises-------------------

//les elements Dom
const rechargeSection = document.getElementById("recharge-section");
const quickTopupBtn = document.getElementById("quickTopup");
const closeRechargeBtn = document.getElementById("closeRechargeBtn");
const cancelRechargeBtn = document.getElementById("cancelRechargeBtn");
const sourceCardR=document.getElementById("sourceCardR");
const amountR=document.getElementById("amountR");
const submitR=document.getElementById("submitRechargeBtn");
//const carte=document.getElementById('sourceCardR').value;

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
async function checkMontantR(montant){
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
  },200);
}

function addtransactionR(amount,e){
   setTimeout(()=>{
    // creation de transation de recharge 
    const now = Date.now();
    const dateStr = new Date().toLocaleDateString("fr-FR");
    const recharge={
    id:now,
    type:"recharge",
    amount: amount,
    date: dateStr,
    etat:e
    }
    user.wallet.transactions.push(recharge);
    sessionStorage.setItem("currentuser", JSON.stringify(user));
    console.log("transaction added successfully");
     rechargeSection.classList.add("hidden"); 
    renderDashboard();
    },3000)
}
async function recharger(){
    console.log("recharger appelée");
    const amount=Number(amountR.value);
    try{
    
    const mess =await checkMontantR(amount);
        console.log("Étape 1:verfication du montant");
        console.log(mess);
        updateSoldeR(amount);
        addtransactionR(amount,"success");
      }catch(err){
        console.log(err);
         addtransactionR(amount,"echec");
        rechargeSection.classList.add("hidden");
        //
    }
}
