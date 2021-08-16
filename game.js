let state = {
  ingredients: {
    a: {
      label: "Space Juice",
      inv: 0,
      price: 1,
    },
    b: {
      label: "Meteorite on the Rocks",
      inv: 0,
      price: 4,
    },
    c: {
      label: "Stardust Sprinkle Ice Cream",
      inv: 0,
      price: 59,
    },
  },
  // Store money in "cents", then display with decimals(?) to user because js decimals are tired
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

function generateCustomer() {
  // Returns a Customer object (Letter, requesting, )
  const percentile = Math.random();
  // 👇🏻 Modify this to influence likelyhood of item appearing
  const requesting =
    state.day >= 5
      ? ["a", "a", "a", "a", "a", "a", "b", "b", "b", "b", "c", "c"][
          Math.floor(Math.random() * 12)
        ]
      : ["a", "a", "a", "a", "a", "a", "b", "b"][Math.floor(Math.random() * 8)];
  if (percentile <= 0.01 && state.day >= 3) {
    // Always has a coupon | starts appearing on day 3
    let letters = ["c", "h", "e", "a", "p"];

    const multiplier = 0.95;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  } else if (percentile <= 0.31) {
    // Customers
    let letters = ["b", "a", "s", "i", "c"];
    const multiplier = 1.05;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  } else if (percentile <= 0.81) {
    // Average Spenders
    let letters = ["a", "v", "e", "r", "a", "g", "e"];
    const multiplier = 1.25;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  } else if (percentile <= 0.98) {
    // High Rollers
    let letters = [
      "x",
      "y",
      "z",
      "q",
      "x",
      "y",
      "z",
      "q",
      "x",
      "y",
      "z",
      "q",
      "x",
      "y",
      "z",
      "q",
      "~",
    ];
    const multiplier = 1.75;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  } else {
    // Super high rollers
    let letters = ["T", "B", "T", "I", "G", "R"];
    const multiplier = 3;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  }
}

// Setup
const buyAbtn = document.querySelector("#buy-a");
const buyBbtn = document.querySelector("#buy-b");
const buyCbtn = document.querySelector("#buy-c");

buyAbtn.innerHTML = `Buy 1 ${state.ingredients.a.label}`;
buyBbtn.innerHTML = `Buy 1 ${state.ingredients.b.label}`;
buyCbtn.innerHTML = `Buy 1 ${state.ingredients.c.label}`;

const testbtn = document.querySelector("#test");
testbtn.addEventListener("click", () => {
  console.log(generateCustomer());
});

testbtn.innerHTML = "Test";

updateMoney();
