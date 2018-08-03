const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
	chain: 'CHAIN',
	transaction: 'TRANSACTION'
};
// example with these things set
//$ HTTP_PORT=3002 P2P+PORT=5003 PEERS = ws://localhost:5001,ws://localhost:5002 npm run dev

class P2PServer {
	constructor(blockchain, transactionPool) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.sockets = [];
	}

	listen() {
		const server = new WebSocket.Server({ port: P2P_PORT });
		server.on('connection', socket => this.connectSocket(socket)) //so we can fire specific code whenever a new socket connects to this server
		this.connectToPeers();
		console.log(`Listening for p2p connection on ${P2P_PORT}`);
	}
	connectToPeers() {
		peers.forEach( peer => {
			// ws://localhost:5001 -- peers will be their addresses
			const peerSocket = new WebSocket(peer);
			peerSocket.on('open', () => this.connectSocket(peerSocket))
		});		
	}
	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('Socket Connected');

		this.messageHandler(socket);
		this.sendChain(socket)
	}
	messageHandler(socket) {
		socket.on('message', message => {
			const data = JSON.parse(message);
			// console.log('data', data);
			switch(data.type) {
				case MESSAGE_TYPES.chain:
					this.blockchain.replaceChain(data.chain);
					break;	
				case MESSAGE_TYPES.transaction:
					this.transactionPool.updateOrAddTransaction(data.transaction);
					break;
			}
		});
	}
	sendChain(socket) {
		socket.send(JSON.stringify({
			type: MESSAGE_TYPES.chain,
			chain: this.blockchain.chain
		}));
	}

	sendTransaction(socket, transaction) {
		socket.send(JSON.stringify({
				type: MESSAGE_TYPES.transaction,
				transaction
		}))
	}

	syncChains() {
		this.sockets.forEach(socket => this.sendChain(socket));
	}
	broadcastTransaction(transaction) {
		this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
	}
}

module.exports = P2PServer;