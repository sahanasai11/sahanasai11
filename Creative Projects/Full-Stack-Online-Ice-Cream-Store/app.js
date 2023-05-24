"use strict";

const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");
const app = express();
const multer = require("multer");

const CLIENT_ERR_CODE = 400;
const SERVER_ERR_CODE = 500;
const SERVER_ERR = "Something went wrong in the server. Please refresh or try again later.";

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(multer().none());

/** 
 * Returns a JSON collection of all flavors and flavor information.
 * Each flavor holds an array of data about the item including the
 * name of the item, its starting price, description, image, and information
 * about whether or not it is nut-free and offered in low-fat and/or dairy-free
 * alternatives of the same flavor.
 * Returns a 500 error if something goes wrong on the server
 */
app.get("/menu", async (req, res, next) => {
    try {
        let result = await getMenuData();
        res.json(result);
    }
    catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERR;
        next(err);
    }
})

/** 
 * Returns a JSON collection of flavors that satisfy the specified parameters
 * Each flavor holds an array of data about the item including the
 * name of the item, its starting price, description, image, and information
 * about whether or not it is nut-free and offered in low-fat and/or dairy-free
 * alternatives of the same flavor.
 * Returns a 500 error if something goes wrong on the server
 */
app.get("/menu/price=:price/dairyfree=:dairyFree/hasnuts=:hasNuts/lowfat=:lowFat", async (req, res, next) => {
    try {
        let result = 
            await getFilteredMenuData(req.params.dairyFree, req.params.hasNuts, 
                req.params.lowFat, req.params.price);
        res.json(result);
    }
    catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERR;
        next(err);
    }
})

/** 
 * Returns a JSON collection of special flavors and flavor information.
 * Each flavor holds an array of data about the item including the
 * name of the item, its starting price, description, image, and information
 * about whether or not it is nut-free and offered in low-fat and/or dairy-free
 * alternatives of the same flavor.
 * Returns a 500 error if something goes wrong on the server
 */
app.get("/menu-specials", async (req, res, next) => {
    try {
        let result = await getSpecialsData();
        res.json(result);
    }
    catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERR;
        next(err);
    }
})

/**
 * Returns a JSON collection of information about the specified flavor name.
 * Example: {"information":{"name", "price", "description", "image", "special"}, 
 *           "nutrition":{dairyFreeOption, containsNuts, lowFatOption}}
 * Returns a 400 error if no flavor exists for the specified parameter
 * Returns a 500 error in case of a server error
 */
app.get("/menu/:flavor", async (req, res, next) => {
    try {
        let result = await getItemData(req.params.flavor);
        res.json(result);
    }
    catch (err) {
        if (err.code === "ENOENT") {
            res.status(CLIENT_ERR_CODE);
            err.message = "Flavor " + req.params.flavor + " does not exist.";
        }
        else {
            res.status(SERVER_ERR_CODE);
            err.message = SERVER_ERR;
        }

        next(err);
    }
});

/**
 * Create a message in the form of a JSON object
 * Returns a 500 error in case of a server error
 * Note: referred to Cafe API /contact endpoint to aid in writing this method
 */
app.post("/contact", async (req, res, next) => {
    let obj = null;
    if (req.body.name && req.body.email && req.body.description) {
        obj = {
            "name" : req.body.name,
            "phone" : null,
            "email" : req.body.email,
            "description" : req.body.description
        };
    }
    if (req.body.phone) {
        obj.phone = req.body.phone;
    }
    if (!obj) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Required POST parameters for /contact: name, email, phone, description"));
    }

    try {
        let contactMsgs = await fs.readFile("contactMsgs.json", "utf8");
        contactMsgs = JSON.parse(contactMsgs);
        contactMsgs.push(obj);
        await fs.writeFile("contactMsgs.json", JSON.stringify(contactMsgs, null, 2), "utf8");
        res.type("text");
        res.send("Message sent!");
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERR;
        next(err);
    }
});

/**
 * Create a customization in the form of a JSON object and return success message with
 * customization information if successful.
 * Returns a 500 error in case of a server error
 */
app.post("/addToCart", async (req, res, next) => {
    let result = addToCartHelper(req);
    let contents = null;
    try {
        contents = await fs.readFile("customizations.json", "utf8");
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERR;
        next(err);
    }
    contents = JSON.parse(contents);
    contents.push(result);
    try {
        await fs.writeFile("customizations.json", JSON.stringify(contents, null, 2), "utf8");
        let toppings = [];
        if (req.body.sprinkles) 
            toppings.push("Sprinkles");
        if (req.body.fudgeDrizzle)
            toppings.push("Fudge drizzle");
        if (req.body.caramelDrizzle)
            toppings.push("Caramel drizzle");
        toppings = toppings.join(", ")
        res.send(`Successfully added to cart!
            Customization for ${req.body.name.toLowerCase()} ice cream ${req.body.cupOrCone}: 
            Size ${req.body.size}, Toppings: ${toppings}`);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERR;
        next(err);
    }
});

/**
 * Generates menu data from flavors/ subdirectories in format:
 *  { flavors: [{"information":{"name", "price", "description", "image", "special"}, 
 *               "nutrition":{dairyFreeOption, containsNuts, lowFatOption}},
 *              {"information":{"name", "price", "description", "image", "special"}, 
 *               "nutrition":{dairyFreeOption, containsNuts, lowFatOption}}, ...
 *  ]}
 * 
 * Relies on directory structure in the form:
 * flavors/
 *  <name>/
 *    <itemFiles ...>
 * 
 * @returns {Object} menu data in JSON format
 */
async function getMenuData() {
    const flavors = await fs.readdir("flavors");
    let data = [];

    for (let i = 0; i < flavors.length; i++) {
        let flavor = flavors[i];
        let obj = await getItemData(flavor);
        data.push(obj);
    }

    return {"flavors" : data};
}

/**
 * Generates flavor item data in format:
 * {"information":{"name", "price", "description", "image", "special"}, 
 *  "nutrition":{dairyFreeOption, containsNuts, lowFatOption}}
 * @param {string} flavor flavor of specified ice cream
 * @returns {Object} item data in JSON format
 */
async function getItemData(flavor) {
    let infoPath = "flavors/" + flavor + "/info.txt";
    let nutritionPath = "flavors/" + flavor + "/nutrition.txt";
    let info = (await fs.readFile(infoPath, "utf8")).split("\r\n");
    let nutr = (await fs.readFile(nutritionPath, "utf8")).split("\r\n");
    let flavorName = flavor.split("-");

    for (let j = 0; j < flavorName.length; j++) {
        flavorName[j] = flavorName[j][0].toUpperCase() + flavorName[j].substring(1);
    }

    let information = {
        name : flavorName.join(" "),
        price : parseFloat(info[0]),
        description : info[1],
        image : "img/" + info[2],
        special : info[3]
    };

    let nutrition = {
        dairyFreeOption : nutr[0],
        containsNuts : nutr[1],
        lowFatOption: nutr[2]
    }

    let obj = {information, nutrition};
    return obj;
}

/**
 * Generates menu data from special flavors/ subdirectories in format:
 *  { flavors: [{"information":{"name", "price", "description", "image", "true"}, 
 *               "nutrition":{dairyFreeOption, containsNuts, lowFatOption}},
 *              {"information":{"name", "price", "description", "image", "true"}, 
 *               "nutrition":{dairyFreeOption, containsNuts, lowFatOption}}, ...
 *  ]}
 * 
 * Relies on directory structure in the form:
 * flavors/
 *  <name>/
 *    <itemFiles ...>
 * 
 * @returns {Object} special flavors data in JSON format
 */
async function getSpecialsData() {
    const flavors = await fs.readdir("flavors");
    let data = [];

    for (let i = 0; i < flavors.length; i++) {
        let flavor = flavors[i];
        let obj = await getItemData(flavor);
        if (obj.information.special === "true") {
            data.push(obj);
        }
    }

    return {"specials" : data};
}

/**
 * Generates data from flavors/ subdirectories in format:
 *  { flavors: [{"information":{"name", "price", "description", "image", "special"}, 
 *               "nutrition":{dairyFreeOption, containsNuts, lowFatOption}},
 *              {"information":{"name", "price", "description", "image", "special"}, 
 *               "nutrition":{dairyFreeOption, containsNuts, lowFatOption}}, ...
 *  ]}
 * that satisfy the dairyFree, hasNuts, and lowFat parameters
 * 
 * Relies on directory structure in the form:
 * flavors/
 *  <name>/
 *    <itemFiles ...>
 * 
 * @param {string} dairyFree whether or not flavor has non-dairy option
 * @param {string} hasNuts whether or not flavor contains nuts
 * @param {string} lowFat whether or not flavor has lowfat option
 * @param {int} price price of item
 * @returns {Object} menu data in JSON format
 */
async function getFilteredMenuData(dairyFree, hasNuts, lowFat, p) {
    if ((dairyFree != "true" && dairyFree != "false") || (hasNuts != "true" && hasNuts != "false")
    || (lowFat != "true" && lowFat != "false")) {
        return {flavors : []}
    }

    const flavors = await fs.readdir("flavors");
    let data = [];

    for (let i = 0; i < flavors.length; i++) {
        let obj = await getItemData(flavors[i]);

        let push = false;

        if (filterHelper(dairyFree, hasNuts, lowFat, p, push, obj)) {
            data.push(obj);
        }
    }

    return {"flavors" : data};
}

/**
 * Helper function to filter data
 * @param {string} d whether or not flavor has dairy-free option
 * @param {sting} n whether or not flavor has nuts
 * @param {string} l whether or not flavor has low-fat option
 * @param {int} p price of flavor
 * @param {boolean} push whether or not object should be pushed
 * @param {JSON} obj ice cream flavor object
 * @returns boolean whether or not object should be pushed
 */
function filterHelper(d, n, l, p, push, obj) {
    if (d === "false") {
        push = true;
    } else {
        push = (obj.nutrition.dairyFreeOption === "true");
    }

    if (push) {
        if (n === "true") {
            push = (obj.nutrition.containsNuts === "false");
        }
    }

    if (push) {
        if (l === "true") {
            push = (obj.nutrition.lowFatOption === "true");
        }
    }

    if (obj.information.price > p) {
        push = false;
    }

    return push
}

/**
 * Helper function to add an object to the cart
 * @param {Object} req request object of a post method 
 * @returns {Object} JSON object of the object in req
 */
 function addToCartHelper(req) {
    let name = req.body.name;
    let price = req.body.price;
    let size = req.body.size;
    let sprinkles = req.body.sprinkles;
    let fudgeDrizzle = req.body.fudgeDrizzle;
    let caramelDrizzle = req.body.caramelDrizzle;
    let quantity = req.body.quantity;
    let cupOrCone = req.body.cupOrCone;
    let img = req.body.img;

    if(!(name && price && size && sprinkles && fudgeDrizzle && caramelDrizzle && quantity 
        && cupOrCone && img)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Missing POST parameter for adding to cart"));
    }

    return {
        "name" : name,
        "price" : price,
        "size" : size,
        "sprinkles" : sprinkles,
        "fudgeDrizzle" : fudgeDrizzle,
        "caramelDrizzle" : caramelDrizzle,
        "quantity" : 1,
        "cupOrCone" : cupOrCone,
        "img" : img
    };
}

/**
 * Error-handling middleware
 */
function errorHandler(err, req, res, next) {
    res.type("text");
    res.send(err.message);
}

// adding error handling to end of middleware stack
app.use(errorHandler);

// Start the app on an open port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("LISTENING ON PORT " + PORT + "...");
});