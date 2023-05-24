# CS 132 Ice Cream API Documentation
**Author:** Sahana Saikumar
**Last Updated:** 06/09/22

The ice cream API provides functionality to retrieve and customize flavors for an ice cream store. Clients can access all flavors offered by the store and information about each flavor such as its name, image,
price, and description. In addition, clients can customize their order for their flavor of choice. There is also functionality to contact the company. All error responses are returned as plain text. All 500 errors are a server-side issue and have their own generic error message. All 400 errors are an invalid request by a client.

Summary of endpoints:
* GET /menu
* GET /menu/price=:price/dairyfree=:dairyFree/hasnuts=:hasNuts/lowfat=:lowFat
* GET /menu-specials
* GET /menu/:flavor
* POST /contact
* POST /addToCart

## *GET /menu*

**Request Type:** GET

**Returned Data Format**: JSON

**Description**
Returns a JSON collection of all flavors available at the ice cream store

**Supported Parameters**
None

**Example Request:** `/menu`

**Example Response:**
```json
{"flavors":[{"information":{"name":"Butter Pecan","price":4,"description":"Satisfy your cravings with this perfect combination of crunchy and smooth!","image":"img/butter-pecan-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"true","lowFatOption":"false"}},{"information":{"name":"Chocolate","price":4,"description":"Enjoy a classic with our chocolate ice cream!","image":"img/chocolate-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Cookie Dough","price":4,"description":"You won't be able to get enough of this cookie dough ice cream!","image":"img/cookie-dough-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Dracula","price":6,"description":"Count Dracula wishes this flavor existed during his time","image":"img/dracula-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Garlic Bread","price":6,"description":"Your favorite appetizer turned into an ice cream flavor!","image":"img/garlic-bread-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"J And Pb","price":5,"description":"Berry-flavored ice cream with peanut butter chunks!","image":"img/j-and-pb-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"true","lowFatOption":"false"}},{"information":{"name":"Lavender","price":6,"description":"Enjoy the fresh taste of nature with our lavender flavor ice cream!","image":"img/lavender-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Mango","price":5,"description":"Enjoy the fresh taste of mango with our mango flavor ice cream!","image":"img/mango-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Mint Chocolate Chip","price":4,"description":"Minty and delicious!","image":"img/mint-chocolate-chip-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Mocha Chocolate Chip","price":5,"description":"Satisfy your coffee cravings with this flavor!","image":"img/mocha-chocolate-chip-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Orange Sorbet","price":6,"description":"Enjoy the fresh taste of fruit with our orange sorbet!","image":"img/orange-sorbet-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Pb And J","price":5,"description":"A pb&j sandwich turned into an ice cream flavor!","image":"img/pb&j-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"true","lowFatOption":"false"}},{"information":{"name":"Popcorn","price":6,"description":"Popcorn turned into an ice cream flavor!","image":"img/popcorn-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Red Velvet","price":5,"description":"Satisfy your cravings with this red velvet flavor!","image":"img/red-velvet-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Rocky Road","price":4,"description":"Enjoy the crunch of this rocky road ice cream!","image":"img/rocky-road-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"true","lowFatOption":"true"}},{"information":{"name":"Strawberry","price":4,"description":"Enjoy a classic flavor with our strawberry ice cream!","image":"img/strawberry-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Toffee Fudge","price":5,"description":"A chewy and great-tasting flavor!","image":"img/toffee-fudge-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Vanilla","price":3,"description":"The most classic of the classics!","image":"img/vanilla-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}}]}
```

## *GET /menu/price=:price/dairyfree=:dairyFree/hasnuts=:hasNuts/lowfat=:lowFat*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of flavors that satisfy the specified parameters. Each flavor holds an array of data about the item including the name of the item, its starting price, description, image, and information about whether or not it is nut-free and offered in low-fat and/or dairy-free alternatives of the same flavor. Returns a 500 error if something goes wrong on the server

**Supported Parameters**
* :price (required)
  * Price cap of products; all images that have a price less than or equal to this value

* :dairyFree
  * All products that are dairy free if this value is true

* :hasNuts
  * All products that contain nuts if this value is true

**Example Request:** `/menu/price=:3/dairyfree=false/hasnuts=false/lowfat=false`

**Example Response:**
``` JSON
{"flavors":[{"information":{"name":"Vanilla","price":3,"description":"The most classic of the classics!","image":"img/vanilla-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}}]}
```

## *GET /menu-specials*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of special flavors and flavor information. Each flavor holds an array of data about the item including the name of the item, its starting price, description, image, and information about whether or not it is nut-free and offered in low-fat and/or dairy-free alternatives of the same flavor. Returns a 500 error if something goes wrong on the server

**Supported Parameters**
None

**Example Request:** `/menu-specials`

**Example Response:**
``` JSON
{"specials":[{"information":{"name":"Dracula","price":6,"description":"Count Dracula wishes this flavor existed during his time","image":"img/dracula-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Garlic Bread","price":6,"description":"Your favorite appetizer turned into an ice cream flavor!","image":"img/garlic-bread-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}},{"information":{"name":"Lavender","price":6,"description":"Enjoy the fresh taste of nature with our lavender flavor ice cream!","image":"img/lavender-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Orange Sorbet","price":6,"description":"Enjoy the fresh taste of fruit with our orange sorbet!","image":"img/orange-sorbet-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}},{"information":{"name":"Popcorn","price":6,"description":"Popcorn turned into an ice cream flavor!","image":"img/popcorn-cup.png","special":"true"},"nutrition":{"dairyFreeOption":"false","containsNuts":"false","lowFatOption":"false"}}]}
```

## *GET /menu/:flavor*
**Returned Data Format**: JSON

**Description:**
 Returns a JSON collection of information about the specified flavor name.Returns a 400 error if no flavor exists for the specified parameter. Returns a 500 error in case of a server error

**Supported Parameters**
* :flavor
  Name of the flavor

**Example Request:** `/menu/vanilla`

**Example Response:**
``` JSON
{"information":{"name":"Vanilla","price":3,"description":"The most classic of the classics!","image":"img/vanilla-cup.png","special":"false"},"nutrition":{"dairyFreeOption":"true","containsNuts":"false","lowFatOption":"true"}}
```

**Error Handling:**
* 400: Invalid request if given a flavor that does not exist on the store

**Example Request:** `/menu/berry-sorbet`

**Example Response:**
```Flavor berry-sorbet does not exist.```

## *POST /contact*
**Returned Data Format**: Plain Text

**Description:**
Sends information to web service of a client contacting the company. Information includes the client's name, email, phone number, and their message. Returns a response about whether the information was successfully sent. In case of an error, states that something went wrong during the attempt to send the message

**Supported Parameters**
* POST body parameters:
  * `name` (required) - name of customer
  * `phone` (optional) - phone nmbeer of customer
  * `email` (required) - email of customer
  * `description` (required) - message 

**Example Request:** `/contact`
* POST body parameters:
  * `name="Sahana"`
  * `phone="123-456-7890"`
  * `email="test@test.com"`
  * `description="Test Test Test Test Test Test Test"`

**Example Response:**
```Message Sent!```

**Error Handling:**
* 400: Invalid request if missing any parameter

**Example Request:** `/contact`
* POST body parameters:
  * `name="bob"`

**Example Response:**
```Required POST parameters for /contact: name, email, phone, description```

## *POST /addToCart*
**Returned Data Format**: Plain Text

**Description:**
Create a customization in the form of a JSON object and return success message with customization information if successful. Returns a 500 error in case of a server error

**Supported Parameters**
* POST body parameters:
  * `name` (required) - name of order
  * `price` (required) - price of order
  * `size` (required) - size of order
  * `sprinkles` (required) - whether or not order has sprinkles 
  * `fudgeDrizzle` (required) - whether or not order has fudge drizzle 
  * `caramelDrizzle` (required) - whether or not order has caramel drizzle 
  * `quantity` (required) - amount of order 
  * `cupOrCone` (required) - whether the order is a cup or a cone 
  * `img` (required) - image path of order 


**Example Request:** `/addToCart`
* POST body parameters:
  * `name="vanilla"`
  * `price=3`
  * `size="S"`
  * `sprinkles="true"` (required) - whether or not order has sprinkles 
  * `fudgeDrizzle="false"` (required) - whether or not order has fudge drizzle 
  * `caramelDrizzle="false"` (required) - whether or not order has caramel drizzle 
  * `quantity="false"` (required) - amount of order 
  * `cupOrCone="cup"` (required) - whether the order is a cup or a cone 
  * `img="img/vanilla-cup.png"` (required) - image path of order

**Example Response:**
```Customization for vanilla ice cream cup: Size S, Toppings: Sprinkles ```

**Error Handling:**
* 400: Invalid request if missing any parameter

**Example Request:** `/addToCart`
* POST body parameters
  * `name="vanilla"`
  * `price=3`
  * `size="S"`
  * `sprinkles="true"`

**Example Response:**
```Missing POST parameter for adding to cart```
