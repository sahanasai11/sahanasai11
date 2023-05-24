/**
 * Name: Sahana Saikumar
 * Date: 5/13/2022
 * Javascript file for Hangman. 
 */

 (function() {
    "use strict";
    const RANDOM_WORD_URL = "https://random-word-api.herokuapp.com/word";
    const DEFN_URL_BASE = "https://www.dictionaryapi.com/api/v3/references/sd4/json/";
    const API_KEY = "?key=8e6b2a6a-6206-47bd-a57c-aad310eacd22";
    const END_GAME_INDEX = 9;
    const ALPHABET_LENGTH = 26;
    const ASCII_A = 65;
    let word = null;
    let numBlanks = 0;
    let hangmanIndex = 0;

    /**
     * Initialization function
     */
    function init() {
        let startBtn = id("start-btn");
        startBtn.addEventListener("click", fetchData);
        startBtn.addEventListener("click", startGame);
        populateLetters();
    }

    /**
     * Fetch word and definition data
     */
    async function fetchData() {
        let wordUrl = RANDOM_WORD_URL;

        let promise = fetch(wordUrl)
            .then(checkStatus)
            .then(resp => resp.json())
            .then(processWord)
            .catch(handleError);

        await promise;
        let defn_url = DEFN_URL_BASE + word + API_KEY;

        fetch(defn_url)
            .then(checkStatus)
            .then(resp => resp.json())
            .then(processDefn)
            .catch(handleError);
    }

    /**
     * Process the definition of the word
     * @param {JSON} json 
     */
    function processDefn(json) {
        if (json[0].shortdef == null) {
            fetchData();
        }
        else {
            for (let i = 0; i < word.length; i++){
                let blank = gen("p");
                blank.id = i;
                blank.innerHTML = "_";
                id("word").appendChild(blank);
            }

            let def = gen("p");
            def.id = "defn-text";
            def.innerHTML = json[0].shortdef.join('; ');
            id("definition").appendChild(def);
        }

        for (let i = 0; i < ALPHABET_LENGTH; i++) {
            id(String.fromCharCode(ASCII_A + i)).disabled = false;
        }
    }

    /**
     * Process the hangman word from the JSON object
     * @param {JSON} json
     */
    function processWord(json) {
        word = json[0];
        numBlanks = word.length;
    }

    /**
     * Handle errors that occur within the fetch
     * @param {error} err 
     */
    function handleError(err) {
        let errMsg = gen("p");
        errMsg.id = "err";
        errMsg.innerHTML = "There was an error accessing the word data. Please refresh or try again later!";
        id("word").appendChild(errMsg);
    }

    /**
     * (Copied from helpers.js for reference in lecture)
     * Helper function to return the Response data if successful, otherwise
     * returns an Error that needs to be caught.
     * @param {object} response - response with status to check for success/error.
     * @returns {object} - The Response object if successful, otherwise an Error that
     * needs to be caught.
     */
    function checkStatus(response) {
        if (!response.ok) { // response.status >= 200 && response.status < 300
         throw Error("Error in request: " + response.statusText);
        } // else, we got a response back with a good status code (e.g. 200)
        return response; // A Response object.
      }

    /**
     * Start the hangman game when the start button is pressed
     */
    function startGame() {
        id("start-btn").classList.toggle("hidden");
    }

    /**
     * Populate the page with buttons of each letter in the alphabet
     */
    function populateLetters() {
        for (let i = 0; i < ALPHABET_LENGTH; i++) {
            let div = gen("div");
            let btn = gen("button");
            let letter = String.fromCharCode(ASCII_A + i);
            btn.innerHTML = letter;
            btn.id = letter;
            div.appendChild(btn);
            id("letter-btns").appendChild(div);
            btn.addEventListener("click", checkLetter);
            btn.disabled = true;
        }
    }

    /**
     * Check if the letter associated with the pressed button exists in the word
     */
    function checkLetter() {
        if (word != null) {
            this.disabled = true;
            // buttons do nothing when game hasn't started
            let letter = this.id.toLowerCase();
            let indices = [];
            // check if letter is in word
            for (let i = 0; i < word.length; i++) {
                if (word[i] === letter){
                    indices.push(i);
                }
            }
            // letter is not in word
            if (indices.length == 0) {
                hangmanIndex++;
                id("hangman-img").src = "img/hangman" + hangmanIndex + ".png";
                if (hangmanIndex == END_GAME_INDEX){
                    id("hangman-img").src = "img/hangman" + hangmanIndex + ".png";
                    endGame("lose");
                }
            }
            // letter is in word
            for (let i = 0; i < indices.length; i++){
                id(indices[i]).textContent = letter;
                numBlanks--;
            }
            if (numBlanks == 0){
                endGame("win");
            }
        }
    }
    
    /**
     * Logic to handle the webpage when the game ends
     * @param {string} status denotes whether the player won or lost
     */
    function endGame(status) {
        for (let i = 0; i < ALPHABET_LENGTH; i++) {
            id(String.fromCharCode(ASCII_A + i)).disabled = true;
        }

        if (status === "win") {
            qs("h1").innerHTML = "YOU WON!";
        }
        else {
            id("word").innerHTML = "";

            let temp = gen("p");
            temp.innerHTML = word;
            id("word").appendChild(temp);
            qs("h1").innerHTML = "YOU LOST!";
        }
    }
      
    init();

})();