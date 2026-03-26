/*import { database, isActive } from "../Models/database.js";

// récupération du user d'après la session
var userstring = sessionStorage.getItem("currentuser");
if(!userstring){
    document.location = "../Views/login.html";
}else{
    const user = JSON.parse(userstring);
    console.log(user);

    // greeting name
    var greetingName = document.getElementById("greetingName");
    greetingName.textContent = user.name;

    // Solde
    const availableBalance = document.getElementById("availableBalance");
    const soldeTotal = user.wallet.cards.reduce((total, card) => total += card.balance, 0);
    availableBalance.textContent = soldeTotal;

    // Revenus
    const monthlyIncome = document.getElementById("monthlyIncome");
    const revenu = user.wallet.transactions.filter(t => t.type == "credit").reduce((total, t) => total += t.amount, 0);
    monthlyIncome.textContent = revenu;

    // Dépenses
    const monthlyExpenses = document.getElementById("monthlyExpenses");
    const depense = user.wallet.transactions.filter(t => t.type == "debit").reduce((total, t) => total += t.amount, 0);
    monthlyExpenses.textContent = depense;

    // Les cartes actives
    const activeCards = document.getElementById("activeCards");
    const actives = user.wallet.cards.filter(card => isActive(card));
    console.log(actives.length);
    activeCards.textContent = actives.length;

    // Transfert
    var transfersection = document.getElementById("transfer-section");
    const quickTransfer = document.getElementById("quickTransfer");
    quickTransfer.addEventListener("click", () => {
        transfersection.classList.remove("hidden");
    });
    const cancelTransferBtn = document.getElementById("cancelTransferBtn");
    cancelTransferBtn.addEventListener("click", () => {
        transfersection.classList.add("hidden");
    });
    const closeTransferBtn = document.getElementById("closeTransferBtn");
    closeTransferBtn.addEventListener("click", () => {
        transfersection.classList.add("hidden");
    });

    // Sélection des cards
    const sourceCard = document.getElementById("sourceCard");
    const cards = user.wallet.cards;
    for (var i = 0; i < cards.length; i++) {
        if (isActive(cards[i])) {
            const option = document.createElement("option");
            option.value = cards[i].numcards;
            option.textContent = cards[i].type + "-" + cards[i].numcards;
            sourceCard.appendChild(option);
        }
    }

    // Sélection des bénéficiaires
    const beneficiary = document.getElementById("beneficiary");
    const anciensbenef = user.wallet.transactions.reduce((tab, t) => {
        if(tab.indexOf(t.to) === -1 && t.type === "debit"){
            tab.push(t.to);
        }
        return tab;
    }, []);
    console.log(anciensbenef);

    for (var i = 0; i < anciensbenef.length; i++) {
        const option = document.createElement("option");
        option.value = anciensbenef[i];      
        option.textContent = anciensbenef[i]; 
        beneficiary.appendChild(option);
    }

    // Transfert
    const TransferBtn = document.getElementById("submitTransferBtn");
    const amount = document.getElementById("amount");
    TransferBtn.addEventListener("click", verfication);

    function verfication(e){
        e.preventDefault();
        TransferBtn.textContent = "Checking...";
        setTimeout(() => {
            const montant = parseFloat(amount.value);
            const selectNum = document.getElementById("sourceCard").value;
            const benef = document.getElementById("beneficiary").value;

            // Vérification de la carte
            if(!selectNum){
                alert("Veuillez selectionner une carte !");
                TransferBtn.textContent = "Transférer";
                return;
            }

            // Vérification du bénéficiaire
            if(!benef){
                alert("Veuillez selectionner un bénéficiaire !");
                TransferBtn.textContent = "Transférer";
                return;
            }

            // Vérification du montant
            if(isNaN(montant) || montant <= 0){
                alert("Montant invalide !");
                TransferBtn.textContent = "Transférer";
                return;
            }

            // Récupération de la carte
            const selectcard = user.wallet.cards.find(card => card.numcards == selectNum);

            // Vérifier solde
            if(selectcard.balance < montant){
                alert("Solde insuffisant sur la carte !");
                TransferBtn.textContent = "Transférer";
                return;
            }

            // Tout est correct
            TransferBtn.textContent = "Transfering...";
            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear() - 2000;
            var dateStr = day + "-" + month + "-" + year;

            const debitTr = {
                id: Date.now(),
                type: "debit",
                amount: montant,
                from: selectNum,
                to: benef,
                date: dateStr
            };

            user.wallet.transactions.push(debitTr);
            selectcard.balance -= montant;
            sessionStorage.setItem("currentuser", JSON.stringify(user));

            // Transaction credit
            const creditTr = {
                id: Date.now() + 1,
                type: "credit",
                amount: montant,
                from: selectNum,
                to: benef,
                date: dateStr
            };

            let beneficiaryUser, beneficiaryCard;
            for (let u of database.users) {
                const card = u.wallet.cards.find(c => c.numcards === benef);
                if(card){
                    beneficiaryUser = u;
                    beneficiaryCard = card;
                    break;
                }
            }

            if(beneficiaryUser && beneficiaryCard){
                beneficiaryUser.wallet.transactions.push(creditTr);
                beneficiaryCard.balance += montant;
            }

            document.location = "../Views/dashboard.html";
            alert("Transfert effectué");
        }, 500);
    }

    // Affichage des transactions
    const recentTransactionsList = document.getElementById("recentTransactionsList");

    function displayTransactions(user) {
        recentTransactionsList.innerHTML = "";

        const transactions = [...user.wallet.transactions].sort((a,b) => b.id - a.id);

        transactions.forEach(tr => {
            const div = document.createElement("div");
            div.classList.add("transaction-item");

            div.innerHTML = `
                <div class="transaction-details">
                    <span class="transaction-type ${tr.type}">${tr.type.toUpperCase()}</span>
                    <span class="transaction-from">De : ${tr.from}</span>
                    <span class="transaction-to">À : ${tr.to}</span>
                    <span class="transaction-amount">Montant : ${tr.amount} MAD</span>
                    <span class="transaction-date">${tr.date}</span>
                </div>
            `;
            recentTransactionsList.appendChild(div);
        });
    }
    displayTransactions(user);  
}*/
//--------------------------Callbacks-----------------------------------
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
const submitTransferBtn=document.getElementById("submitTransferBtn");

//securite
if(!user){
    document.location="login.html";
    //alert("User not authenticated");
    //window.location.href=""
}
// Events
  transferBtn.addEventListener("click", handleTransfersection);
  closeTransferBtn.addEventListener("click", closeTransfer);
  cancelTransferBtn.addEventListener("click", closeTransfer);
  submitTransferBtn.addEventListener("click",handleTransfer)
  
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
  transactionsList.appendChild(transactionItem);
});

}
renderDashboard();
//popup de transfert
function closeTransfer() {
  transferSection.classList.add("hidden");
  document.body.classList.remove("popup-open");
}

function handleTransfersection() {
  transferSection.classList.remove("hidden");
  document.body.classList.add("popup-open");
}
// Beneficiaries
const beneficiaries = getbeneficiaries(user.id);

function renderBeneficiaries() {
  beneficiaries.forEach((beneficiary) => {
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
function checkUser(numcompte, callback){
     setTimeout(()=>{
     const beneficiary=finduserbyaccount(numcompte);
     if(beneficiary){
        callback(beneficiary);
     }
     else{
        callback("beneficiary not found");
     }
     },2000);
}


function checkSolde(expediteur,amount,callback){
  setTimeout(()=>{
      if(expediteur.wallet.balance>amount){
        callback("Sufficient balance");
      }else{
        callback("Insufficient balance");
      }
  },3000)
}

function updateSolde(expediteur,destinataire,amount,callback){
    setTimeout(()=>{
        expediteur.wallet.balance-=amount;
        destinataire.wallet.balance+=amount;
        callback("update balance done");
  },200);
}
function addtransactions(expediteur,destinataire,amount,callback){
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
    to: destinataire.name, 
 }
  expediteur.wallet.transactions.push(debit);
  destinataire.wallet.transactions.push(credit);
  sessionStorage.setItem("currentuser", JSON.stringify(expediteur));
   callback("transaction added successfully");
   closeTransfer();
   renderDashboard();
   },3000)

}
//transfere
function transfer(expediteur,numcompte,amount){
    checkUser(numcompte,(destinataire)=>{
            console.log("Étape 1: Destinataire trouve -", destinataire.name);
             checkSolde(expediteur,amount,(soldemessage)=>{
                console.log(soldemessage);
                if(soldemessage==="Sufficient balance"){
                    updateSolde(expediteur,destinataire,amount,(updatemessage)=>{
                        if(updatemessage==="update balance done"){
                             addtransactions(expediteur,destinataire,amount,(addtransactionMessage)=>{
                                       console.log(addtransactionMessage); 
                             });
                        }else{
                               console.log(updatemessage);
                        }
                    })
                }
                else{
                     console.log(soldemessage);
                }
             })
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
