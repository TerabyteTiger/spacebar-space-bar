let state = {
  ingredients: {
    a: {
      label: "A",
      inv: 0,
      price: 1,
    },
    b: {
      label: "B",
      inv: 0,
      price: 2,
    },
    c: {
      label: "C",
      inv: 0,
      price: 59,
    },
  },
  // Store money in "cents", then display with decimals to user because js decimals are tired
  money: 15,
  debt: 0,
  day: 1,
  message: "",
  customersToday: 0,
  customersScheduled: 2,
};

function buy(item, amount) {
  let cost = amount * state.ingredients[item].price;
  if (cost <= state.money) {
    state.ingredients[item].inv = state.ingredients[item].inv + amount;
    setMessage(`${amount} ${item} purchased`);
    document.querySelector(
      `#${item}-stock`
    ).innerHTML = `${state.ingredients[item].inv}`;
    state.money = state.money - cost;
    updateMoney();
  } else {
    setMessage("Not enough money.");
  }
}

function use(item, amount, profits) {
  if (state.ingredients[item] >= amount) {
    state.ingredients[item] = state.ingredients[item] - amount;
    setMessage(`${amount} ${item} used`);
    state.money = state.money + profits;
  } else {
    setMessage("Not enough in stock");
  }
}

function setMessage(msg) {
  state.message = msg;
  document.querySelector("#message").innerHTML = msg;
}

function updateMoney() {
  document.querySelector("#money").innerHTML = state.money;
}

function payDebt(amount) {
  if (amount > state.money) {
    state.debt = state.debt - amount;
    state.money = state.money - amount;
  }
}

function newDay() {
  state.day = state.day + 1;
  state.customersToday = 0;
  // How many customers to schedule:
  const custChange = Math.min(
    10,
    Math.max(-5, Math.ceil((Math.random() - 0.35) * state.customersScheduled))
  );
  state.customersScheduled = Math.min(
    50,
    Math.max(4, state.customersScheduled + custChange)
  );
  updateDay();
}

function updateDay() {
  document.querySelector("#day").innerHTML = state.day;
}

function test(arg1) {
  console.log(arg1);
}

// Setup
const buyAbtn = document.querySelector("#buy-a");
const buyBbtn = document.querySelector("#buy-b");
const buyCbtn = document.querySelector("#buy-c");
buyAbtn.addEventListener("click", () => {
  buy("a", 1);
});
buyBbtn.addEventListener("click", () => {
  buy("b", 1);
});
buyCbtn.addEventListener("click", () => {
  buy("c", 1);
});

const testbtn = document.querySelector("#test");
testbtn.addEventListener("click", () => {
  newDay();
});

testbtn.innerHTML = "Test";

updateMoney();
