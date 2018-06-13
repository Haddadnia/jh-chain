class Block {
	constructor(timestamp, lastHash, hash, data) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
	}

	toString() {
		return `Block -
		Timestamp     : ${this.timestamp}
		Last Hash (10): ${this.lastHash.substring(0, 10)}
		Hash (10)     : ${this.hash.substring(0, 10)}
		Data          : ${this.data}`;
	}
}

module.exports = Block;