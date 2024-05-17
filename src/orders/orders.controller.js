const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


/////////////Validation Middleware below/////////////
//deliverTo property is missing
function hasDeliverTo(req, res, next){
    const { data: { deliverTo } = {} } = req.body;
    if (deliverTo){
        return next();
    }
    next({
        status: 400,
        message: "Order must include a deliverTo"
    });
}

//delverTo property is empty
function deliverToHasText(req, res, next){
    const { data: { deliverTo } = {} } = req.body;
    if (deliverTo === ""){
        next({
            status: 400,
            message: "Order must include a deliverTo",
        })
    }
    next();
}

//mobileNumber property is missing
function hasMobileNumber(req, res, next){
    const { data: { mobileNumber } = {} } = req.body;
    if (mobileNumber){
        return next();
    }
    next({
        status: 400,
        message: "Order must include a mobileNumber",
    });
}

//mobileNumber property is empty
function mobileNumberHasText(req, res, next){
    const { data: { mobileNumber } = {} } = req.body;
    if (mobileNumber === ""){
        next({
            status: 400,
            message: "Order must include a mobileNumber",
        })
    }
    next();
}

//dishes property is missing 
function hasDishes(req, res, next){
    const { data: { dishes } = {} } = req.body;
    if (dishes){
        return next();
    }
    next({
        status: 400,
        message: "Order must include a dish"
    });
}

//dishes property is not an array
function dishesArray(req, res, next){
    const { data: { dishes } = {} } = req.body;
    if (Array.isArray(dishes)){
        return next();
    }
    next({
        status: 400, 
        message: "Order must include at least one dish"
    });
}

//dishes array is empty
function dishesEmptyArray(req, res, next){
    const { data: { dishes } = {} } = req.body;
    if (dishes.length === 0){
        return next({
            status: 400,
            message: "Order must include at least one dish"
        });
    };
}

//dish quantity property missing
function hasQuantity(req, res, next){
    const { data: { quantity } = {} } = req.body;
    if (quantity){
        return next();
    }
    next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
    });
}