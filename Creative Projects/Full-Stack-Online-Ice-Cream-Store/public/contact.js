/**
 * Name: Sahana Saikumar
 * Date: 6/6/2022
 * Description: Javascript file for the functionality of the contact page of the final project
 */

(function() {
    "use strict";
    
    const ROOTPATH = "http://localhost:8000";
    const CONTACT = "/contact";
    const DEBUG = false;


    /**
     * Initialize the webpage by showing all menu items and enabling filters
     */
    async function init() {
        submitMessage();
    }

    /**
     * Helper function to submit a message input into the form
     */
    async function submitMessage() {
        id("contact").addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                let resp = await fetch(ROOTPATH + CONTACT, 
                    {
                        method : "POST", 
                        body : (new FormData(id("contact")))
                    });
                checkStatus(resp);
                id("submit-result").textContent = "Successfully submitted!";
            } catch (err) {
                handleError(err);
            }
        });
    }

    /**
     * Handle errors if they occur in a user-friendly manner
     * @param {Error} err 
     */
    function handleError(err) {
        if (DEBUG) {
            console.error(err);
        } else {
            id("submit-result").textContent = 
            "We're having issues with our website. Please refresh or submit later!";
        }
    }

    init();
})();