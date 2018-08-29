var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var clc = require("cli-color");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "traffic12345",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  displayItems();
});
function displayItems() {
  console.log(chalk.magenta("\nWELCOME TO BAMAZON!" + "\nITEMS AVAILABLE FOR SALE:\n"));
       connection.query("SELECT * FROM products", function(err, res) {
  console.table(res);
  if (err) throw err;
     itemIdPrompt(res);
   });
 }

function itemIdPrompt(inventory) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would like to buy? [Quit with Q]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      userQuitOption(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);
      if (product) {
        quantityPrompt(product);
      }
      else {
        console.log("That item is not in the inventory. Please look again.");
        displayItems();
      }
    });
}

function quantityPrompt(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      userQuitOption(val.quantity);
      var quantity = parseInt(val.quantity);

      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        displayItems();
      }
      else {
        finalizePurchase(product, quantity);
      }
    });
}

function finalizePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    (err, res) => {
      console.log(chalk.cyan("\nYour purchase of " + quantity + " " + product.product_name + " is complete! THANK YOU!"));
      displayItems();
    }
  );
}

function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
}

function userQuitOption(choice) {
  if (choice.toLowerCase() === "q") {
    console.log(chalk.yellow("Goodbye!"));
    process.exit(0);
  }
}


// "SELECT item_id AS 'Item ID', product_name AS 'Product Name', department_name AS 'Department', price AS 'Price', stock_quantity AS 'Stock Quantity'
