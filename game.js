// a, b, and c were easy to use variables because I didn't decide what to call items until I had the interface mostly styled - namely so that none of the items were too many characters and caused overflow in the UI.
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
      label: "Stardust Ice Cream",
      inv: 0,
      price: 9,
    },
  },
  // Store money (and prices) in whole numbers because js decimals are tired
  money: 15,
  debt: 150,
  interest: 0,
  difficulty: "short",
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
      `Not enough money to buy ${amount} ${state.ingredients[item].label}.`,
      "red"
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
    setMessage("Not enough in stock", "red");
  }
}

function updateStock(item) {
  document.querySelector(
    `#${item}-stock`
  ).innerHTML = `<span class="${item}">${state.ingredients[item].label}</span>: ${state.ingredients[item].inv}`;
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
      `You don't have any ${state.ingredients[request].label} to sell`,
      "red"
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

function setMessage(msg, color = "green") {
  state.message = msg;
  document.querySelector("#message").innerHTML = `Latest Message: ${msg}`;
  document.querySelector("#message").className = `message ${color}`;
}

function updateMoney() {
  document.querySelector("#money").innerHTML = state.money;
}

function updateDebt() {
  document.querySelector("#debtAmount").innerHTML = state.debt;
}

function payDebt() {
  const amount = parseInt(document.querySelector("#paymentAmount").value);
  // Stop users from soft locking
  if (
    state.ingredients.a.inv === 0 &&
    state.ingredients.b.inv === 0 &&
    state.ingredients.c.inv === 0 &&
    amount < state.debt &&
    amount >= state.money - 1
  ) {
    setMessage("You can't do that right now", "red");
    return;
  }
  if (amount <= state.money) {
    state.debt = state.debt - amount;
    state.money = state.money - amount;
    updateMoney();
    updateDebt();
    closeDialog();
    if (state.debt <= 0) {
      state.debt = 0;
      // Open dialog and set focus to share button
      document.querySelector(".dialog-background").className =
        "dialog-background";
      document.querySelector("#victory").className = "dialog-open center";
      document.querySelector(".twitterbtn").focus();
      document.querySelector(
        "#victoryMessage"
      ).innerHTML = `You have paid off your debt to the Function keys in ${state.day} days!`;
    }
  } else {
    setMessage("You don't have enough money to do that", "red");
  }
}

function closeDialog() {
  document.querySelector(".dialog-background").className =
    "dialog-background hidden";
  document.querySelector("#debt").className = "dialog-open center hidden";
  document.querySelector("#victory").className = "dialog-open center hidden";
  document.querySelector("#buy-a").focus();
}

function openDialog() {
  document.querySelector(".dialog-background").className = "dialog-background";
  document.querySelector("#debt").className = "dialog-open center";
  document.querySelector("#paymentAmount").focus();
}

function checkEOD() {
  let seats = document.querySelectorAll(".seat");
  if (seats.length === 0 && state.customersToday >= state.customersScheduled) {
    setMessage("Day Ended!");
    document.querySelector("#purchasing").className = "";
  }
}

function newDay() {
  // document.querySelector("#debt").className = "hidden";
  document.querySelector("#purchasing").className = "hidden";
  state.day = state.day + 1;
  state.debt = Math.floor(state.interest * parseInt(state.debt));
  updateDebt();
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
      phrase: getPhrase(),
    };
  } else if (percentile <= 0.25) {
    // Customers
    let letters = ["b", "a", "s", "i", "c", "a", "f"];
    const multiplier = 1.05;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
      phrase: getPhrase(),
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
      phrase: getPhrase(),
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
      phrase: getPhrase(),
    };
  } else {
    // Super high rollers
    let letters = ["T", "B", "T", "I", "G", "R"];
    const multiplier = 5;
    return {
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: multiplier,
      requesting: requesting,
      phrase: getPhrase(),
    };
  }
}

function getPhrase() {
  // "I want (item) {phrase}"
  const phrases = [
    " and make it salty!",
    " shaken, not stirred.",
    " please!",
    " with extra pizaazz!",
    ".",
    ".",
    "!",
    "!",
    "... I think...",
    " - and quick!",
    ", but no rush.",
    " - put it on my tab!",
    " before I head home.",
    " - it's delicious!",
    " to feel alive",
    ". After all, I'm not driving!",
    " in a space cone, please.",
    " with a side of moon rocks.",
    " in a rainbow dish.",
    " and a dog treat for Luna.",
  ];

  return phrases[
    Math.min(phrases.length - 1, Math.floor(Math.random() * phrases.length))
  ];
}

function seatCustomer() {
  const currentSeats = document.querySelectorAll(".seat");
  // increment # of customers today 
  state.customersToday = parseInt(state.customersToday) + 1;
  if (currentSeats.length >= 3) {
    setMessage("All seats filled! Customer left!", "red");
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
      <div class="flex">
      <div>
      <div class="key">
      ${customer.letter}
      </div>
      </div>
      <div class="quote grow">
          <p>"I want <span class="${customer.requesting}">${
        state.ingredients[customer.requesting].label
      }</span> for $${Math.max(
        1,
        Math.round(
          customer.multiplier * state.ingredients[customer.requesting].price
        )
      )}${customer.phrase}"</p>
      </div>
      </div>
      <div class="btnGroupSm">
      <button onclick="serve('seat-${seat}')" class="servebtn btn">Serve</button>
      <button onclick="dismiss('seat-${seat}')" class="dismissbtn btn">Dismiss</button>
      </div>
    </div>`;
  }
}

function updatePricing(item) {
  // Randomly update the pricing of the passed in item - each day the items will randomly change in price from -33% - +35% rounded to an integer.
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

function shareVictory() {
  // share to twitter using the twitter intent to tweet url config
  window.open(
    `https://twitter.com/intent/tweet?text=I%20just%20beat%20Spacebar%27s%20Space%20bar%20on%20${state.difficulty}%20in%20${state.day}%20days%21%20Can%20you%20finish%20faster%3F%20%0A%0ACreated%20by%20%40terabytetiger%0A%0Ahttps%3A%2F%2Fspacebar.terabytetiger.com%2F`,
    "newwindow",
    "width=500, height=300, top=" +
      (window.innerHeight - 300) / 2 +
      ", left=" +
      (window.innerWidth - 500) / 2
  );
}


function mounted() {
  // Setup buttons - this will easily allow for adjustments to the names of ingredients
  const buyAbtn = document.querySelector("#buy-a");
  const buyBbtn = document.querySelector("#buy-b");
  const buyCbtn = document.querySelector("#buy-c");
  
  buyAbtn.innerHTML = `Buy 1 <span class="a">${state.ingredients.a.label}</span> ($${state.ingredients.a.price})`;
  buyBbtn.innerHTML = `Buy 1 <span class="b">${state.ingredients.b.label}</span> ($${state.ingredients.b.price})`;
  buyCbtn.innerHTML = `Buy 1 <span class="c">${state.ingredients.c.label}</span> ($${state.ingredients.c.price})`;

  // Gather gameplay settings from URL Params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("i")) {
    state.interest = parseInt(urlParams.get("i")) * 0.01 + 1;
  }
  if (urlParams.has("d")) {
    state.debt = parseInt(urlParams.get("d"));
  }
  if (urlParams.has("m")) {
    state.money = parseInt(urlParams.get("m"));
  }
  if (urlParams.has("f")) {
    state.difficulty = urlParams.get("f");
  }
}

mounted();

updateMoney();
updateDebt();
updateStock("a");
updateStock("b");
updateStock("c");
// newDay();
