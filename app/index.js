const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2PServer = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001; //run on whatever specified, or 3001 // $ HTTP_PORT=3002 npm run dev

const app = express();
const bc = new Blockchain();
const p2pServer = new P2PServer(bc);

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

app.listen(HTTP_PORT, () => console.log(`Listening for api on port ${HTTP_PORT}`));
p2pServer.listen();