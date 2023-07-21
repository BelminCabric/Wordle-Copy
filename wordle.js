const ANSWER_LENGHT = 5;
const ROUNDS = 6;
const letters = document.querySelectorAll(".box")
const loadingDiv = document.querySelector(".info-bar")

async function initate() {
  let currentRow = 0;
  let currentGuess = "";
  let isLoading = true;
  let done = false;


const response = await fetch ("https://words.dev-apis.com/word-of-the-day?random=1")
const responseObject = await response.json();
const word = responseObject.word.toUpperCase();
const wordParts = word.split("");
setLoading(false);
isLoading = false;
  
function addLetter (letter) {
  if (currentGuess.length < ANSWER_LENGHT) {
    currentGuess += letter ;
  } else {
currentGuess = currentGuess.substring (0, currentGuess.length -1) + letter
  }

  letters[ANSWER_LENGHT *currentRow + currentGuess.length-1].innerText = letter;
}

console.log(word); // REMOVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE //

async function commit() {
  if (currentGuess.length !== ANSWER_LENGHT) {
  // nothing happens //
  return;
 }

 isLoading = true;
 setLoading(true);

 const response = await fetch("https://words.dev-apis.com/validate-word" , {
  method: "POST",
  body: JSON.stringify ({ word:currentGuess })
 });

 const responseObject = await response.json ();
 const validWord = responseObject.validWord; 

 isLoading = false;
 setLoading(false);

 if (!validWord) {
    markInvalidWord();
    return;
 }

const guessParts = currentGuess.split("");
const map = makeMap(wordParts);

for (let i = 0;i < ANSWER_LENGHT;i++) {
  // mark as correct //
  if(guessParts[i] === wordParts[i]) {
    letters[currentRow * ANSWER_LENGHT + i].classList.add("correct");
    map [guessParts[i]]--;
  }
}

for(let i = 0; i < ANSWER_LENGHT;i++) {
  if(guessParts[i] === wordParts[i]) {

  } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
    // mark as close //
    letters[currentRow * ANSWER_LENGHT + i].classList.add("close");
    map[guessParts[i]]--;
  } else {
    letters[currentRow * ANSWER_LENGHT + i].classList.add("wrong");
  }
}

currentRow++;


if (currentGuess === word) {
  // you win //
  
  document.querySelector(".title").classList.add("winner")
  done = true;
  return;
 } else if (currentRow === ROUNDS) {
  alert(`You lose,the word was ${word}`)
  done = true;
}

currentGuess = "";
}

function backspace () {
  currentGuess = currentGuess.substring (0, currentGuess.length -1)
  letters [ANSWER_LENGHT * currentRow + currentGuess.length ].innerText = "";
}

function markInvalidWord () {
 // alert("Not a valid word")

for (let i = 0; i < ANSWER_LENGHT;i++) {
  letters[currentRow * ANSWER_LENGHT + i].classList.remove("invalid")

  setTimeout(function () {
    letters[currentRow * ANSWER_LENGHT + i].classList.add("invalid")
  },10)
}
}

document.addEventListener("keydown", function handleKeyPress (event) {
if (done || isLoading) {
  // nothing happens //
  return;
}

  const action = event.key;

  console.log(event.key)

  if(action === "Enter") {
    commit ();
  } else if (action === "Backspace") {
    backspace();
  } else if (isLetter(action)) {
    addLetter(action.toUpperCase());
  } else {
    // nothing happens //
  }

});
};

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter); 
}

function setLoading(isLoading) {
  loadingDiv.classList.toggle("show", isLoading);
}

function makeMap (array) {
  const obj = {};
  for (let i = 0;i < array.length; i++) {
    const letter = array [i] 
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }

return obj;
}

initate ();