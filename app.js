const { orders } = require("./input/orders.js");
const { routes } = require("./data/data");

const optimizeLoads = async (orders, timeLimit) => {
  try {
    if (orders) console.log(orders);
  } catch (err) {
    console.log("something went wrong here");
    throw new Error(err.message);
  }
};
const newLoad = (data) => ({
  load: data.count,
  route: data.routes,
  pallets: data.pallets,
  totalMiles: data.totalMiles,
});

const configureRoutes = (routes, orders) => {
  const maxPallets = 26;
  let totalPallets = 0;
  orders.forEach((order) => (totalPallets += order.pallets));
  //rounds up to nearest whole number to give total number of necessary trips
  let numberOfRoutes = Math.ceil(totalPallets / maxPallets);
  // console.log(numberOfRoutes);
};
function arrangeOrderForGroupedRoutes(routes, orders) {
  for (const order of orders) {
    const { pickCity, dropCity } = order;
  }
}

configureRoutes(routes, orders);
arrangeOrderForGroupedRoutes(routes, orders);
