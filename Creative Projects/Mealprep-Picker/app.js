"use strict";
const express = require("express");
const app = express();
const fs = require("fs").promises;

const cors = require("cors");

app.use(express.static("public"));
app.use(cors());

const INVALID_REQ_ERR_CODE = 400;
const INVALID_REQ_ERR = "Meal does not exist. Please enter a valid meal."
const SERVER_ERR_CODE = 500;
const SERVER_ERROR = "Something went wrong on the server, please try again later.";

/**
 * Returns a JSON collection of all meals and meal information
 * Returns a 500 error if something goes wrong on the server
 */
app.get("/meals", async (req, res) => {
    try {
        const result = await getMealData();
        res.json(result);
    } catch (err) {
        res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
});

/**
 * Returns text of the recipe of the meal parameter
 * Returns a 400 error if something goes wrong on the server
 */
app.get("/meals/:meal", async (req, res) => {
    try {
        res.type("text");
        let result = await getRecipe(req.params.meal);
        res.send(result);
    } catch (err) {
        res.status(INVALID_REQ_ERR_CODE).send(INVALID_REQ_ERR);
    }
});

/**
 * Access and return the recipe of a meal
 * @param meal 
 * @returns recipe file text
 */
async function getRecipe(meal) {
    let path = `meals/${meal}/recipe.txt`;
    let recipe = await fs.readFile(path, "utf8");
    return recipe;
}

/**
 * Get the data of the meals in the form of a JSON object
 * @returns JSON object
 */
async function getMealData() {
    const meals = await fs.readdir("meals");
    let data = [];

    for (let i = 0; i < meals.length; i++) {
        let meal = "meals/" + meals[i] + "/";

        let img = meal + "img.png";
        let recipeString = await fs.readFile(meal + "recipe.txt", "utf8");
        let r = recipeString.split("\r\n");
        let l = await fs.readFile(meal + "link.txt", "utf8");

        let obj = {
            name : meals[i],
            image : img,
            recipe : r,
            link : l
        };

        data.push(obj);
    }
    return {"meals" : data};
}

// Start the app on an open port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("LISTENING ON PORT " + PORT + "...");
});
