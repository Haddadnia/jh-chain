// const Block = require('./block');

// const block = new Block('foo', 'lastHashy', 'hashY', 'dataY');
// console.log(block.toString());
// console.log(Block.genesis().toString());

// const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
// console.log(fooBlock.toString());

// const Blockchain = require('./blockchain');
// const bc = new Blockchain();

// for (let i =0; i<10; i++) {
// 	console.log(bc.addBlock(`foo ${i}`).toString());
// }

const Wallet = require('./wallet');
wallet = new Wallet();
console.log(wallet.toString());