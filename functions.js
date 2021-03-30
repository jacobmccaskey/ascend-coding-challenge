const { routes } = require("./data/data");

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
  const checkIfStartMapped = routes.find(
    (route) => route.startPoint === startPoint.toLowerCase()
  );
  const checkIfEndMapped = routes.find(
    (route) => route.startPoint === endPoint.toLowerCase()
  );

  if (!checkIfStartMapped || !checkIfEndMapped) {
    throw new Error("looks like this city isnt mapped yet");
  }

  for (const route of routes) {
    if (route.startPoint === startPoint) {
      const { connectingCities } = route;
      // checks to see if connecting city is destination and returns routeChain with totalDistance
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
            // finds next route in routes array to check if that route has connection with destination
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
          // triggers the recursive function to have another go at finding connections between current city's connections and the final destination
          return {
            recurse: true,
            start: startPoint,
            end: endPoint,
            connections: connectingCities,
            mileCount: startDistance,
            routes: routesToCheck,
          };
        }
        // the rest of this code constructs return object based on the parameters given one or several connecting cities connect to final destination.
        // start and end city is returned, totalDistance is calculated, and the last connecting point is returned with object.
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

function recursive(data, array, cache, start) {
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
    shortestRoute.start = start;
    return shortestRoute;
  }
}

function determineShortestRoute(start, end, miles) {
  let options = [];
  let cache = [];
  const routeDiscovery = findAllRoutes(start, end, miles);

  if (routeDiscovery.recurse) {
    return recursive(routeDiscovery, options, cache, start);
  } else {
    return routeDiscovery;
  }
}

module.exports = { determineShortestRoute };
