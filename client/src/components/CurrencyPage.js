import React, { useState } from 'react';
import { Block, Blockchain } from './blockchain'; // Assuming this combined file is named 'blockchain.js'
import { Button, Form, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "./styles.css";
import SearchIcon from "./pictures/search.svg";


function CurrencyPage() {
  const [blockchains, setBlockchains] = useState([]);
  const [blockchainData, setblockchainData] = useState([]);
  const [searchvalue, setSearchvalue] = useState('');
  const [SearchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    setSearchvalue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
      if(searchvalue){
         axios
           .post("http://localhost:3001/api/blocksearch", { searchvalue })
           .then((response) => {
             setSearchResults(response.data);
             //setDbalance(response.data.myDBal.dmoney)
             
           })
           .catch((error) => {
             console.log(error);
           });
       }
     
  };

  function generateRandomEightDigitNumber() {
    return Math.floor(10000000 + Math.random() * 90000000);
  }

  const handleCreateBlockchain = () => {

    const chainId = generateRandomEightDigitNumber();
    const newBlockchain = new Blockchain(chainId);

    
    //const myBlockchain = new Blockchain(chainId);

    // Create a new instance of the Block class for the genesis block
    const genesisBlock = new Block(
      0,
      new Date(),
      1000,
      'central-bank',
      '0'
    );

    newBlockchain.chain.push(genesisBlock); // Add the new genesis block to the new blockchain

    // Add the new blockchain with just the genesis block to the blockchains state
    setBlockchains((prevBlockchains) => [...prevBlockchains, newBlockchain]);

    const currentHash = genesisBlock.hash;
    

    console.log(currentHash);
    console.log(chainId);

    
      axios
        .post("http://localhost:3001/api/newblockchain",{ chainId, currentHash})
        .then((response) => {
          //setRecievedResults(response.data.recieved);
          //setSendResults(response.data.send);
        })
        .catch((error) => {
          console.log(error);
        });
  

    
  };

  // Function to display the details of the genesis block for a blockchain
  const renderGenesisBlockDetails = (blockchain, index) => {
    const genesisBlock = blockchain.chain[0]; // Get the genesis block
    return (
      <div key={index} className="blockchain-info">
        <h2>Genesis Block of Blockchain </h2>
        <p>Chain id: {genesisBlock.chainId}</p>
        <p>Index: {genesisBlock.index}</p>
        <p>Timestamp: {genesisBlock.date.toLocaleString()}</p>
        <p>Amount: {JSON.stringify(genesisBlock.amount)}</p>
        <p>Owner Name: {genesisBlock.ownername}</p>
        <p>Previous Hash: {genesisBlock.previousHash}</p>
        <p>Hash: {genesisBlock.hash}</p>
      </div>
    );
  };

  const showblockchains =() =>{
    axios.post("http://localhost:3001/api/blockdata")
    .then((response) => {
      console.log(response.data);
      setblockchainData(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const RenderBlockdata =({blockchainData}) => {
    return (
      <div className="card mb-3" style={{ width: '36rem' }}>
        <div className="card-container  d-flex flex-wrap">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Blockchain ID: {blockchainData.chain_id}</h5>
          
          <p className="card-text">Timestamp: {new Date(blockchainData.timestamp).toLocaleString()}</p>
          <p className="card-text">Amount: {JSON.stringify(blockchainData.amount)}</p>
          <p className="card-text">Owner Name: {blockchainData.current_owner}</p>
          <p className="mt-auto">Previous Hash: {blockchainData.previous_hash}</p>
          <p className="mt-auto">Hash: {blockchainData.current_hash}</p>
        </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="currencypage">
      <div className="mycurrency">
        <h1>Blockchains</h1>
        <div className="blocksearchbar">
        <Form className="d-flex"  onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            placeholder="Search blockchain"
            className="me-2"
            aria-label="Search"
            value={searchvalue}
            onChange={handleInputChange}
          />
          <Button variant="outline-success" type="submit">
            <img src={SearchIcon} alt="Search" />
          </Button>
        </Form>
      </div>
        <Button onClick={handleCreateBlockchain}>Create New Blockchain</Button>
        <Button onClick={showblockchains}>See created Blockchains</Button>
       
        
        <div className='rightarrange'>
          <div className='leftarrange'>
         {/* Display details of the latest blockchain */}
         {blockchains.length > 0 && renderGenesisBlockDetails(blockchains[blockchains.length - 1], blockchains.length - 1)}

          {/* Display the blockchain data as cards */}
          {blockchainData.map((data, index) => (
 
          <RenderBlockdata key={index} blockchainData={data} />

          ))}
          </div>
        
          <div className="right-column">
        {/* Display the search results */}
        {SearchResults.map((result) => (
      <div key={result.id} className="right-aligned-item">
        {/* Render each element */}
        <div className="card mb-3" style={{ width: '36rem' }}>
        <div className="card-container  d-flex flex-wrap">
        <div className="card-body d-flex flex-column justify-content-between">
        <p className="card-text">Chain ID: {result.chain_id}</p>
        <p className="card-text">Current Owner: {result.current_owner}</p>
        <p className="mt-auto">Previous Hash: {result.previous_hash}</p>
        <p className="mt-auto">Current Hash: {result.current_hash}</p>
        <p className="card-text">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
        <p className="card-text">Amount: {result.amount}</p>
        </div>
        </div>
      </div>
      </div>
    ))}
    </div>
      </div>
      </div>
    </div>
  );
}

export default CurrencyPage;
