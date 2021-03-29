// created object with city names so I wont accidently mispell them when mapping out routes
const cities = {
  nashville: "nashville",
  dallas: "dallas",
  houston: "houston",
  newOrleans: "new orleans",
  jackson: "jackson",
  tallahassee: "tallahassee",
  atlanta: "atlanta",
  orlando: "orlando",
  tampa: "tampa",
  charlotte: "charlotte",
  jacksonville: "jacksonville",
  miami: "miami",
};

const {
  nashville,
  dallas,
  houston,
  newOrleans,
  jackson,
  tallahassee,
  atlanta,
  orlando,
  tampa,
  charlotte,
  jacksonville,
  miami,
} = cities;

// this is just to make my code more readible and reduce lines of code.
function connectRoute(city, distance) {
  return {
    city: city,
    distance: distance,
  };
}

// please let me know if there is better way to do this
const routes = [
  {
    startPoint: dallas,
    connectingCities: [
      connectRoute(houston, 239),
      connectRoute(newOrleans, 492),
      connectRoute(nashville, 664),
      connectRoute(jackson, 402),
    ],
  },
  {
    startPoint: houston,
    connectingCities: [
      connectRoute(dallas, 239),
      connectRoute(newOrleans, 348),
    ],
  },
  {
    startPoint: newOrleans,
    connectingCities: [
      connectRoute(nashville, 533),
      connectRoute(tallahassee, 387),
      connectRoute(jackson, 188),
      connectRoute(dallas, 492),
      connectRoute(houston, 348),
    ],
  },
  {
    startPoint: jackson,
    connectingCities: [
      connectRoute(dallas, 402),
      connectRoute(nashville, 415),
      connectRoute(atlanta, 381),
      connectRoute(newOrleans, 188),
    ],
  },
  {
    startPoint: nashville,
    connectingCities: [
      connectRoute(dallas, 664),
      connectRoute(charlotte, 409),
      connectRoute(atlanta, 265),
      connectRoute(tallahassee, 490),
      connectRoute(newOrleans, 533),
      connectRoute(jackson, 415),
    ],
  },
  {
    startPoint: atlanta,
    connectingCities: [
      connectRoute(charlotte, 245),
      connectRoute(nashville, 265),
      connectRoute(jackson, 381),
      connectRoute(tallahassee, 272),
      connectRoute(tampa, 456),
      connectRoute(orlando, 438),
      connectRoute(jacksonville, 346),
    ],
  },
  {
    startPoint: tallahassee,
    connectingCities: [
      connectRoute(newOrleans, 387),
      connectRoute(nashville, 490),
      connectRoute(atlanta, 272),
      connectRoute(orlando, 257),
      connectRoute(tampa, 276),
    ],
  },
  {
    startPoint: charlotte,
    connectingCities: [
      connectRoute(nashville, 409),
      connectRoute(atlanta, 245),
    ],
  },
  {
    startPoint: orlando,
    connectingCities: [
      connectRoute(atlanta, 438),
      connectRoute(jacksonville, 141),
      connectRoute(miami, 236),
      connectRoute(tampa, 84),
      connectRoute(tallahassee, 257),
    ],
  },
  {
    startPoint: jacksonville,
    connectingCities: [
      connectRoute(atlanta, 346),
      connectRoute(orlando, 141),
      connectRoute(miami, 347),
    ],
  },
  {
    startPoint: miami,
    connectingCities: [
      connectRoute(tampa, 280),
      connectRoute(orlando, 236),
      connectRoute(jacksonville, 347),
    ],
  },
  {
    startPoint: tampa,
    connectingCities: [
      connectRoute(tallahassee, 276),
      connectRoute(atlanta, 456),
      connectRoute(orlando, 84),
      connectRoute(miami, 280),
    ],
  },
];

module.exports = { routes };
