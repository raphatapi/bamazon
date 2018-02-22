# Bamazon Node App

## Customer App :package:

![Bamazon Gif](/gif/bamazon.gif)

### Run these:
`git clone https://github.com/raphatapi/bamazon.git`

#### For Customers:
`node bamazonCustomer.js`

#### This application allows customers to purchase the listed products selecting them by their id.

* If you select a product that's not listed, the app will ask you to choose a valid one.

* If you select a product from the list, the app will ask you how many would you like to buy:

    * If the purchased amount is in stock, the app will provide you with you total due.
    * If the purchased amount equals the total in stock, the app will tell you that's all we have and give you the total due.
    * If the purchased amount exceeds the total in stock, the app will ask you to enter a valid amount.


## Manager App :chart_with_upwards_trend:

![Manager Gif](/gif/manager.gif)

#### For Managers:
`node bamazonManager.js`

#### This application allows users to manage the store.

* If you select `View Products for Sale`, the app will show all items available.

* If you select `View Low Inventory`, the app will show only items with quantity below 5 units.

* If you select `Add to Inventory`, the app will allow you to update an item quantity by choosing its id and entering a quantity.

* If you select `Add New Product`, the app will prompt you to add a new product by name, department, price and quantity.


## Have Fun!
