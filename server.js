/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */
const path = require("path");

var fs = require('fs');
var activeData = JSON.parse(fs.readFileSync(path.join(__dirname, "public/qa_model.json"), 'utf8'));


// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };

//   // If someone clicked the option for a random color it'll be passed in the querystring
//   if (request.query.randomize) {
//     // We need to load our color data file, pick one at random, and add it to the params
//     const colors = require("./src/colors.json");
//     const allColors = Object.keys(colors);
//     let currentColor = allColors[(allColors.length * Math.random()) << 0];

//     // Add the color properties to the params object
//     params = {
//       color: colors[currentColor],
//       colorError: null,
//       seo: seo,
//     };
//   }
  params.ids = Object.keys(activeData)

  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/index.hbs", params);
});


fastify.get("/work", function (request, reply) {

  
  let use = {}
  for (let k in activeData){
    // if (!activeData[k].use){
    if (k == 'afc1939007_afs02237a'){
      use = activeData[k]
      use.id = k
    }
  }
  
  if (request.query && request.query.id){
    for (let k in activeData){
      // if (!activeData[k].use){
      if (k == request.query.id){
        use = activeData[k]
        use.id = k
      }
    }
  
  }
  
  
  // Your code
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(use)
  
  
});


/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };

  
  // The Handlebars template will use the parameter values to update the page with the chosen color
  return reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
