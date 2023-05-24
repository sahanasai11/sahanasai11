/**
 * Name: Sahana Saikumar
 * Date: 6/6/2022
 * Description: Javascript file for the functionality of the index page of the final project
 */

 (function() {
    "use strict";
    
    const ROOTPATH = "http://localhost:8000";
    const DEBUG = false;

    /**
     * Initialize the homepage of the website
     */
    async function init() {
        fetchSpecials();

        // Initialize cart to empty array if cart does not exist
        // if (!window.sessionStorage.getItem("cart")) {
        //     window.sessionStorage.setItem("cart", JSON.stringify([]));
        // }

        if (!window.sessionStorage.getItem("cartItemIDs")) {
            window.sessionStorage.setItem("cartItemIDs", JSON.stringify([]));
        }

    }

    /**
     * Fetch all special products from the API
     */
    async function fetchSpecials() {
        try {
            let resp = await fetch(ROOTPATH + "/menu-specials");
            resp = checkStatus(resp);
            const data = await resp.json();
            showSpecials(data);
        }
        catch (err) {
            handleError(err);
        }
    }

    /**
     * Helper function to show specials information
     * @param {Object} data JSON data object of all special products offered
     */
    async function showSpecials(data) {

        for (let i = 0; i < data.specials.length; i++) {
            let info = data.specials[i];
            let fig = gen("figure");
            let img = gen("img");
            let a = gen("a");
            let figcaption = gen("figcaption");
            a.href = "product.html" + "?flavor=" + 
                ((info.information.name.toLowerCase()).split(" ")).join("-");
            img.src = info.information.image;
            img.alt = info.information.name;
            figcaption.textContent = info.information.name;
            a.appendChild(img);
            fig.appendChild(a);
            fig.appendChild(figcaption);
            id("special-products").appendChild(fig);
        }

    }

    /**
     * Handle errors if they occur in a user-friendly manner
     * @param {Error} err 
     */
    function handleError(err) {
        if (DEBUG) {
            console.error(err);
        }
        else {

            id("special-products").textContent = 
            "We're having issues with our website. Please refresh or check in later!";
        }
    }

    init();
})();