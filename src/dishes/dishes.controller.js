const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function create(req, res){
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newId = new nextId();
    const newDish = {
        id: newId,
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

//Validation middleware
//Name property missing
function hasName(req, res, next){
    const { data: { name } = {} } = req.body;
    if (name) {
        return next();
    }
    next ({
        status: 400,
        message: "Dish must include a name"
    });
}

//Name porperty is empty
function nameHasText(req, res, next){
    const { data: { name } ={} } = req.body;
    if (name === ""){
        next({
            status: 400,
            message: "Dish must include a name"
        });
    }
    next();
}

//Description property is missing
function hasDescription(req, res, next){
    const { data: { description } = {} } = req.body;
    if (description) {
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a description"
    });
}

//Description property is empty
function descriptionHasText(req, res, next){
    const { data: { description } ={} } = req.body;
    if (description === ""){
        next({
            status: 400,
            message: "Dish must include a description"
        });
    }
    next();
}

//Price property is missing
function hasPrice(req, res, next){
    const { data: { price } = {} } = req.body;
    if (price){
        res.locals.price = price;
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a price"
    })
}

//Price property is 0 or less
function priceOverZero(req, res, next){
    const price = res.locals.price;
    if (price > 0) {
        res.locals.price = price;
        return next();
    } else {
        next({
            status: 400,
            message: "Dish must have a price that is an integer greater than 0"
        })
    }
}

//Price property is not an integer
function priceIsNumber(req, res, next){
    const { data: { price } = {} } = req.body;
    if (price === NaN){
        return next ({
            status: 400,
            message: "Dish must have a price that is an integer greater than 0"
        });
    }
    next();
}

//Image property missing
function hasImage(req, res, next){
    const { data: { image_url } = {} } = req.body;
    if (image_url){
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a image_url"
    })
}

//Image property is empty
function imageHasText(req, res, next){
    const { data: { image_url } = {} } = req.body;
    if (image_url === ""){
        next({
            status: 400,
            message: "Dish must include a image_url"
        })
    }
    next();
}

module.exports = {
    create: [
        hasName,
        nameHasText,
        hasDescription,
        descriptionHasText,
        hasImage,
        imageHasText,
        hasPrice,
        priceOverZero,
        priceIsNumber,
        create,
    ],
}
