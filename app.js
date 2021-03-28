const { orders } = require("./input/orders.js");
const { determineShortestRoute } = require("./functions");

const configureRoutes = async (orders) => {
  const maxPallets = 26;
  let totalPallets = 0;
  orders.forEach((order) => (totalPallets += order.pallets));
  //rounds up to nearest whole number to give total number of necessary trips
  let numberOfTrips = Math.ceil(totalPallets / maxPallets);
  let routes = [];
  // for (const order of orders) {
  //   const start = order.pickCity.toLowerCase();
  //   const drop = order.dropCity.toLowerCase();
  //   // third param is a placeholder for miles traveled, it will increase as it travereses nodes on graph.
  //   let route = determineShortestRoute(drop, start, 0);
  //   routes.push(route);
  // }
  // console.log(routes);
  const result = configureLoads(orders, numberOfTrips);
  return result;
};

function configureLoads(orders, numOfTrips) {
  let numberOfOrders = [...Array(orders.length).keys()];
  let loads = [];
  // use continue keyword in for loop
  let endPoints = ["tampa"];
  let truck = { pallets: 0, route: [], load: 1, totalMiles: 0 };
  // const buildChainedLoad = (num) => {
  //   const route = determineShortestRoute(
  //     orders[num].pickCity.toLowerCase(),
  //     orders[num].dropCity.toLowerCase(),
  //     0
  //   );
  //   const truckCheck = checkTruck(truck);

  //   if (truckCheck === false) {
  //     clearTruckState(truck);
  //   }
  //   if (truckCheck === true) {
  //     addLoad(route, truck, loads);
  //   }
  // };
  // let num = 0;
  // const result = buildChainedLoad(0);
  // return result;
  for (let i = 0; i < orders.length; i++) {
    const { dropCity, pickCity } = orders[i];
    const drop = dropCity.toLowerCase();
    const pick = pickCity.toLowerCase();
    const checkIfAlreadyInLoad = endPoints.find((city) => city === drop);
    if (checkIfAlreadyInLoad) {
      continue;
    }
    endPoints.push(drop);
    const route = determineShortestRoute(pick, drop, 0);
    findNextStop(route, i);
  }
}
function findNextStop(route, num) {
  console.log(orders[num + 1]);
  console.log(route);
}
function addLoad(route, truck, loads) {}
function checkTruck(truck) {
  if (truck.pallets >= 26) {
    return false;
  }
  return true;
}

function clearTruckState(truck) {
  truck.pallets = 0;
  truck.route = [];
  truck.load = truck.load += 1;
  truck.totalMiles = 0;
}

const result = configureRoutes(orders);
console.log(result);
