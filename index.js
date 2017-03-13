const Checker = require('./src/Checker');

let args = process.argv.slice(2, process.argv.length);
let check = new Checker(args[0]);

check.run();