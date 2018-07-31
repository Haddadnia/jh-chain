const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
	let bc, bc2;

	beforeEach(() => {
		bc = new Blockchain();
		bc2 = new Blockchain();
	});

	//blockchain
	it('start with genesis block', () => {
		expect(bc.chain[0]).toEqual(Block.genesis());
	});
	it('adds a new block', () => {
		const data = 'test data';
		bc.addBlock(data);
		expect(bc.chain[bc.chain.length-1].data).toEqual(data);
	});
	//Chain validity
	it('validates a valid chain', () => {
		bc2.addBlock('foo');
		expect(bc.isValidChain(bc2.chain)).toBe(true);
	});
	it('invalidates a chain with a corrupt genesis block', () => {
		bc2.chain[0].data = 'Bad data';
		expect(bc.isValidChain(bc2.chain)).toBe(false);
	});
	it('invalidates a corrupt chain', () => {
		bc2.addBlock('foo');
		bc2.chain[1].data = 'Not foo';
		expect(bc.isValidChain(bc2.chain)).toBe(false); // because the hash wont match  based on the different data
	});
	//chain replace
	it('replaces the chain with valid chain', () => {
		bc2.addBlock('new block');
		bc.replaceChain(bc2.chain);
		expect(bc.chain).toEqual(bc2.chain);
	});
	it('does not replace the chain with one of less than or equal to length', () => {
		bc.addBlock('foo');
		bc.replaceChain(bc2.chain);

		expect(bc.chain).not.toEqual(bc2.chain);
	})
});













