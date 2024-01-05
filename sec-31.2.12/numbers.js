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

function getRandomNumber(max) {
  return Math.ceil(Math.random() * max);
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

// 1. Make a request to the Numbers API to get a fact about your favorite number
axios.get(new NumbersAPI(FAV_NUMBER).getURL())
  .then(res => {
    const output = new OutPut("favorite-number");
    output.append(`<strong>${res.data.type}:</strong>  ${res.data.text}`);
  })
  .catch(err => console.log(err));

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

const numAPI2 = new NumbersAPI(...getSomeNumbers(400));

axios.get(numAPI2.getURL())
  .then(res => {
    const output = new OutPut("multiple-numbers");
    
    output.append(`<p><strong>${numAPI2.type}</strong></p>`)
    for(fact in res.data)
      output.appendLine(`${res.data[fact]}`);
  })
  .catch(err => console.log(err));

// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page.
Promise.all([
  axios.get(new NumbersAPI(44).getURL("trivia")),
  axios.get(new NumbersAPI(44).getURL("math")),
  axios.get(new NumbersAPI(44).getURL("date")),
  axios.get(new NumbersAPI(44).getURL("year"))
]).then(responses => {
    const output = new OutPut("four-facts");
    for(r of responses){
      output.appendLine(`<strong>${r.data.type}:</strong>  ${r.data.text}`);
    }
  })
  .catch(err => console.log(err));
