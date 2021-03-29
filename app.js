const { orders } = require("./input/orders.js");
const { determineShortestRoute } = require("./functions");

const optimizeLoads = async (orders, callback) => {
  let timeout = Number(process.argv[2]);
  const argsCheck = checkArgs(timeout);
  if (argsCheck === false) {
    timeout = 30000;
  }
  let loads = [];
  currentLoad = {
    totalMiles: 0,
  };
  let loadCounter = 1;
  try {
    const result = await configureLoads(
      orders,
      loads,
      currentLoad,
      loadCounter
    );
    // there is probably a prettier way of doing this with bluebird or Promise.race
    let timer = setTimeout(() => {
      if (!result) {
        throw new Error("execution took too long");
      } else {
        return;
      }
    }, timeout);

    if (result) {
      clearTimeout(timer);
    }

    return result;
  } catch (error) {
    callback(error);
  }
};

optimizeLoads(orders, handleError).then((results) =>
  console.log(JSON.stringify(results))
);

function handleError(error) {
  console.error(error);
}
function checkArgs(args) {
  if (isNaN(args)) {
    throw new Error("pass in a number as an argument");
  }
  typeof args === "number" ? true : false;
}

async function configureLoads(orders, loadsArray, currentLoad, counter) {
  const MAXPALLETS = 26;

  // returns loadsArray with current load if all orders have been loaded.
  if (orders.length === 0) {
    loadsArray.push(currentLoad);
    return loadsArray;
  }
  if (currentLoad.pallets && currentLoad.pallets === MAXPALLETS) {
    loadsArray.push(currentLoad);
    return loadsArray;
  }

  orders.map((each) => {
    each.pickCity = each.pickCity.toLowerCase();
    each.dropCity = each.dropCity.toLowerCase();
  });
  // converts pickCity and dropCity to lowercase for use in determineShortestRoute()

  refToCurrentOrder = orders[0];
  // will need for reference to current order details when constructing load object
  // reference is stored here before it is spliced out on line 89

  const firstOrderRoute = determineShortestRoute(
    refToCurrentOrder.pickCity,
    refToCurrentOrder.dropCity,
    0
  );
  let firstConnectingCity = firstOrderRoute.end;
  let milesTraveled = firstOrderRoute.totalDistance;
  let firstPalletsLoaded = refToCurrentOrder.pallets;
  // only returns if there is one order left in the array
  // if (orders.length === 1) {
  //   console.log(firstOrderRoute);
  // }
  orders.splice(orders[0], 1);

  let nextOrdersToCheck = [];
  for (const order of orders) {
    let orderDetails = determineShortestRoute(
      firstConnectingCity,
      order.dropCity,
      0
    );
    nextOrdersToCheck.push(orderDetails);
  }
  const nextOrderRoute = nextOrdersToCheck.reduce((a, b) => {
    if (a.totalDistance < b.totalDistance) {
      return a;
    } else {
      return b;
    }
  });

  let nextOrder = orders.find((order) => order.dropCity === nextOrderRoute.end);
  let drops = [];
  let remainingOrdersArray = orders;
  drops.push(firstOrderRoute);
  drops.push(nextOrderRoute);
  // adds corresponding order number and pallets to each route
  drops.forEach((drop) => {
    if (drop.end === refToCurrentOrder.dropCity) {
      drop.order = refToCurrentOrder.order;
      drop.pallets = refToCurrentOrder.pallets;
    }
    if (drop.end === nextOrder.dropCity) {
      drop.order = nextOrder.order;
      drop.pallets = nextOrder.pallets;
    }
  });

  if (nextOrder.pallets + firstPalletsLoaded <= MAXPALLETS) {
    currentLoad.totalMiles = milesTraveled + nextOrderRoute.totalDistance;
    currentLoad.pallets = nextOrder.pallets + firstPalletsLoaded;
    if (!currentLoad.load) currentLoad.load = counter;
    if (!currentLoad.route) {
      currentLoad.route = [
        {
          city: firstOrderRoute.start,
          type: "pick",
          orders: [refToCurrentOrder.order, nextOrder.order],
        },
      ];
    }
    drops.forEach((drop) =>
      currentLoad.route.push({
        city: drop.end,
        type: "drop",
        orders: [drop.order],
      })
    );
    // returns remaining orders for recursion
    remainingOrdersArray = orders.filter(
      (order) => order.dropCity !== nextOrder.dropCity
    );
  }
  if (nextOrder.pallets + firstPalletsLoaded > MAXPALLETS) {
    console.log("max pallets reached");
    loadsArray.push(currentLoad);
    counter++;
    currentLoad = {
      totalMiles: 0,
      load: counter,
    };
    return configureLoads(
      remainingOrdersArray,
      loadsArray,
      currentLoad,
      counter
    );
  }

  if (remainingOrdersArray.length >= 2) {
    loadsArray.push(currentLoad);
    counter++;
    currentLoad = {
      totalMiles: 0,
      load: counter,
    };
    return configureLoads(
      remainingOrdersArray,
      loadsArray,
      currentLoad,
      counter
    );
  }

  if (remainingOrdersArray.length === 0 && currentLoad) {
    loadsArray.push(currentLoad);
    return loadsArray;
  }

  return configureLoads(remainingOrdersArray, loadsArray, currentLoad, counter);
}
