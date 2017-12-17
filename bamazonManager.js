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
    inquirer
      .prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      })
      .then(function(answer) {
        switch (answer.menu) {
          case "View Products for Sale":
            viewProducts();
            break;
  
          case "View Low Inventory":
            viewLowInventory();
            break;
  
          case "Add to Inventory":
            addInventory();
            break;
  
          case "Add New Product":
            addNewProduct();
            break;
        }
    });
}

function viewProducts() {
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
              if (res[i].stock_quantity >= 0) {
                console.log(columns);
              };
        };
        setTimeout(start, 2000);
    });
}

function viewLowInventory() {
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
              if (res[i].stock_quantity < 5) {
                console.log(columns);
              };
        };
        setTimeout(start, 2000);
    });
};

function addInventory() {
    inquirer.prompt([
      {
          name: "item",
          type: "input",
          message: "\nWhat item would you like to update? (Choose ID)",
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
              howMany(res[0].stock_quantity, answer.item, res[0].product_name);
              return;
          });
      });
};

function howMany(quantity, itemId, productName) {
  inquirer.prompt([
    {
        name: "quantity",
        type: "input",
        message: "\nHow much would you like to add?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }
  ]).then(function(answer){
      var query1 = "UPDATE products SET ? WHERE ?";
      connection.query(query1,
          [
              {
                  stock_quantity: quantity + parseInt(answer.quantity)
              },
              {
                  item_id: itemId
              }
          ], function(err, res) {
              if (err) throw err;
              console.log("\nThe quantity of " + productName + " has been updated to " + (quantity + parseInt(answer.quantity)).toString() + " units.\n");
              setTimeout(start, 2000);
      });
  });
};

function addNewProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "\nWhat is the name of the product?",
            validate: function(value) {
                if (value !== "") {
                    return true;
                }
                return false;
            }
        },
        {
            name: "department",
            type: "input",
            message: "\nWhat department?",
            validate: function(value) {
                if (value !== "") {
                    return true;
                }
                return false;
            }
        },
        {
            name: "price",
            type: "input",
            message: "\nWhat's the price?",
            validate: function(value) {
                if (isNaN(value) === false) {                    
                    return true;
                    }
                    return false;
                }
        },
        {
            name: "quantity",
            type: "input",
            message: "\nWhat's the quantity?",
            validate: function(value) {
                if (isNaN(value) === false) {                    
                    return true;
                    }
                    return false;
                }
        }
    ]).then(function(answer){
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answer.name + "', '" + answer.department + "', " + answer.price.toString() + ", " + answer.quantity.toString() + ");";
        connection.query(query, [], function(err, res) {
                if (err) throw err;
                console.log("\nYour product " + answer.name + " has been added, to the " + answer.department + " department, at the price of $" + answer.price.toString() + " , with " + answer.quantity.toString() + " units.\n");
                setTimeout(start, 2000);
            });
    });
};