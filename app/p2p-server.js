const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

// example with these things set
//$ HTTP_PORT=3002 P2P+PORT=5003 PEERS = ws://localhost:5001,ws://localhost:5002 npm run dev

class P2PServer {
	constructor(blockchain) {
		this.blockchain = blockchain;
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
			this.blockchain.replaceChain(data);
		});
	}
	sendChain(socket) {
		socket.send(JSON.stringify(this.blockchain.chain));
	}
	syncChains() {
		this.sockets.forEach(socket => this.sendChain(socket));
	}
}

module.exports = P2PServer;