/** Part 1: Number Facts */
const FAV_NUMBER = 44;

class OutPut {
  constructor(elementID){
    this.element = document.getElementById(elementID);
    this.element.innerHTML = ""; // Clear "loading" messages
  }

  append = msg => this.element.innerHTML += msg;
  appendLine = msg => this.append(msg + "<br>");
}

class NumbersAPI {
  constructor(...numbers){
    this.numbers = numbers;
  }

  getURL(type) {
    this.type = type || this.getRandomType();
    return `http://numbersapi.com/${this.numbers.join(",")}/${this.type}/?json`;
  }

  getRandomType() {
    let typeCount = 4;

    // Since "date" means the number of days in a year, don't use the date type for numbers more than 366.
    if(this.numbers.some(x => x > 366))
      typeCount = 3;

    switch(getRandomNumber(typeCount)) {
      case 1:  return "trivia";
      case 2:  return "math";
      case 3:  return "year";
      case 4:  return "date";
    }
  }
}

function getRandomNumber(max) {
  return Math.ceil(Math.random() * max);
}

// 1. Make a request to the Numbers API to get a fact about your favorite number
async function getFavNumberFact() {
  try {
    const res = await axios.get(new NumbersAPI(FAV_NUMBER).getURL())
    const out = new OutPut("favorite-number");
    out.append(`<strong>${res.data.type}:</strong>  ${res.data.text}`);
  }
  catch(error) {
    console.log("1. Error getting a number fact: ", error);
  }
}
getFavNumberFact();

// 2. Figure out how to get data on multiple numbers in a single request.
function getSomeNumbers(max){
  const numbers = [];

  for(let i = 0; i<10; i++){
    let newNum;

    do {
      newNum = getRandomNumber(max);      
    } while(numbers.includes(newNum))

    numbers.push(newNum);
  }
  return numbers;
}

async function getFactsOnManyNumbers() {
  const numAPI2 = new NumbersAPI(...getSomeNumbers(400));

  try {
    const res = await axios.get(numAPI2.getURL())
    const out = new OutPut("multiple-numbers");
    out.append(`<h5>${numAPI2.type} facts</h5>`)
    for(fact in res.data)
      out.appendLine(`${res.data[fact]}`);
  }
  catch(error) {
    console.log("2. Error getting facts on many numbers: ", error);
  }
}
getFactsOnManyNumbers();

// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page.
async function getFourFacts(number) {
  try {
    const responses = await Promise.all([
      axios.get(new NumbersAPI(number).getURL("trivia")),
      axios.get(new NumbersAPI(number).getURL("math")),
      axios.get(new NumbersAPI(number).getURL("date")),
      axios.get(new NumbersAPI(number).getURL("year"))
    ])

    const out = new OutPut("four-facts");
    for(r of responses){
      out.appendLine(`<strong>${r.data.type}:</strong>  ${r.data.text}`);
    }
  }
  catch(error) {
    console.log("3. Error getting four facts on a number: ", error);
  }
}
getFourFacts(FAV_NUMBER);