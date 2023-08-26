import { SHA256 } from 'crypto-js';

class Block {
  constructor(index, date, amount, ownername, previousHash = '', chainId) {
    this.index = index;
    this.date = date;
    this.amount = amount;
    this.ownername = ownername;
    this.previousHash = previousHash;
    this.chainId = chainId; // Set the chain ID once for the entire blockchain
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.chainId + // Include chainId in the hash calculation
      this.index +
      this.previousHash +
      this.date +
      this.ownername +
      JSON.stringify(this.amount) +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined..' + this.hash);
  }
}

class Blockchain {
  constructor(chainId) {
    this.chainId = chainId; // Set the chain ID once for the entire blockchain
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    const date = new Date();
    return new Block(0, date, 1000, 'central-bank', '0', this.chainId);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export { Block, Blockchain };
