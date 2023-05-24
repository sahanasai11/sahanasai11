/*
 * Name: Sahana Saikumar
 * Date: 5/29/2022
 * Description: Javascript file for generating meals
 */
(function() {
    "use strict";
    let btn = id("btn");
    const rootPath = "http://localhost:8000";
    
    /**
     * Initialize the webpage
     */
    async function init() {
        btn.addEventListener("click", displayMeal);
    }

    /**
     * Access meal information from the API
     */
    async function displayMeal() {
        try {
            let url = rootPath + "/meals";
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            console.log(data);
            showMeal(data);
        } catch (err){
            console.log(err);
        }
    }

    /**
     * Display the meal information on the webpage
     * @param data JSON meal data
     */
    function showMeal(data) {
        while (id("meal1").firstChild != null){
            id("meal1").removeChild(id("meal1").lastChild);
        }
        while (id("meal2").firstChild != null){
            id("meal2").removeChild(id("meal2").lastChild);
        }

        let allMeals = data["meals"];
        let i1 = Math.floor(Math.random() * allMeals.length);
        let i2 = Math.floor(Math.random() * allMeals.length);

        while (i1 === i2) 
            i2 = Math.floor(Math.random() * allMeals.length);

        let meal1 = allMeals[i1];
        let meal2 = allMeals[i2];

        let b1 = gen("button");
        b1.textContent = meal1["name"].split("-").join(" ");
        b1.id = "b1";
        b1.addEventListener("click", displayRecipe);
        id("meal1").appendChild(b1);

        let b2 = gen("button");
        b2.textContent = meal2["name"].split("-").join(" ");
        b2.id = "b2";
        b2.addEventListener("click", displayRecipe);
        id("meal2").appendChild(b2);
    }

    /**
     * Fetch recipe data from the API
     */
    async function displayRecipe() {
        try {
            let url = rootPath + "/meals/" + this.textContent.replace(/\s+/g, '-');
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.text();
            displayRecipeHelper(data, this.id);
            console.log(data);
        } catch (err){
            console.log(err);
        }
    }

    /**
     * Show recipe information on webpage
     * @param data text data from fetch call 
     * @param i ID of the pressed button
     */
    function displayRecipeHelper(data, i) {
        if (i === "b1") {
            if (id("meal1").children.length > 1) {
                id("meal1").removeChild(id("meal1").lastChild);
            }
            let p1 = gen("p");
            p1.innerHTML = data;
            id("meal1").appendChild(p1);
        }
        else {
            if (id("meal2").children.length > 1) {
                id("meal2").removeChild(id("meal2").lastChild);
            }
            let p2 = gen("p");
            p2.innerHTML = data;
            id("meal2").appendChild(p2);
        }
    }

    init();
})();