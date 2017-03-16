const Checker = require('./src/Checker');

let args = process.argv.slice(2);
let check = new Checker(args[0], args[1]);

check.run();