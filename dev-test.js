const Block = require('./block');

const block = new Block('foo', 'lastHashy', 'hashY', 'dataY');
console.log(block.toString());