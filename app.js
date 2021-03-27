const { orders } = require("./input/orders.js");
const { routes } = require("./data/data");
const data = require("./data/data");

const optimizeLoads = async (orders, timeLimit) => {
  try {
    if (orders) console.log(orders);
  } catch (err) {
    console.log("something went wrong here");
    throw new Error(err.message);
  }
};

const configureRoutes = (routes, orders) => {
  const maxPallets = 26;
  let totalPallets = 0;
  orders.forEach((order) => (totalPallets += order.pallets));
  //rounds up to nearest whole number to give total number of necessary trips
  let numberOfRoutes = Math.ceil(totalPallets / maxPallets);
};

const newLoad = (data) => ({
  load: data.count,
  route: data.routes,
  pallets: data.pallets,
  totalMiles: data.totalMiles,
});

function findAllRoutes(startPoint, endPoint, startDistance) {
  let routeChain = {
    totalDistance: startDistance,
    start: startPoint,
    end: endPoint,
    connections: [],
  };

  if (startPoint === endPoint) {
    console.log(
      "please help the environment by walking your delivery to the location"
    );
    return routeChain;
  }

  for (const route of routes) {
    if (route.startPoint === startPoint) {
      const { connectingCities } = route;
      let connectsToEndPoint = connectingCities.filter(
        (connecting) => connecting.city === endPoint
      );
      if (connectsToEndPoint.length !== 0) {
        routeChain.totalDistance += connectsToEndPoint[0].distance;
        return routeChain;
      }
      if (connectsToEndPoint.length === 0 || connectsToEndPoint === undefined) {
        let possibleConnects = [];
        connectingCities.forEach((option) =>
          possibleConnects.push(option.city)
        );
        let routesToCheck = [];
        for (let i = 0; i < possibleConnects.length; i++) {
          for (let j = 0; j < routes.length; j++) {
            if (possibleConnects[i] === routes[j].startPoint) {
              routesToCheck.push(routes[j]);
            }
          }
        }
        let routeReducer = [];
        for (let i = 0; i < routesToCheck.length; i++) {
          for (const opt of routesToCheck[i].connectingCities) {
            if (opt.city === endPoint) {
              routeReducer.push(routesToCheck[i]);
            }
          }
        }
        if (routeReducer.length === 0) {
          //  triggers recursive fn
          return {
            recurse: true,
            start: startPoint,
            end: endPoint,
            connections: connectingCities,
            mileCount: startDistance,
          };
        }
        let shortestRoute = [];
        for (let i = 0; i < routeReducer.length; i++) {
          for (let point of routeReducer[i].connectingCities) {
            if (point.city === endPoint) {
              // need to find shortest route
              shortestRoute.push({ index: i, distance: point.distance });
            }
          }
        }

        let shortest = shortestRoute.reduce((a, b) =>
          a.distance < b.distance ? a : b
        );
        let bestConnectingRoute = routeReducer[shortest.index];
        let destinationFromBestRoute = bestConnectingRoute.connectingCities.filter(
          (each) => each.city === endPoint
        );
        let distToConnection = route.connectingCities
          .map((connecting) =>
            connecting.city === bestConnectingRoute.startPoint
              ? connecting.distance
              : null
          )
          .filter((num) => num !== null);

        let connectionForRouteChain = {
          city: bestConnectingRoute.startPoint,
          end: destinationFromBestRoute[0].city,
          distance: destinationFromBestRoute[0].distance,
        };
        routeChain.totalDistance += distToConnection[0];
        routeChain.totalDistance += shortest.distance;
        routeChain.connections.push(connectionForRouteChain);
      }
    }
  }
  return routeChain;
}

const routeDiscovery = findAllRoutes("houston", "miami", 0);

if (routeDiscovery.recurse) {
  let options = [];
  let cache = [];
  recursive(routeDiscovery, options, cache);
}

if (!routeDiscovery.recurse) {
  console.log(routeDiscovery);
}

function recursive(data, array, cache) {
  if (data.recurse) {
    const { connections } = data;
    let result;
    for (const connecting of connections) {
      // for (const limiter of cache) {
      // console.log(limiter);
      result = findAllRoutes(
        connecting.city,
        routeDiscovery.end,
        connecting.distance
      );
      if (result.recurse) {
        cache.push(connecting.city);
        console.log(cache);
      }
      if (!result.recurse) {
        array.push(result);
      }
      // to limit call stack instead of using function to cache cities already looped thru
      if (array.length > 4) {
        return console.log(array);
      }
      // }
    }
    // setTimeout(() => recursive(result, array), 0);
    recursive(result, array, cache);
  } else {
    console.log(data);
  }
}
