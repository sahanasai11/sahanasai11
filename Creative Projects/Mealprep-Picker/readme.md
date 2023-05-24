**Show Meals**
----
  Returns JSON data of each meal and its respective information

* **URL**

  /meals

* **Method:**
  
  `GET`
  
*  **URL Params**


   **Required:**
 
   `None`

   **Optional:**
 
* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `{name: 'beyond-meat-ground-beef-burrito', image: 'meals/beyond-meat-ground-beef-burrito/img.png',   recipe:   Array(10), link: 'https://www.youtube.com/watch?v=88WR2pkSwko'}
    1: {name: 'chickpea-chowder', image: 'meals/chickpea-chowder/img.png', recipe: Array(7), link: 'https://www.youtube.com/watch?v=5dooOnuFyd8&t=446s'}
    2: {name: 'pumpkin-black-bean-quesadilla', image: 'meals/pumpkin-black-bean-quesadilla/img.png', recipe: Array(7), link: 'https://www.youtube.com/watch?v=lVdRC82qaaY'}
    3: {name: 'sweet-potato-chili', image: 'meals/sweet-potato-chili/img.png', recipe: Array(13), link: 'https://www.greenschemetv.net/beyond-meat-chili/'}`
 
* **Error Response:**

  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{Error: Something went wrong on the server, please try again later."}`

* **Sample Call:**

app.get("/meals", async (req, res) => {
    try {
        const result = await getMealData();
        res.json(result);
    } catch (err) {
        res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
});


**Show Recipe**
----
  Returns JSON data of a meal's recipe

* **URL**

  /meals/:meal

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
 
   `meal=[string]`

   **Optional:**
 
    None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    Text content of recipe detailed in param
 
* **Error Response:**

  * **Code:** 400 INVALID REQUEST ERROR <br />
    **Content:** `{ error : Meal does not exist. Please enter a valid meal."}`

* **Sample Call:**

app.get("/meals/:meal", async (req, res) => {
    try {
        res.type("text");
        let result = await getRecipe(req.params.meal);
        res.send(result);
    } catch (err) {
        res.status(INVALID_REQ_ERR_CODE).send(INVALID_REQ_ERR);
    }
});