/**
 * Name: Sahana Saikumar
 * Date: 6/6/2022
 * Description: Javascript file for the functionality of the cart page of the final project
 */

(function() {
    "use strict";

    const noItem = 0;

    /**
     * Initialize the cart page
     */
    function init() {
        getCart();
    }

    /**
     * Helper function to get the cart when the page loads
     */
    function getCart() {

        for(let i = 0; i < Object.keys(window.sessionStorage).length; i++) {
            let key = Object.keys(window.sessionStorage)[i];
            if (key != "cartItemIDs") {
                populateCart(key);
            }
        }

        updateSubtotal();
    }
    
    /**
     * Generate quantity buttons for specified cart item
     * @param {Object} item item flavor for which quantity buttons are created for
     * @param {HTML Element} p text that shows current quantity of this product
     * @returns {HTML Element} quantity button part of cart item
     */
    function genQuantityBtns(item, p) {
        let quantityBtns = gen("div");
        quantityBtns.classList.add("quantity-btns");
        let dec = gen("button");
        let inc = gen("button");
        inc.textContent = "+";
        dec.textContent = "-";

        inc.addEventListener("click", () => {
            item.quantity += 1;
            window.sessionStorage.setItem(item.id, JSON.stringify(item));
            p.textContent = "";
            p.textContent = "Quantity: " + item.quantity;
            updateSubtotal();
        });

        dec.addEventListener("click", () => {
            item.quantity -= 1;
            window.sessionStorage.setItem(item.id, JSON.stringify(item));
            p.textContent = "";
            p.textContent = "Quantity: " + item.quantity;
            if (item.quantity <= noItem) {
                removeItem(item);
            }
            updateSubtotal();
        });

        quantityBtns.appendChild(dec);
        quantityBtns.appendChild(inc);
        return quantityBtns
    }

    /**
     * Generate remove button for specified cart item
     * @param {Object} item item flavor for which remove button is created for
     * @returns {HTML Element} remove button part for specified cart item
     */
    function genRemoveBtn(item) {
        let remove = gen("div");
        remove.classList.add("remove");
        let removeBtn = gen("button");
        removeBtn.id = "remove-btn";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
            removeItem(item);
            updateSubtotal();
        })
        remove.appendChild(removeBtn);
        return remove;
    }

    /**
     * Generate information for specified cart item
     * @param {Object} item item flavor for which information text is created for
     * @returns {HTML Element} information text for specified cart item
     */
    function genInfo(item) {
        let info = gen("div");
        info.classList.add("info");
        let pName = gen("p");
        let pPrice = gen("p");
        let pSize = gen("p");
        let pDetails = gen("p");
        pName.textContent = "Name: " + item.name;
        pPrice.textContent = "Price: " + item.price;
        pSize.textContent = "Size: " + item.size;

        let details = [item.cupOrCone[0].toUpperCase() + item.cupOrCone.substr(1)];
        if (item.sprinkles) {
            details.push("Sprinkles");
        }
        if (item.fudgeDrizzle) {
            details.push("Fudge Drizzle");
        }
        if (item.caramelDrizzle) {
            details.push("Caramel Drizzle")
        }

        pDetails.textContent = "Details: " + details.join(", ");
        info.appendChild(pName);
        info.appendChild(pPrice);
        info.appendChild(pSize);
        info.appendChild(pDetails);

        return info;
    }

    /**
     * Helper function to show all items that are currently in the cart
     * @param {int} key item id of a specified product item
     */
    function populateCart(key) {
        let item = JSON.parse(window.sessionStorage.getItem(key));

        let cartItem = gen("div");
        cartItem.id = item.id.toString();
        cartItem.classList.add("cart-item");
        let div = gen("div");
        let img = gen("img");
        img.src = item.img;
        img.alt = item.name;
        div.appendChild(img);
        let quantity = gen("div");
        quantity.classList.add("quantity");
        let p = gen("p");
        p.textContent = "Quantity: " + item.quantity;
        quantity.appendChild(p);

        let quantityBtns = genQuantityBtns(item, p);
        quantity.appendChild(quantityBtns);

        let remove = genRemoveBtn(item);
        quantity.appendChild(remove);

        div.appendChild(quantity);

        let info = genInfo(item);
        cartItem.appendChild(div);
        cartItem.appendChild(info);
        id("cart").appendChild(cartItem);
    }

    /**
     * Remove the specified object from the cart
     * @param {Object} item Dictionary object to be removed from the page
     */
    function removeItem(item) {

        id(item.id).remove();
        window.sessionStorage.removeItem(item.id);
        let cartItemIDs = JSON.parse(window.sessionStorage.getItem("cartItemIDs"));
        cartItemIDs.splice(cartItemIDs.indexOf(item.id), 1);
        window.sessionStorage.setItem("cartItemIDs", JSON.stringify(cartItemIDs));
        window.sessionStorage.removeItem(item.id);
    }

    /**
     * Update the subtotal value when updates are made to flavors
     */
    function updateSubtotal() {
        let subtotal = 0;

        for(let i = 0; i < Object.keys(window.sessionStorage).length; i++) {
            let key = Object.keys(window.sessionStorage)[i];
            if (key != "cartItemIDs") {
                let item = JSON.parse(window.sessionStorage.getItem(key));
                subtotal += item.quantity * parseFloat(item.price.substr(1));
            }
        }

        id("subtotal-text").textContent = "$" + subtotal;
    }

    init();
})();