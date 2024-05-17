const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//CREATE
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

//////////////Validation middleware below//////////////
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

//////////////Validation middleware above//////////////
//LIST
function list(req,res){
    res.json({ data: dishes });
}

//Existing dishes
function dishExists(req, res, next){
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish){
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}`,
    })
}

//Matching dishes
function matchingId(req, res, next){
    const { dishId } = req.params; //dishId in the route
    const { data: { id } = {} } = req.body; //id in the body
    if (id === dishId || !id){ //checking if dishId in route matches id in body
        return next();
    }
    next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
}


//READ
function read(req, res, next){
    res.json({ data: res.locals.dish });
}

//UPDATE
function update(req, res){
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id ===dishId);
    const { data: { name, description, price, image_url } = {} } = req.body;

    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;

    res.json({ data: foundDish });
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
    list,
    read: [dishExists, read],
    update: [
        dishExists,
        matchingId,
        hasName,
        nameHasText,
        hasDescription,
        descriptionHasText,
        hasImage,
        imageHasText,
        hasPrice,
        priceOverZero,
        priceIsNumber,
        update,     
    ]
}
