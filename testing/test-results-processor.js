const { pipe } = require('ramda');

module.exports = pipe(
  require("jest-sonar-reporter"),
  require("jest-junit"),
  require("jest-html-reporter")
);
