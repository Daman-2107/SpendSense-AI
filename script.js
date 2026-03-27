let user = localStorage.getItem("currentUser");

if(!user){
    window.location.href = "index.html";
}

document.getElementById("user").innerText = user;

// USER BASED STORAGE
let expenses = JSON.parse(localStorage.getItem(user+"_expenses")) || [];
let limitData = JSON.parse(localStorage.getItem(user+"_limit")) || {};

// ADD EXPENSE
function addExpense(){
    let desc = document.getElementById("desc").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    let date = new Date();

    expenses.push({desc, amount, category, date});

    localStorage.setItem(user+"_expenses", JSON.stringify(expenses));

    updateUI();
}

// SET LIMIT
function setLimit(){
    let value = parseFloat(document.getElementById("limit").value);
    let time = document.getElementById("time").value;

    limitData = {value, time};
    localStorage.setItem(user+"_limit", JSON.stringify(limitData));
}

// FILTER
function filterExpenses(){
    let now = new Date();

    return expenses.filter(e=>{
        let d = new Date(e.date);

        if(limitData.time==="week"){
            return (now - d) <= 7*24*60*60*1000;
        }
        if(limitData.time==="month"){
            return d.getMonth()===now.getMonth();
        }
        if(limitData.time==="year"){
            return d.getFullYear()===now.getFullYear();
        }
    });
}

// UPDATE UI
function updateUI(){
    let list = document.getElementById("list");
    let result = document.getElementById("result");

    list.innerHTML="";
    let filtered = filterExpenses();

    let total = 0;

    filtered.forEach(e=>{
        total += e.amount;

        let li = document.createElement("li");
        li.innerText = `${e.desc} - ₹${e.amount}`;
        list.appendChild(li);
    });

    // FIXED LOGIC 🔥
    if(limitData.value){
        if(total > limitData.value){
            result.innerHTML = `⚠ You exceeded your ${limitData.time} limit by ₹${total - limitData.value}`;
        } else {
            result.innerHTML = `🎉 Great! You saved ₹${limitData.value - total} this ${limitData.time}`;
        }
    }
}

updateUI();