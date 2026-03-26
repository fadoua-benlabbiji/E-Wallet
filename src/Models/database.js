const database={

    users:[
      {id:"1",
       name:"Fadoua", 
       email:"Fadoua@example.com",
       password:"1232",
       account:"124847",
       wallet:{
        balance:20000, 
        currency:"MAD",
        cards:[
            {numcards:"124847", type:"visa",balance:"14712",expiry:"14-08-27",vcc:"147"},
            {numcards:"124478", type:"mastercard",balance:"1470",expiry:"14-08-28",vcc:"257"},
        ],
        transactions:[
             {id:"1", type:"credit",amount:140,date:"14-08-25", from:"Ahmed" , to:"124847",etat:"succes"},
               {id:"2", type:"debit",amount:200,date:"13-08-25", from:"124847" , to:"Amazon",etat:"succes"},
              {id:"3", type:"credit",amount:250,date:"12-08-25", from:"Ahmed" , to:"124478",etat:"succes"},
        ],
        beneficiaries: [
          { id: "1", name: "Ali", account: "124847" },
          { id: "2", name: "Sara", account: "213456" }
        ]
       }
      },
   { id:"2",
    name:"Ali", 
    email:"Ali@example.com",
    password:"1232",
    account:"12346",
    wallet:{
    balance:30000, 
    currency:"MAD",
    cards: [
          { numcards: "224847", type: "visa", balance: 14712, expiry: "2025-08-14", vcc: "147" },
          { numcards: "224478", type: "mastercard", balance: 1470, expiry: "2028-08-14", vcc: "257" }
    ],
    transactions: [
          { id: "1", type: "credit", amount: 140, date: "2025-08-14", from: "Ali", to: "12347",etat:"succes" },
          { id: "2", type: "debit", amount: 200, date: "2025-08-13", from: "12347", to: "Amazon",etat:"succes" },
          { id: "3", type: "credit", amount: 250, date: "2025-08-12", from: "Ali", to: "224478" ,etat:"succes"}
    ],
    beneficiaries: [
          { id: "1", name: "Ali", account: "124847" },
          { id: "2", name: "Sara", account: "213456" }
    ]
}
}]};

/*
const finduserbymail=(mail,password)=>{
    return database.users.find((u)=> u.email===mail && u.password===password
    );
}
export function isActive(card){
        const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // getMonth() commence à 0
    const currentYear = today.getFullYear();
    const parts= card.expiry.split("-");
    const cardDay = parseInt(parts[0]);
    const cardMonth = parseInt(parts[1]);
    const cardYear = 2000 + parseInt(parts[2]); // transforme "27" → 2027
     return cardYear > currentYear ||
           (cardYear === currentYear && cardMonth > currentMonth) ||
           (cardYear === currentYear && cardMonth === currentMonth && cardDay >= currentDay);
}

export default finduserbymail ;
*/
export  const finduserbymail = (mail, password) => {
    return database.users.find((u) => u.email === mail && u.password === password);
}

export  const getbeneficiaries = (id) => {
    return database.users.find((u)=>u.id===id).wallet.beneficiaries;
}

export const findbeneficiarieByid= (id,beneficiaryId) => {
    return database.users.find((u)=>u.id===id).wallet.beneficiaries.find((u)=>u.id===beneficiaryId);
}

export const finduserbyaccount=(numcompte)=>{
    return database.users.find((u)=>u.account===numcompte);
}
