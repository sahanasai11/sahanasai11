(function() {
    "use strict";

    const SLIDES = qsa(".slide");
    const NEXTBTN = qs(".btn-next");
    const PREVBTN = qs(".btn-prev");

    let currSlide = 0;
    let maxSlide = SLIDES.length - 1;

    /**
     * Initialize the script using helper functions
     * @param None
     * @returns None
     */
    function init() {
        console.log("In init!");
        initCarousel();
        initTextField();
    }

    /**
     * Initialize the carousel functionality. If no carousel is present in a page, catch
     * the exception and print to console.
     * @param None
     * @returns None
     */
    function initCarousel() {
        for (let i = 0; i < SLIDES.length; i++){
            SLIDES[i].style.transform = `translateX(${i * 100}%)`;
        } 
        
        try {
            PREVBTN.classList.toggle("hidden");
            NEXTBTN.addEventListener("click", nextClick);
            PREVBTN.addEventListener("click", prevClick);
        } catch (e) {
            console.log("No carousel in current page.");
        }
    }

    /**
     * Initialize the text field functionality. If no text field is present in a page, catch
     * the exception and print to console.
     * @param None
     * @returns None
     */
    function initTextField(){
        try {
            id("text").addEventListener("keypress", function(e) {
                if (e.key === "Enter") {
                    addText();
                }
            });
        } catch (e) {
            console.log("No text field in current page.");
        }
    }

    // Carousel inspiration taken from
    // https://blog.logrocket.com/build-image-carousel-from-scratch-vanilla-javascript/
    
    /**
     * Function for clicking the next button of the carousel
     * @param None
     * @returns None
     */
    function nextClick() {
        if (currSlide !== maxSlide) {
            currSlide++;
        }

        if (currSlide === 1){
            PREVBTN.classList.toggle("hidden");
        }

        if (currSlide === maxSlide) {
            NEXTBTN.classList.toggle("hidden");
        }

        for (let i = 0; i < SLIDES.length; i++){
            SLIDES[i].style.transform = `translateX(${100 * (i - currSlide)}%)`;
        }
    }
    /**
     * Function for clicking the previous button of the carousel
     * @param None
     * @returns None
     */
    function prevClick() {
        
        if (currSlide > 0) {
            currSlide--;
        }

        if (currSlide === 0) {
            PREVBTN.classList.toggle("hidden");
        }

        if (currSlide === SLIDES.length - 2){
            NEXTBTN.classList.toggle("hidden");
        }

        for (let i = 0; i < SLIDES.length; i++){
            SLIDES[i].style.transform = `translateX(${100 * (i - currSlide)}%)`;
        }
    }

    /**
     * Function for adding points to the homepage when entered into text field.
     * @param None
     * @returns None
     */
    function addText() {
        let text = id("text").value;
        let val = document.createElement("li");
        val.textContent = text;
        id("possibilities-list").appendChild(val);
    }

    init();
})();