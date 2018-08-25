const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clc = require("cli-color");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "traffic12345",
  database: "bamazon_DB"
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  displayItems();
});

let displayItems = () => {
  console.log(chalk.magenta("\nWELCOME TO BAMAZON!\n"));
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
        message: "\nWhat is the ID of the item you would like to buy? [Quit with Q]\n",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      userQuitOption(val.choice);
      let choiceId = parseInt(val.choice);
      let product = checkInventory(choiceId, inventory);
      if (product) {
        quantityPrompt(product);
      }
      else {
        console.log("That item is not in the inventory. Please look again.");
        displayItems();
      }
    });
}
let quantityPrompt = (product) => {
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
        console.log(clc.redBright("Insufficient quantity!"));
        displayItems();
      }
      else {
        finalizePurchase(product, quantity);
      }
    });
}

let finalizePurchase = (product, quantity) => {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    (err, res) => {
      console.log(chalk.cyan("\nYour purchase of " + quantity + " " + product.product_name + " is complete! THANK YOU!"));
      displayItems();
    }
  );
}

//Add show the customer the total cost of their purchase.

let checkInventory = (choiceId, inventory) => {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
}

let userQuitOption = (choice) => {
  if (choice.toLowerCase() === "q") {
    console.log(chalk.yellow("THANK YOU FOR SHOPPING AT BAMAZON! GOODBYE!"));
    process.exit(0);
  }
}

