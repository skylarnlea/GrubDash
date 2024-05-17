const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

//create handler
function create(req, res){
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
    const newId = new nextId();
    const newOrder = {
        id: newId,
        mobileNumber: mobileNumber,
        dishes: { dishes },
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

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

//status property is missing
function hasStatus(req, res, next){
    const { data: { status } = {} } = req.body;
    if(status){
        return next();
    }
    next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
    })
}

//status property is empty
function statusIsEmpty(req, res, next) {
    const { data: { status } = {} } = req.body;
    if (!status) {
      next({
          status: 400,
          message:
            "Order must have a status of pending, preparing, out-for-delivery, delivered",
        });
    }
    next();
  }

//Status property of the existing order === "delivered"
function statusIsDelivered(req, res, next){
    const { data: { status } = {} } = req.body;
    if(status === "delivered"){
        next({
            status: 400,
            message: "A delivered order cannot be changed",
        });
    }
    next();
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
        res.locals.quantity = quantity;
        return next();
    }
    next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
    });
}

//dish quantity property is zero or less
function quantityOverZero(req, res, next){
    const quantity = res.locals.quantity;
    if (quantity > 0) {
        res.locals.quantity = quantity;
        return next();
    } else {
        next({
            status: 400,
            message: `Dish ${index} must have a quantity that is an integer greater than 0`,
        });
    };
}

//dish quantity property is not an integer
function quantityIsNumber(req, res, next){
    const { data: { quantity } = {} } = req.body;
    if (quantity === NaN){
        return next ({
            status: 400,
            message: `Dish ${index} must have a quantity that is an integer greater than 0`,
        });
    }
    next();
}

//status property of the order !== "pending"
function statusPending(req, res, next){
    const order = res.locals.order;
    const { status } = order;
    if (status === "pending"){
        return next();
    }
    next({
        status: 400,
        message: "An order cannot be deleted unless it is pending."
    });
}

/////////////Validation Middleware above/////////////

function orderExists(req, res, next){
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder){
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order id not found: ${orderId}`,
    });
}

function read(req, res){
    res.json({ data: res.locals.order });
}

//matching id from body to id in the route
function matchingId(req, res, next){
    const { orderId } = req.params;//route id
    const { data: { id } = {} } = req.body;//body id
    if (orderId === id || !id){
        return next();
    }
    next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`
    });
}

//list handler
function list(req, res){
    res.json({ data: orders });
}

//update handler
function update(req, res){
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    foundOrder.deliverTo = deliverTo;
    foundOrder.mobileNumber = mobileNumber;
    foundOrder.status = status;

    res.json({ data: foundOrder });
}

//delete handler
function destroy(req, res){
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    orders.splice(index, 1);
    res.sendStatus(204);
}



module.exports = {
    list,
    create: [
        hasDeliverTo,
        hasMobileNumber,
        hasDishes,
        dishesArray,
        dishesEmptyArray,
        hasQuantity,
        quantityOverZero,
        quantityIsNumber,
        create,
    ],
    read: [orderExists, read],
    update: [
        orderExists,
        matchingId,
        hasStatus,
        statusIsEmpty,
        statusIsDelivered,
        hasDeliverTo,
        hasMobileNumber,
        hasDishes,
        dishesEmptyArray,
        dishesArray,
        hasQuantity,
        quantityOverZero,
        quantityIsNumber,
        update,
    ],
    delete: [
        orderExists,
        statusPending,
        destroy,
    ]
}






