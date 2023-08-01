function difference(x,y){
   return x-y;
}

function product(x,y){
   return x*y;
}

function printDay(ordinal){
   const daysOfWeek = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday"
   }
   return daysOfWeek[ordinal];
}

function lastElement(array){
   return array[array.length-1];
}

function numberCompare(x,y){
   if(x > y)
      return "First is greater";
   if(y > x)
      return "Second is greater";
   if(x === y)
      return "Numbers are equal";
}

function singleLetterCount(word, letter){
   let count = 0;
   for(let char of word.toLowerCase()){
      if(char === letter.toLowerCase()){
         count++;
      }
   }
   return count;
}

function isLetter(char) {
   return 'a' <= char.toLowerCase() && char.toLowerCase() <= 'z'
}

function multipleLetterCount(text){
   const counts = {};
   for(let char of text.toLowerCase()){
      if(isLetter(char))
         counts[char] = singleLetterCount(text, char);
   }
   return counts;
}

function arrayManipulation(array, command, location, value){
   switch(command.toLowerCase()){
      case "add":
         switch(location.toLowerCase()){
            case "beginning":
               array.unshift(value);
               return array;
            case "end":
               array.push(value);
               return array;
            default:
               console.log("Invalid location: " + location);
         }
         break;

      case "remove":
         switch(location.toLowerCase()){
            case "beginning":
               return array.shift();
            case "end":
               return array.pop();
            default:
               console.log("Invalid location: " + location);
         }
         break;

      default:
         console.log("Invalid command: " + command);
   }
}

function isPalindrome(text){
   let noSpaces = "";
   let reversed = "";

   // Removed non-letters from the text
   for(let char of text.toLowerCase()){
      if(char != " "){
         noSpaces += char;
      }
   }

   // Reverse the letters-only text
   for(let i = noSpaces.length-1; i >= 0; i--){
      reversed += noSpaces[i];
   }

   return noSpaces === reversed;
}

// Bonus
function playRPS(){
   console.log("Let's play Rock Paper Scissors!");

   const choices = ["rock", "paper", "scissors"];
   let cpuChoice = Math.floor(Math.random()*3);
   let userChoice = -1;
   let userInput;
   let promptMsg = "Choose one:\n\tRock\n\tPaper\n\tScissors\n\n";
   let errorMsg = "";
   
   while(userChoice === -1){
      userInput = prompt(promptMsg + errorMsg).toLowerCase();
      userChoice = choices.indexOf(userInput)

      if(choices.indexOf(userInput) === -1)
         errorMsg = "Invalid choice.  Try again.\n\n"
      else
         errorMsg = "";
   }

   console.log(`You chose ${choices[userChoice]} - I choose ${choices[cpuChoice]}`);

   if(userChoice > cpuChoice || userChoice == 0 && cpuChoice == 2){
      console.log("You WIN!");
   }
   else if(userChoice == cpuChoice){
      console.log("It's a tie.");
   }
   else{
      console.log("I win!");
      console.log("/flex memory chips")
   }
}