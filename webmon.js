if (document.monetization){
document.monetization.addEventListener("monetizationstart", function () {
  // This is only accessible to those using web monetization
  document.querySelector("#custom").className = "";
});
}
function save() {
  document.querySelector("#custom > div").className = "hidden";
  let customlink = document.querySelector("#customStart");
  let i = document.querySelector("#interestRate").value;
  let d = document.querySelector("#startingDebt").value;
  let m = document.querySelector("#startingMoney").value;
  let a = document.querySelector("#minTime").value;
  let b = document.querySelector("#maxTime").value;
  const f = "custom";
  customlink.className = "";
  customlink.href = `./game.html?i=${i}&d=${d}&m=${m}&f=${f}&a=${a}&b=${b}`;
  document.querySelector("#changeSettings").className = "";
}

function changeSettings() {
  document.querySelector("#custom > div").className = "flex-col";
  document.querySelector("#customStart").className = "hidden";
  document.querySelector("#changeSettings").className = "hidden";
}
