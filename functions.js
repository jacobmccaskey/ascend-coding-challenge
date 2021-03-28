const { routes } = require("./data/data");

// traverses grid. Similar to breadth-first search algorithm.
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
          return {
            recurse: true,
            start: startPoint,
            end: endPoint,
            connections: connectingCities,
            mileCount: startDistance,
            routes: routesToCheck,
          };
        }
        let shortestRoute = [];
        for (let i = 0; i < routeReducer.length; i++) {
          for (let point of routeReducer[i].connectingCities) {
            if (point.city === endPoint) {
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

function recursive(data, array, cache) {
  const { connections } = data;
  let result;
  let shortestRoute;
  for (const connecting of connections) {
    result = findAllRoutes(connecting.city, data.end, connecting.distance);

    if (!result.recurse) {
      result.totalDistance += data.mileCount;
      array.push(result);
    }
    if (array.length > 4) {
      shortestRoute = array.reduce((a, b) =>
        a.totalDistance < b.totalDistance ? a : b
      );
      shortestRoute.start = data.start;
      return shortestRoute;
    }
  }
  if (array.length === 0) {
    return recursive(result, array, cache);
  }
  if (array.length !== 0) {
    shortestRoute = array.reduce((a, b) =>
      a.totalDistance < b.totalDistance ? a : b
    );
    shortestRoute.start = data.start;
    return shortestRoute;
  }
}

function determineShortestRoute(start, end, miles) {
  let options = [];
  let cache = [];
  const routeDiscovery = findAllRoutes(start, end, miles);

  if (routeDiscovery.recurse) {
    return recursive(routeDiscovery, options, cache);
  } else {
    return routeDiscovery;
  }
}

// const result = determineShortestRoute("houston", "miami", 0);
// console.log(result);
module.exports = { determineShortestRoute };
