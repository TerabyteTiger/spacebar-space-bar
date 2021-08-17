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
      price: 9,
    },
  },
  // Store money in "cents", then display with decimals(?) to user because js decimals are tired
  money: 15,
  debt: 150,
  day: 0,
  message: "",
  customersToday: 0,
  customersScheduled: 2,
};

function buy(item, amount) {
  let cost = amount * state.ingredients[item].price;
  if (cost <= state.money) {
    state.ingredients[item].inv = state.ingredients[item].inv + amount;
    setMessage(`${amount} ${state.ingredients[item].label} purchased`);
    updateStock(item);
    state.money = state.money - cost;
    updateMoney();
  } else {
    setMessage(
      `Not enough money to buy ${amount} ${state.ingredients[item].label}.`
    );
  }
}

function use(item, amount, profits) {
  if (state.ingredients[item].inv >= amount) {
    state.ingredients[item].inv = state.ingredients[item].inv - amount;
    setMessage(`${amount} ${state.ingredients[item].label} used`);
    state.money = parseInt(state.money) + parseInt(profits);
    updateStock(item);
    updateMoney();
  } else {
    setMessage("Not enough in stock");
  }
}

function updateStock(item) {
  document.querySelector(
    `#${item}-stock`
  ).innerHTML = `${state.ingredients[item].label}: ${state.ingredients[item].inv}`;
}

function serve(seatId) {
  let seat = document.querySelector(`#${seatId}`);
  let payment = seat.attributes.price.value;
  let request = seat.attributes.requesting.value;
  if (state.ingredients[request].inv > 0) {
    use(request, 1, payment);
    seat.remove();
  } else {
    setMessage(
      `You don't have any ${state.ingredients[request].label} to sell`
    );
  }
  checkEOD();
}

function dismiss(seatId) {
  let seat = document.querySelector(`#${seatId}`);
  let request = seat.attributes.requesting.value;
  // ? Should price update after dismissing a customer, stimulating increased demand?
  seat.remove();
  checkEOD();
}

function setMessage(msg) {
  state.message = msg;
  document.querySelector("#message").innerHTML = msg;
}

function updateMoney() {
  document.querySelector("#money").innerHTML = state.money;
}

function updateDebt() {
  document.querySelector("#debtAmount").innerHTML = state.debt;
}

function payDebt() {
  const amount = parseInt(document.querySelector("#paymentAmount").value);
  console.log(amount);
  // Stop users from soft locking
  if (
    state.ingredients.a.inv === 0 &&
    state.ingredients.b.inv === 0 &&
    state.ingredients.c.inv === 0 &&
    amount < state.debt &&
    amount === state.money
  ) {
    setMessage("You can't do that right now");
    return;
  }
  if (amount <= state.money) {
    state.debt = state.debt - amount;
    state.money = state.money - amount;
    updateMoney();
    updateDebt();
    if (state.debt <= 0) {
      state.debt = 0;
      // TODO: Add game finished logic here
      alert(`Game finished! You won in ${state.day} days!`);
    }
  } else {
    setMessage("You don't have enough money to do that");
  }
}

function checkEOD() {
  let seats = document.querySelectorAll(".seat");
  if (seats.length === 0 && state.customersToday >= state.customersScheduled) {
    setMessage("Day Ended!");
    document.querySelector("#debt").className = "";
    document.querySelector("#purchasing").className = "";
  }
}

function newDay() {
  document.querySelector("#debt").className = "hidden";
  document.querySelector("#purchasing").className = "hidden";
  state.day = state.day + 1;
  state.customersToday = 0;
  // How many customers to schedule:
  const custChange = Math.min(
    10,
    Math.max(-5, Math.ceil((Math.random() - 0.35) * state.customersScheduled))
  );
  state.customersScheduled =
    state.day === 1
      ? 2
      : Math.min(50, Math.max(4, state.customersScheduled + custChange));
  setMessage(
    `A new day has started! You will have ${state.customersScheduled} customers today!`
  );
  updateDay();

  updatePricing("a");
  updatePricing("b");
  updatePricing("c");
  startCustomers();
}

function updateDay() {
  document.querySelector("#day").innerHTML = state.day;
}

async function startCustomers() {
  let timerRandom =
    Math.max(4, Math.min(1.5, Math.floor(Math.random() * 5))) * 1000;
  await delay(timerRandom);
  seatCustomer();
  let totalInv =
    parseInt(state.ingredients.a.inv) +
    parseInt(state.ingredients.b.inv) +
    parseInt(state.ingredients.c.inv);
  if (state.customersScheduled > state.customersToday && totalInv != 0) {
    startCustomers();
  } else if (totalInv == 0) {
    state.customersToday = state.customersScheduled;
  }
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, time);
  });
}

function generateCustomer() {
  // Returns a Customer object (Letter, requesting, )
  let percentile = Math.random();
  // 👇🏻 Modify this to influence likelyhood of item appearing
  let requesting =
    state.day >= 5
      ? ["a", "a", "a", "a", "a", "a", "b", "b", "b", "b", "c", "c"][
          Math.floor(Math.random() * 12)
        ]
      : ["a", "a", "a", "a", "a", "a", "b", "b"][Math.floor(Math.random() * 8)];
  if (percentile <= 0.01 && state.day >= 3) {
    // Always has a coupon | starts appearing on day 3
    let letters = ["c", "h", "e", "a", "p"];
    const multiplier = 0.5;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  } else if (percentile <= 0.25) {
    // Customers
    let letters = ["b", "a", "s", "i", "c", "a", "f"];
    const multiplier = 1.05;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  } else if (percentile <= 0.76) {
    // Average Spenders
    let letters = [
      "a",
      "v",
      "e",
      "r",
      "a",
      "g",
      "e",
      "j",
      "o",
      "e",
      "u",
      "k",
      "n",
      "o",
      "w",
    ];
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
    const multiplier = 2;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  } else {
    // Super high rollers
    let letters = ["T", "B", "T", "I", "G", "R"];
    const multiplier = 5;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
    };
  }
}

function seatCustomer() {
  const currentSeats = document.querySelectorAll(".seat");
  // increment # of customers today
  state.customersToday = parseInt(state.customersToday) + 1;
  if (currentSeats.length >= 3) {
    console.log("All seats filled");
  } else {
    const seat = state.customersToday;
    let customer = generateCustomer();
    document.querySelector("#customers").innerHTML =
      document.querySelector("#customers").innerHTML +
      `
    <div class="seat" id="seat-${seat}" requesting="${
        customer.requesting
      }" price="${Math.max(
        1,
        Math.round(
          customer.multiplier * state.ingredients[customer.requesting].price
        )
      )}">
      ${customer.letter}
      <br/>
      Buying ${state.ingredients[customer.requesting].label} for $${Math.max(
        1,
        Math.round(
          customer.multiplier * state.ingredients[customer.requesting].price
        )
      )}
      <br/>
      <button onclick="serve('seat-${seat}')">Serve</button>
      <button onclick="dismiss('seat-${seat}')">Dismiss</button>
    </div>`;
  }
}

function updatePricing(item) {
  const percentile = Math.min(Math.random() - 0.33, 0.35);
  state.ingredients[item].price = Math.max(
    state.ingredients[item].price +
      Math.round(state.ingredients[item].price * percentile),
    2
  );
  document.querySelector(
    `#buy-${item}`
  ).innerHTML = `Buy 1 ${state.ingredients[item].label} ($${state.ingredients[item].price})`;
  return state.ingredients[item].price;
}

// Setup
const buyAbtn = document.querySelector("#buy-a");
const buyBbtn = document.querySelector("#buy-b");
const buyCbtn = document.querySelector("#buy-c");

buyAbtn.innerHTML = `Buy 1 ${state.ingredients.a.label} ($${state.ingredients.a.price})`;
buyBbtn.innerHTML = `Buy 1 ${state.ingredients.b.label} ($${state.ingredients.b.price})`;
buyCbtn.innerHTML = `Buy 1 ${state.ingredients.c.label} ($${state.ingredients.c.price})`;

updateMoney();
updateDebt();
updateStock("a");
updateStock("b");
updateStock("c");
// newDay();
