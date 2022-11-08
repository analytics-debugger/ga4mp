'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./ga4mp.cjs.prod.js");
} else {
  module.exports = require("./ga4mp.cjs.dev.js");
}
