
// accepts 'tipAmt', 'billAmt', 'tipPercent' and sums total from allPayments objects
function sumPaymentTotal(type) {
  let total = 0;

  for (let key in allPayments) {
    let payment = allPayments[key];

    total += Number(payment[type]);
  }

  return total;
}

// converts the bill and tip amount into a tip percent
function calculateTipPercent(billAmt, tipAmt) {
  return Math.round(100 / (billAmt / tipAmt));
}

// expects a table row element, appends a newly created td element from the value
function appendTd(tr, value) {
  let newTd = document.createElement('td');
  newTd.innerText = value;

  tr.append(newTd);
}
// expects a table row element
function appendDeleteBtn(tr, allItems) {
  let button = document.createElement('td');
  button.innerText = "[X]";
  button.addEventListener("click", function(e){
    const row = e.target.parentElement;
    delete allItems[row.id];
    row.remove();
    updateServerTable();
    updateSummary();
  });

  tr.append(button);
}
