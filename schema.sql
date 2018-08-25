DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(19,4) NOT NULL,
stock_quantity INT NOT NULL
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Rustic Rubber Gloves', 290.00, 'Kids', 31)
,('Handmade Metal Table', 852.00, 'Health', 50)
,('Awesome Frozen Fish', 700.00, 'Industrial', 41)
,('Handcrafted Granite Salad', 143.00, 'Kids', 3)
,('Gorgeous Cotton Mouse', 660.00, 'Automotive', 79)
,('Licensed Cotton Car', 843.00, 'Outdoors', 72)
,('Licensed Soft Table', 619.00, 'Music', 86)
,('Refined Concrete Mouse', 155.00, 'Electronics', 83)
,('Sleek Steel Table', 634.00, 'Tools', 23)
,('Refined Concrete Shoes', 52.00, 'Jewelery', 33)
,('Incredible Soft Ball', 255.00, 'Grocery', 80)
,('Fantastic Fresh Gloves', 409.00, 'Tools', 39)
,('Small Metal Pants', 987.00, 'Industrial', 48)
,('Handcrafted Fresh Pizza', 59.00, 'Health', 48);

SELECT * FROM products;