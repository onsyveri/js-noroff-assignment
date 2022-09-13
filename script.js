let money = 0;
let bank = 0;
let loan = 0;
let price = 0;

// Hides pay loan button
document.getElementById("payLoan").style.display = "none";

// Work button
const btnWork = document.getElementById("work");
btnWork.addEventListener("click", workFunction);

function workFunction() {
    money += 100;
    document.getElementById("workInfo").innerHTML = "Pay" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + money + " Kr.";
}

// Bank button
const btnBank = document.getElementById("bank");
btnBank.addEventListener("click", bankFunction);

function bankFunction() {
    if (loan - money * 0.1 < 0) { // This ensures that loan wont go in minus. The rest wil be put in bank
        loan -= money * 0.1;
        bank += (-loan);
        bank += money * 0.9;
        loan = 0;
        document.getElementById("loanInfo").innerHTML = "";
    }
    else if (loan - money * 0.1 > 0 && loan != 0) {
        bank += money * 0.9;
        loan -= money * 0.1;
        document.getElementById("loanInfo").innerHTML = "Loan" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + loan + " Kr.";
    }
    else {
        bank += money; 
    }
    money = 0;
    document.getElementById("workInfo").innerHTML = "Pay"+ "&emsp;&emsp;&emsp;&emsp;&emsp;" + money + " Kr.";
    document.getElementById("balanceInfo").innerHTML = "Balance" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + bank + " Kr.";
}

// Submit loan button
const btnLoan = document.getElementById("submitLoan");
btnLoan.addEventListener("click", loanFunction);

function loanFunction() {
    let newLoan = parseInt(document.getElementById("enteredLoan").value);
    if(loan != 0) {
        document.getElementById("loanError").innerHTML = "You already have a loan! Pay it first";
    }
    else if(newLoan > bank*2) {
        document.getElementById("loanError").innerHTML = "Loan is too large!";
    }
    else {
        loan = parseInt(document.getElementById("enteredLoan").value);
        bank += loan;
        document.getElementById("loanInfo").innerHTML = "Loan" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + loan + " Kr.";
        document.getElementById("balanceInfo").innerHTML = "Balance" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + bank + " Kr.";
        document.getElementById("loanError").innerHTML = "";
        document.getElementById("payLoan").style.display = "block";
    }
}


// Pay loan button
const btnPayLoan = document.getElementById("payLoan");
btnPayLoan.addEventListener("click", payLoanFunction);

function payLoanFunction() {
    if(loan - money > 0 && loan != 0) {
        loan -= money;
        money = 0;
        document.getElementById("workInfo").innerHTML = "Pay" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + money + " Kr.";
        document.getElementById("loanInfo").innerHTML = "Loan" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + loan + " Kr.";
    } 
    else{
        loan -= money;
        bank += (-loan);
        loan = 0;
        money = 0;
        document.getElementById("workInfo").innerHTML = "Pay" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + money + " Kr.";
        document.getElementById("balanceInfo").innerHTML = "Balance" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + bank + " Kr.";
        document.getElementById("loanInfo").innerHTML = "";
        document.getElementById("payLoan").style.display = "none";
    }
}


// Dropdown logic
document.getElementById("infoArea").style.display = "none";
async function getComputers() {
    let url = 'https://noroff-komputer-store-api.herokuapp.com/computers';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderComputers() {
    let computers = await getComputers();
    let html = '';
    computers.forEach(computer => {
        let htmlSegment = `<li>
                                <button id="${computer.id}" class="dropdown-item" onclick="getInfo(this.id)">
                                    ${computer.title}
                                </button>
                            </li>`;

        html += htmlSegment;
    });

    let dropdown = document.querySelector('#ddMenu');
    dropdown.innerHTML = html;
}

renderComputers();

async function getInfo(click_id) {
    document.getElementById("infoArea").style.display = "grid";
    let computers = await getComputers();
    let info = "";
    const liId = click_id;
    computers.forEach(computer => {
        if(computer.id == liId) {
            info = computer.specs.toString().replace(/,/g, "<br>");
            document.getElementById("output").innerHTML = info;
            document.getElementById("compImg").src = "https://noroff-komputer-store-api.herokuapp.com/" + computer.image;
            document.getElementById("compTitle").innerHTML = computer.title;
            document.getElementById("compDesc").innerHTML = computer.description;
            document.getElementById("compPrice").innerHTML = computer.price + " NOK";
            price = computer.price;
        }
    });
}


// Buy now button
let alertPlaceholder = document.getElementById('holderAlert');
let alertTrigger = document.getElementById('compBuyBtn');

function alert() {

  if (bank < price) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = '<div class="alert alert-' + 'danger' + ' alert-dismissible" role="alert">' + 'Alert! You cant afford this laptop. Check your bank' + '<button id="btnAlert" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    alertPlaceholder.append(wrapper);
  } else {
    bank -= price;
    document.getElementById("balanceInfo").innerHTML = "Balance" + "&emsp;&emsp;&emsp;&emsp;&emsp;" + bank + " Kr.";
    let wrapper = document.createElement('div');
    wrapper.innerHTML = '<div class="alert alert-' + 'success' + ' alert-dismissible" role="alert">' + 'You successfully purchased a laptop! It cant be refunded. ' + '<button id="btnAlert" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    alertPlaceholder.append(wrapper);
  }

}

if (alertTrigger) {
  alertTrigger.addEventListener('click', function () {
    alert();
  })
}