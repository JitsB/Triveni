const Product = require('../models/product.model.js');
// Retrieve and return all products from the database.

exports.findAll = (req, res) => {
  console.log("Inside findAll function")
Product.find()
  .then(products => {
  res.send(products);
}).catch(err => {
  res.status(500).send({
  message: err.message || "Something went wrong while getting list of products."
});
});
};

exports.create = (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*');
  console.log("Inside create function")
  console.log("Request body sent is: ")
  console.log(req.body)
  // Validate request
  if(!req.body) {
    return res.status(400).send({
    message: "Please fill all required field"
  });
  }
  // Create a new Product
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    url: req.body.url
  });
  console.log("Json object created: ")
  console.log(product)
  // Save user in the database
  product.save()
    .then(data => {
      console.log("Data after saving: ",data)
    res.send(data);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while creating new product."
  });
  });
  };

// Deleting a product
  exports.delete = (req, res) => {
    console.log("Inside delete method")
    console.log("ID of the product to be deleted: ",req.params.id)
    Product.findByIdAndRemove(req.params.id)
    .then(product => {
    if(!product) {
      return res.status(404).send({
      message: "Product not found with id " + req.params.id
    });
    }
    res.send({message: "Product deleted successfully!"});
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
      message: "Product not found with id " + req.params.id
    });
    }
    return res.status(500).send({
      message: "Could not delete Product with id " + req.params.id
    });
    });
    };

// Update product by id
exports.update = (req, res) => {
  // Validate Request
  console.log("Inside Update")
  if(!req.body) {
    return res.status(400).send({
    message: "Please fill all required field"
  });
  }
  // Find Product and update it with the request body
  Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    url: req.body.url
  }, {new: true})
  .then(product => {
    if(!product) {
      return res.status(404).send({
      message: "Product not found with id " + req.params.id
    });
  }
  res.send(product);
  }).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "Product not found with id " + req.params.id
  });
  }
  return res.status(500).send({
    message: "Error updating Product with id " + req.params.id
  });
  });
  };
  