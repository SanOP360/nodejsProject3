const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editNode = req.query.edit;
  if (!editNode) {
    return res.redirect("/");
  }
  const prodID = req.params.productID;
  Product.findById(prodID, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editNode, // Pass editNode to the edit-product template
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const updatedProduct = new Product(
    prodID,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice,
 
  );

  updatedProduct.save();
  res.redirect('/admin/products')
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.postDeleteProduct=(req,res,next)=>{
  const prodID=req.body.productID;
  Product.deletebyId(prodID);
  res.redirect('/admin/products');
}