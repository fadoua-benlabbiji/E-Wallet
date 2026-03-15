export const database={

    users:[
      {id:"1",
       name:"Ali", 
       email:"Ali@example.com",
       password:"1232",
       wallet:{
        balance:12457, 
        currency:"MAD",
        cards:[
            {numcards:"124847", type:"visa",balance:14712,expiry:"14-08-27",vcc:"147"},
            {numcards:"124478", type:"mastercard",balance:1470,expiry:"14-08-28",vcc:"257"},
        ],
        transactions:[
             {id:"1", type:"credit",amount:140,date:"14-08-25", from:"224847" , to:"124850"},
               {id:"2", type:"debit",amount:200,date:"13-08-27", from:"124847" , to:"224847"},
              {id:"2", type:"credit",amount:250,date:"12-08-26", from:"334478" , to:"124478"},
        ]

       }
      },
          // Nouvel user
       {
      id: "2",
      name: "fadoua",
      email: "fadoua@example.com",
      password: "1234",
      wallet: {
        balance: 8500,
        currency: "MAD",
        cards: [
          { numcards: "224847", type: "visa", balance: 5000, expiry: "10-09-27", vcc: "321" },
          { numcards: "224478", type: "mastercard", balance: 3500, expiry: "05-10-28", vcc: "654" },
        ],
        transactions: [
          { id: "1", type: "credit", amount: 300, date: "10-03-26", from: "224847", to: "Ahmed"},
          { id: "2", type: "debit", amount: 150, date: "11-03-26", from: "224847", to: "Ali"},
        ]
      }
    }
    ]
}

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

