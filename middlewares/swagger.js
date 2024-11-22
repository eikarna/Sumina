const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Nix-API",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. Created by Eikarna with love <3",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./api/*/index.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
