const express = require('express');

const productRoutes = express.Router();
const dbo = require('../db/connection');


//Add a new Product
productRoutes.route('/products/new').post(function(req, res){ 

    const dbConnect = dbo.getDb();

    const newProductDocument = {
        Id: req.body.Id,
        Name: req.body.Name,
        ReleaseDate: req.body.ReleaseDate,
        OriginalPrice: req.body.OriginalPrice,
        Discount: req.body.Discount,
        PictureUrl: req.body.PictureUrl
    };

    dbConnect
    .collection('Products_Bhusal')
    .insertOne(newProductDocument, function(err, result){
        if(err){
            res.status(400).send('Error inserting new product!');

        }else{
            console.log('Added a new product with id ' + result.insertedId);
            res.status(200).send();
        }
    })
});


// Search products by name
productRoutes.route('/products/search/:name').get(function(req, res){

    const filter = { $text: {$search: req.params.name} };
    const dbConnect = dbo.getDb();
    console.log(filter);
    dbConnect
    .collection('Products_Bhusal')
    .find(filter)
    .toArray(function(err, result){
        if(err){
            res.status(400).send('Error fetching products!');
        }else{
            res.json(result);
        }
    });
});


//Get all Products
productRoutes.route('/products').get(function(req, res){ 

    const dbConnect = dbo.getDb();
    dbConnect
    .collection('Products_Bhusal')
    .find({})
    .toArray(function(err, result){
        if(err){
            res.status(400).send('Error fetching all products!');
        }else{
            res.json(result);
        }
    });
});


// Edit a Specific Product
productRoutes.route('/products/edit/:id').put(function(req, res){ 

    const dbConnect = dbo.getDb();

    const filter = { Id: parseFloat(req.params.id) };
    console.log(filter);

    const update = {
        $set:{
            Name: req.body.Name,
            ReleaseDate: req.body.ReleaseDate,
            OriginalPrice: req.body.OriginalPrice,
            Discount: req.body.Discount,
            PictureUrl: req.body.PictureUrl
        }
    };

    dbConnect
    .collection('Products_Bhusal')
    .updateOne(filter, update, function(err, result){
        if(err){
            res.status(400).send('Error updating product with id ' + filter.Id);

        }else{
            console.log('Product updated');
            res.status(204).send();
        }
    })
});


//Remove a Product from the collection
productRoutes.route('/products/delete/:id').delete(function(req, res){ 

    const dbConnect = dbo.getDb();

    const filter = { Id: parseFloat(req.params.id) };
    console.log(filter);

    dbConnect
    .collection('Products_Bhusal')
    .deleteOne(filter, function(err, result){
        if(err){
            res.status(400).send('Error deleting product with id ' + filter.Id);

        }else{
            console.log('1 product deleted');
            res.status(204).send();
        }
    })
});


module.exports = productRoutes;
