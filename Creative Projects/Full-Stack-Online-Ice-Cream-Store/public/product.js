/**
 * Name: Sahana Saikumar
 * Date: 6/6/2022
 * Description: Javascript file for the functionality of the product pages of the final project
 */


(function() {
    "use strict";
    
    const ROOTPATH = "http://localhost:8000";
    const DEBUG = false;
    const IMAGE_PATH = "img/";
    const MAX_ID = 1000;

    let cupOrCone = "cup";
    let size = "S";
    let basePrice;
    let toppingPrice = 0.25;
    let sprinkles = false;
    let fudgeDrizzle = false;
    let caramelDrizzle = false;

    /**
     * Initialize the product page
     */
    async function init() {
        await fetchItem();
        initRadioButtons();
        initToppings();

        await id("cart-btn").addEventListener("click", addToCart);
    }

    /**
     * Helper function to initialize functionality of cone vs cup radio buttons
     */
    function initRadioButtons() {
        id("cone").addEventListener("click", () => {
            cupOrCone = "cone";
        });

        id("cup").addEventListener("click", () => {
            cupOrCone = "cup";
        });
    }

    /**
     * Helper function to initialize functionality of topping checkboxes
     */
    function initToppings() {
        id("sprinkles").addEventListener("change", () => {
            sprinkles = id("sprinkles").checked;
            id("price").textContent = "$" + getUpdatedPrice();
        });

        id("fudge-drizzle").addEventListener("change", () => {
            fudgeDrizzle = id("fudge-drizzle").checked;
            id("price").textContent = "$" + getUpdatedPrice();
        });

        id("caramel-drizzle").addEventListener("change", () => {
            caramelDrizzle = id("caramel-drizzle").checked;
            id("price").textContent = "$" + getUpdatedPrice();
        });
    }

    /**
     * Calculate the price of the ice cream
     * @returns price given current status of toppings and size
     */
    function getUpdatedPrice() {
        let price = 0;
        if (size === "S") {
            price = basePrice;
        }
        else if (size === "M") {
            price = basePrice + 1;
        }
        else if (size === "L") {
            price = basePrice + 2;
        }

        price += toppingPrice * 
            (Number(sprinkles) + Number(fudgeDrizzle) + Number(caramelDrizzle));
        return price;
    }

    /**
     * Create the customized object to be added to the cart
     * @returns {Object} Object to be added to cart
     */
    async function addToCart() {
        let imgSrc = IMAGE_PATH + id("product-img").alt.toLowerCase().split(" ").join("-") + "-cup.png";
        let data = new FormData();
        data.append("name", id("product-img").alt);
        data.append("price", id("price").textContent);
        data.append("size", size);
        data.append("sprinkles", sprinkles);
        data.append("fudgeDrizzle", fudgeDrizzle);
        data.append("caramelDrizzle", caramelDrizzle);
        data.append("quantity", 1);
        data.append("cupOrCone", cupOrCone);
        data.append("img", imgSrc);

        try {
            let resp = await fetch(ROOTPATH + "/addToCart", { method: "POST", body : data });
            checkStatus(resp);
            resp = await resp.text();
            id("cart-btn").classList.toggle("hidden");
            id("s-btn").classList.toggle("hidden");
            id("m-btn").classList.toggle("hidden");
            id("l-btn").classList.toggle("hidden");

            let p = gen("p")
            p.textContent = resp;
            addToCartHelper(id("product-img").alt, id("price").textContent, size, sprinkles, 
                fudgeDrizzle, caramelDrizzle, cupOrCone, imgSrc);
            id("cart-container").appendChild(p);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Helper function to add an object to the cart
     * @param {string} name name of object to be added to cart
     * @param {float} price price of object to be added to cart 
     * @param {string} size size of object to be added to cart
     * @param {boolean} sprinkles whether or not object has sprinkles
     * @param {boolean} fudgeDrizzle whether or not object has fudge drizzle
     * @param {boolean} caramelDrizzle whether or not object has caramel drizzle
     * @param {string} cupOrCone whether object is a cup or cone
     * @param {string} image path to image of object to be added to cart
     */
    function addToCartHelper(name, price, size, sprinkles, fudgeDrizzle,
        caramelDrizzle, cupOrCone, image) {
            
        let cartItemIDs = JSON.parse(window.sessionStorage.getItem("cartItemIDs"));
        let itemID = Math.floor(Math.random() * MAX_ID);

        while (cartItemIDs.indexOf(id) != -1) {
            itemID = Math.floor(Math.random() * MAX_ID);
        }

        cartItemIDs.push(itemID);
        window.sessionStorage.setItem("cartItemIDs", JSON.stringify(cartItemIDs));
        
        let prod = {
            "id" : itemID,
            "name" : name,
            "price" : price,
            "size" : size,
            "sprinkles" : sprinkles,
            "fudgeDrizzle" : fudgeDrizzle,
            "caramelDrizzle" : caramelDrizzle,
            "quantity" : 1,
            "cupOrCone" : cupOrCone,
            "img" : image
        };
        window.sessionStorage.setItem(itemID, JSON.stringify(prod));
    }

    /**
     * Helper function to return the parameters of the URL
     * @returns {string} flavor of ice cream
     */
    function getParameter() {
        let params = new URLSearchParams(window.location.search);
        return params.get("flavor");
    }

    /**
     * Fetch the specified item from the API
     */
    async function fetchItem() {
        try {
            let itemName = getParameter("flavor");
            let resp = await fetch(ROOTPATH + "/menu/" + itemName);
            resp = checkStatus(resp);
            const data = await resp.json();
            populateProduct(data);
        }
        catch (err) {
            handleError(err);
        }
    }

    /**
     * Populate the product view
     * @param {Object} data JSON object of the specified flavor
     */
    function populateProduct(data) {
        let h1 = gen("h1");
        h1.textContent = data.information.name;
        id("product").appendChild(h1);
        
        let p = gen("p");
        p.textContent = data.information.description;
        id("product").appendChild(p);

        if (data.information.special === "true") {
            let pSpecial = gen("p");
            pSpecial.textContent = "Limited Time Only!"
            id("product").appendChild(pSpecial);
        }

        let img = gen("img");
        img.src = data.information.image;
        img.alt = data.information.name;
        img.id = "product-img";
        id("product").appendChild(img);

        let p1 = gen("p");
        basePrice = data.information.price;
        p1.textContent = "$" + basePrice;
        p1.id = "price";
        id("product").appendChild(p1);

        populateSizeBtns();
        populateCartBtn();
    }

    /**
     * Helper function to populate the small, medium, and large buttons for ice cream size
     */
    function populateSizeBtns() {
        let div1 = gen("div");
        div1.id = "cart-container";
        let sbtn = gen("button");
        let mbtn = gen("button");
        let lbtn = gen("button");
        sbtn.id = "s-btn";
        mbtn.id = "m-btn";
        lbtn.id = "l-btn";
        sbtn.textContent = "S";
        sbtn.disabled = true;
        mbtn.textContent = "M";
        lbtn.textContent = "L";
        sizeBtns(sbtn, mbtn, lbtn);
        div1.appendChild(sbtn);
        div1.appendChild(mbtn);
        div1.appendChild(lbtn);

        id("product").appendChild(div1);
    }

    /**
     * Helper function to initialize functionality of size buttons
     * @param {Object} s size small button
     * @param {Object} m size medium button
     * @param {Object} l size large button
     */
    function sizeBtns(s, m, l) {
        s.addEventListener("click", () => {
            size = "S";
            s.disabled = true;
            m.disabled = false;
            l.disabled = false;
            id("price").textContent = "$" + getUpdatedPrice();
        });

        m.addEventListener("click", () => {
            size = "M";
            s.disabled = false;
            m.disabled = true;
            l.disabled = false;
            id("price").textContent = "$" + getUpdatedPrice();
        });

        l.addEventListener("click", () => {
            size = "L";
            s.disabled = false;
            m.disabled = false;
            l.disabled = true;
            id("price").textContent = "$" + getUpdatedPrice();
        })
    }

    /**
     * Helper function to populate the cart button
     */
    function populateCartBtn() {
        let div2 = gen("div");
        let cartBtn = gen("button");
        cartBtn.id = "cart-btn";
        cartBtn.textContent = "Add to cart";
        div2.appendChild(cartBtn);
        id("product").appendChild(div2);
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
            id("product").textContent = 
            "We're having issues with our website. Please refresh or check in later!";
        }
    }

    init();
})();