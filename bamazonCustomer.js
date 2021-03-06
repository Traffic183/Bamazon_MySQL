const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clc = require("cli-color");
const cTable = require("console.table");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "traffic1234",
  database: "bamazon_DB"
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  displayItems();
});

let displayItems = () => {
  console.log(clc.magentaBright("\nWELCOME TO BAMAZON!" + "\nITEMS AVAILABLE FOR SALE:\n"));
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
    .then((val) => {
      userQuitOption(val.choice);
      let choiceId = parseInt(val.choice);
      let product = checkInventory(choiceId, inventory);
      if (product) {
        quantityPrompt(product);
      }
      else {
        console.log(clc.bgRed("That item is not in the inventory. Please look again."));
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
        var subtotal = parseInt(product.price) * quantity;
        console.log(clc.bgRed("\nCost of Your Order Total Before Tax: $" + subtotal));
        console.log(chalk.cyan("\nYour purchase of " + clc.redBright(quantity) + " " + clc.magentaBright(product.product_name.toUpperCase()) + " is complete! THANK YOU!"));
      displayItems();
    }
  );
}

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

