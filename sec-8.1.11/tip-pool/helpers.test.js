describe("Helpers test (with setup and tear-down)", function(){
  beforeEach(function(){
    allPayments.foo = { billAmt: 100, tipAmt: 15, tipPercent: 15};
    allPayments.bar = { billAmt: 0, tipAmt: 0, tipPercent: 0};
    allPayments.baz = { billAmt: 500, tipAmt: 75, tipPercent: 15};
  });

  it("should sum the payments correctly", function(){
    expect(sumPaymentTotal("billAmt")).toBe(600);
    expect(sumPaymentTotal("tipAmt")).toBe(90);
    expect(sumPaymentTotal("tipPercent")).toBe(30);
  });

  it("should calculate the tip percentage correctly", function(){
    expect(calculateTipPercent(allPayments.foo.billAmt, allPayments.foo.tipAmt)).toBe(allPayments.foo.tipPercent);
    expect(calculateTipPercent(allPayments.bar.billAmt, allPayments.bar.tipAmt)).toBeNaN();
    expect(calculateTipPercent(allPayments.baz.billAmt, allPayments.baz.tipAmt)).toBe(allPayments.foo.tipPercent);
  });
  
  it("should add a table cell to a table row", function(){
    const row = document.createElement("tr");
    appendTd(row, allPayments.foo.billAmt);
    appendTd(row, allPayments.foo.tipAmt);
    appendTd(row, allPayments.foo.tipPercent);
    expect(row.childElementCount).toBe(3);
    expect(row.querySelectorAll("td").length).toBe(3);
  });

  it("should add a delete button to a table row", function(){
    const row = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    td1.innerText = "ABC";
    td1.innerText = "DEF";
    td1.innerText = "GHI";
    row.id = "xyzzy1"
    row.append(td1, td2, td3);

    const allItems = {};
    allItems["xyzzy1"] = {a:1, b:2};

    appendDeleteBtn(row, allItems);
    expect(row.childElementCount).toBe(4);
    expect(row.lastElementChild.innerText).toContain("X");
  });

  afterEach(function(){
    allPayments = {};
  });
});