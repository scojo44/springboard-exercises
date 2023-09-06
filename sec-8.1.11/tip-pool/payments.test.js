describe("Payments test (with setup and tear-down)", function(){
  const mockEvent = { preventDefault: function(){} };

  beforeEach(function () {
    // initialization logic
    billAmtInput.value = "50";
    tipAmtInput.value = "8";
  });

  it("should add a payment to allPayments on submitPaymentInfo()", function(){
    submitPaymentInfo(mockEvent);
    expect(Object.keys(allPayments).length).toBe(1);
    expect(allPayments["payment" + paymentId].billAmt).toBe("50");
    expect(allPayments["payment" + paymentId].tipAmt).toBe("8");
  });

  it("should create a payment", function(){
    expect(createCurPayment()).toEqual({
      billAmt: "50",
      tipAmt: "8",
      tipPercent: 16
    });
  });

  it("shouldn't create a payment if the payment info fields are empty", function(){
    billAmtInput.value = "";
    tipAmtInput.value = "";
    expect(createCurPayment()).toBeUndefined();
  });

  it("shouldn't create a payment if the payment info fields are 0", function(){
    billAmtInput.value = "0";
    tipAmtInput.value = "0";
    expect(createCurPayment()).toBeUndefined();
  });

  it("should have one payment in the payment table after one payment entered", function(){
    appendPaymentTable(createCurPayment());
    expect(paymentTbody.childElementCount).toBe(1);
  });

  it("should sum the bill and tip amounts and display the average tip amount", function(){
    submitPaymentInfo(mockEvent);
    billAmtInput.value = "30";
    tipAmtInput.value = "6";
    submitPaymentInfo(mockEvent);
    updateSummary();
    expect(summaryTds[0].innerHTML).toBe("$80"); // billAmt
    expect(summaryTds[1].innerHTML).toBe("$14"); // tipAmt
    expect(summaryTds[2].innerHTML).toBe("18%"); // tipPercent
  });

  it("should remove a payment from the payment table and update the summary", function(){
    submitPaymentInfo(mockEvent);
    paymentTbody.rows[0].lastElementChild.click();
    expect(paymentTbody.rows.length).toBe(0);
  });

  afterEach(function() {
    // teardown logic
    billAmtInput.value = "";
    tipAmtInput.value = "";
    allPayments = {};
    paymentId = 0;
    paymentTbody.innerHTML = "";
    for(let td of summaryTds)
      td.innerHTML = "";
  });
});