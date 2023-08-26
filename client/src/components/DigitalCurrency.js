import React, { useState } from 'react'
import "./loginStyles.css"
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { SHA256 } from 'crypto-js';

function DigitalCurrency (){
    const [chain_id, setchain_id] = useState("");
    const [previoushash, setprevioushash] = useState("");
    const [showSecondButton, setShowSecondButton] = useState(false);
    const email = localStorage.getItem('email');
    const date = Date();
    const amount = 1000;
    const nonce = 2;
    const [blockchainData, setblockchainData] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [recievermail, setrecievermail] = useState("");
    const [mychain_id, setmychain_id] = useState("");
    const [myprevioushash, setmyprevioushash] = useState("");
    
    

    const getbutton = () =>{

        axios.post("http://localhost:3001/api/getbutton")
        .then((response) => {
            //console.log(response.data);
            setchain_id(response.data.chain_id);
            setprevioushash(response.data.chainhash);
           if(response.data.chain_id){
            setShowSecondButton(true);
           }
           else{
            alert("Sorry not available at the moment.");
           }
          })
          .catch((error) => {
            console.log(error);
          });
          
    }

    const handleSecondButtonClick = () => {
        // Perform the API call to insert values into the database
        // For example, use axios.post() here to send the data to the server
        const newhash =  SHA256(
            chain_id + // Include chainId in the hash calculation
            previoushash +
            date +
            email +
            JSON.stringify(amount) +
            nonce
          ).toString();
          //console.log(newhash);

         

          if(newhash){
          axios.post("http://localhost:3001/api/confirmbutton", {chain_id, email, previoushash, newhash})
          .then((response) => {
            console.log(response.data);
            //setblockchainData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
          }
        
        // Reset the state after successful insertion (if needed)
        setShowSecondButton(false);
      }

    const showbutton = () =>{
        axios.post("http://localhost:3001/api/showbutton", {email})
        .then((response) => {
            console.log(response.data);
            setblockchainData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

    }

    const sendbutton = () =>{
        axios.post("http://localhost:3001/api/sendbutton", {email})
        .then((response) => {
            //console.log(response.data);
            setmychain_id(response.data.mychain_id);
            //console.log(mychain_id);
            setmyprevioushash(response.data.mychainhash);
          })
          .catch((error) => {
            console.log(error);
          });
          setIsFormVisible(true);
    }

    const blockButton = () =>{
      
      const mynewhash =  SHA256(
        mychain_id + // Include chainId in the hash calculation
        myprevioushash +
        date +
        recievermail +
        JSON.stringify(amount) +
        nonce
      ).toString();
      console.log(mynewhash);

      if(mynewhash){
        axios.post("http://localhost:3001/api/blocksendbutton", {mychain_id, recievermail, myprevioushash, mynewhash, email})
        .then((response) => {
          console.log(response.data);
          //setblockchainData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
        }

    }
    

      const renderForm = () => {
        return (
            <div >
            <label htmlFor="person">To:</label>
            <input
              type="text"
              id="person"
              name="person"
              required
              value={recievermail}
              onChange={(e) => setrecievermail(e.target.value)}
            />
            
            {isFormVisible && <Button onClick={blockButton}>Confirm</Button>}
          </div>
        );
      };


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
    <div className='digital-currency'>
        <Button onClick={getbutton}>Get</Button>
        {showSecondButton && (
        <Button onClick={handleSecondButtonClick}>confirm</Button>
      )}
     
        <Button onClick={showbutton}>show</Button><br />
        <div className='scrollstyle'>
        {/* Display the blockchain data as cards */}
        {blockchainData.map((data, index) => (
          
          <RenderBlockdata key={index} blockchainData={data} />
         
        ))}
        </div>
        <div>
      {/* Conditionally render the form or the button based on isFormVisible state */}
      {isFormVisible ? (
        renderForm()
      ) : (
        <Button onClick={sendbutton}>Send</Button>
        
      )}
    </div>
    </div>
  );
};

export default DigitalCurrency;