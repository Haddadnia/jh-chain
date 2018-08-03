const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2PServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001; //run on whatever specified, or 3001 // $ HTTP_PORT=3002 npm run dev

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2PServer(bc, tp);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
	res.json(bc.chain);
});

app.post('/mine', (req, res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New block added: ${block.toString()}`);
	// every time a mine occurs, update peers
	p2pServer.syncChains();
	res.redirect('/blocks'); //send all blocks back
});

app.get('/transactions', (req, res) => {
	res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
	const { recipient, amount } = req.body;
	const transaction = wallet.createTransaction(recipient, amount, tp);
	p2pServer.broadcastTransaction(transaction);
	res.redirect('/transactions');
});

app.listen(HTTP_PORT, () => console.log(`Listening for api on port ${HTTP_PORT}`));
p2pServer.listen();


