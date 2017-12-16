var inquirer = require("inquirer");
var mysql = require("mysql");
var columnify = require('columnify');

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function(err){
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        console.log("*****************");
        console.log("*ITEMS FOR SALE!*");
        console.log("*****************");
        for (var i = 0; i < res.length; i++) {
            var columns = columnify([{
                ID: res[i].item_id,
                NAME: res[i].product_name,
                PRICE: "$" + res[i].price,
                QUANTITY: res[i].stock_quantity
              }],{
                showHeaders: i === 0,
                columnSplitter: ' | ',
                minWidth: 30,
                config: {
                  description: {maxWidth: 40}
                }
              })
            console.log(columns);
        };
        whatItem();
    });
};

function whatItem() {
    inquirer.prompt([
    {
        name: "item",
        type: "input",
        message: "What item would you like to purchase? (Choose ID)",
        validate: function(value) {
            if (isNaN(value) === false) {                    
                return true;
                }
                return false;
            }
    }
    ]).then(function(answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answer.item }, function(err, res) {
            if (err) throw err;
            if (res.length === 0) {
                console.log("\nUnfortunately this item isn't available. Please choose an item listed above.\n");
                whatItem();
                return;
            } 
            howMany(res[0].stock_quantity, answer.item, res[0].price);
            return;
        });
    });
};

function howMany(quantity, itemId, price) {
    inquirer.prompt([
        {
            name: "quantity",
            type: "input",
            message: "How many of this would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        if (answer.quantity > quantity) {
            console.log("\nI can only give you " + quantity.toString() + ". Please enter a valid quantity.\n");
            howMany(quantity);
            return;
        } else if (answer.quantity == quantity) {
            console.log("\nI can give you " + answer.quantity.toString() + ". This all I have!\n");
        } else {
            console.log("\nItems placed in your cart.\n");
        }
        var query1 = "UPDATE products SET ? WHERE ?";
        connection.query(query1,
            [
                {
                    stock_quantity: quantity - answer.quantity
                },
                {
                    item_id: itemId
                }
            ], function(err, res) {
                if (err) throw err;
                console.log("\nYour total is $" + (answer.quantity * price).toString() + "\n");
                setTimeout(start, 2000);
        });
    });
};