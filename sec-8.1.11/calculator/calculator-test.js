const p100000y10r6 = {amount: 100000, years: 10, rate: 6};
const freeInterest = {amount: 250000, years: 30, rate: 0};
const myCar = {amount: 33392, years: 6, rate: 5.04};

it('should calculate the monthly rate correctly', function () {
  expect(calculateMonthlyPayment(p100000y10r6)).toBe("1110.21");
  expect(calculateMonthlyPayment(freeInterest)).toBe("694.44");
  expect(calculateMonthlyPayment(myCar)).toBe("538.40");
});

it("should return a result with 2 decimal places", function() {
  const endsWith2DecimalPlaces = /\.[0-9][0-9]$/gi;
  expect(calculateMonthlyPayment(p100000y10r6)).toMatch(endsWith2DecimalPlaces);
  expect(calculateMonthlyPayment(freeInterest)).toMatch(endsWith2DecimalPlaces);
  expect(calculateMonthlyPayment(myCar)).toMatch(endsWith2DecimalPlaces);
});

it("should be less than the loan amount", function(){
  expect(calculateMonthlyPayment(p100000y10r6)).toBeLessThan(p100000y10r6.amount);
  expect(calculateMonthlyPayment(freeInterest)).toBeLessThan(freeInterest.amount);
  expect(calculateMonthlyPayment(myCar)).toBeLessThan(myCar.amount);
})

it("should be a number", function(){
  expect(calculateMonthlyPayment(p100000y10r6)).not.toBe("NaN");
  expect(calculateMonthlyPayment(freeInterest)).not.toBe("NaN");
  expect(calculateMonthlyPayment(myCar)).not.toBe("NaN");
})
