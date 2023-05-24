/**
 * Name: Sahana Saikumar
 * Date: 6/6/2022
 * Description: Javascript file for the functionality of the menu page of the final project
 */

 (function() {
    "use strict";
    
    const ROOTPATH = "http://localhost:8000";
    const DEBUG = false;

    let dairyFreeChecked = "false";
    let containsNutsChecked = "false";
    let lowFatChecked = "false";
    let currPrice = 6;

    /**
     * Initialize the webpage by showing all menu items and enabling filters
     */
    async function init() {
        fetchMenu();

        id("dairy-free").addEventListener('change', function () {
            dairyFreeChecked = this.checked.toString();
            fetchFilteredMenu(dairyFreeChecked, containsNutsChecked, lowFatChecked, currPrice);
        });

        id("nut-free").addEventListener('change', function () {
            containsNutsChecked = this.checked.toString();
            fetchFilteredMenu(dairyFreeChecked, containsNutsChecked, lowFatChecked, currPrice);
        });

        id("low-fat").addEventListener('change', function () {
            lowFatChecked = this.checked.toString();
            fetchFilteredMenu(dairyFreeChecked, containsNutsChecked, lowFatChecked, currPrice);
        });

        id("price-range").addEventListener('change', function () {
            currPrice = this.value;
            fetchFilteredMenu(dairyFreeChecked, containsNutsChecked, lowFatChecked, currPrice);
        });
    }

    /**
     * Fetch all products from the API
     */
    async function fetchMenu() {
        try {
            let resp = await fetch(ROOTPATH + "/menu");
            resp = checkStatus(resp);
            const data = await resp.json();
            console.log(data);
            showMenu(data);
        }
        catch (err) {
            handleError(err);
        }
    }

    /**
     * Helper function to show menu information
     * @param {Object} data JSON data object of all products offered
     */
    async function showMenu(data) {
        id("products").innerHTML = "";

        for (let i = 0; i < data.flavors.length; i++) {
            let info = data.flavors[i];
            let fig = gen("figure");
            let img = gen("img");
            let a = gen("a");
            let figcaption = gen("figcaption");
            a.href = "product.html" + "?flavor=" + 
                ((info.information.name.toLowerCase()).split(" ")).join("-");
            img.src = info.information["image"];
            img.alt = info.information["name"];

            figcaption.textContent = info.information["name"] + ", " + "$" 
                + info.information["price"];
            a.appendChild(img);
            fig.appendChild(a);
            fig.appendChild(figcaption);
            id("products").appendChild(fig);
    
        }
    }

    /**
     * Fetch filtered data from API
     * @param {string} d whether or not flavor has dairy-free option
     * @param {sting} n whether or not flavor has nuts
     * @param {string} l whether or not flavor has low-fat option
     * @param {int} p price of flavor
     */
    async function fetchFilteredMenu(d, n, l, p) {
        try {
            let resp = await fetch(ROOTPATH + "/menu/price=" + p + "/dairyfree=" + 
                d + "/hasnuts=" + n + "/lowfat=" + l);
            resp = checkStatus(resp);
            const data = await resp.json();
            showMenu(data);
        }
        catch (err) {
            handleError(err);
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
            id("products").textContent = 
            "We're having issues with our website. Please refresh or check in later!";
        }
    }

    init();
})();