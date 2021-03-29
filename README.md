YOU DO NOT NEED TO RUN NPM INSTALL TO START PROGRAM.

RUN node app.js [ timout ]

the script basically chains together orders based on how close the remaining orders are. If the amount of pallets exceeds the limit of the max pallets allowed, the current load is pushed to the optimized order and a new load is built out with the remaining input.

To change the input, edit the input/orders.js file.

THINGS I NEED TO COMPLETE
1.)The tool chains together orders based on how close the remaining orders are, but it does not effectively choose the best route based on both the number of pallets AND the distance between two cities. Basically it only takes into account distance right now.
2.) I have to calculate the best route by grouping orders based on the number of pallets AND whether or not they have a shared connecting city or endpoint.
3.) I need a function to handle single orders with a large number of pallets.
4.) Fetching routes between the two most far away cities causes a stack overflow error. I need a cache that keeps track of every route mapped so it is not looped over twice.
5.) Needs refactoring and renaming of variables.
COMMANDS

RUN node app.js [ timout ]

---

npm install
npm run dev : nodemon app.js 30000
npm start : node app.js 30000
