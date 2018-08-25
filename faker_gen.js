const faker = require('faker');
const fs = require('fs');
const nameProduct = faker.commerce.productName(); 
const productPrice = faker.commerce.price(); 
const departmentName = faker.commerce.department();
const stockQuantity = faker.random.number(100);

let fakerData = () =>{
  for(var i=0; i<11; i++){
    fs.appendFile('faker.txt', faker.fake("('{{commerce.productName}}', {{commerce.price}}, '{{commerce.department}}', {{random.number(100)}})\n"), (err) => {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
  }
}
fs.appendFile('faker.txt', faker.fake("('{{commerce.productName}}', {{commerce.price}}, '{{commerce.department}}', {{random.number(100)}})\n"), (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});

fakerData();