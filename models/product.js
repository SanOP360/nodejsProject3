const fs = require("fs");
const path = require("path");

const cart=require('./cart')
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        // Product already exists, update it
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );

        if (existingProductIndex !== -1) {
          products[existingProductIndex] = this;
        } else {
          console.log("Product not found!");
        }
      } else {
        // New product, generate an ID and add it
        this.id = Math.random().toString();
        products.push(this);
      }

      // Write the updated products array to the file
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
  static deletebyId(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);

      if (product) {
        const updatedProducts = products.filter((p) => p.id !== id);

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (!err) {
            cart.deleteProduct(id, product.price);
          } else {
            console.log(err);
          }
        });
      } else {
        console.log("Product not found!");
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => {
        return p.id === id;
      });
      cb(product);
    });
  }
};
