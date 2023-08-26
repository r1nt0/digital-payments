import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";

import ChequeCreation from "./ChequeCreation";
import ChequeExtraction from "./ChequeExtraction";

function ChequeWindow() {
  const [showUsersPage, setShowUsersPage] = useState(false);
  const [ShowExtractPage, setShowExtractPage] = useState(false);
  const [chequeData, setchequeData] = useState([]);
  const email = localStorage.getItem('email');

  const handleUserClick = () => {
    setShowUsersPage(true); // Show the UserPage component
  };

  const handleRemoveUserPage = () => {
    setShowUsersPage(false); // Remove the UserPage component
  };

  const handleExtractClick = () => {
    setShowExtractPage(true); // Show the UserPage component
  };

  const handleRemoveExtractPage = () => {
    setShowExtractPage(false); // Remove the UserPage component
  };

  useEffect(() => {
    if (email) {
    axios.post("http://localhost:3001/api/chequedata",{email})
    .then((response) => {
      console.log(response.data);
      setchequeData(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }
}, [email]);

const RenderBlockdata =({chequeData}) => {
  return (
    <div className="card mb-3" style={{ width: '36rem' }}>
      <div className="card-container  d-flex flex-wrap">
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">Cheque No: {chequeData.cheque_number}</h5>
        
        <p className="card-text">Date: {chequeData.date}</p>
        <p className="card-text">Amount: {JSON.stringify(chequeData.amount)}</p>
        <p className="card-text">Reciever: {chequeData.reciever}</p>
      </div>
      </div>
    </div>
  );
}

  return (
    <div className="split">
      <div className="leftside">
        <button id="myb" onClick={handleUserClick}>Create New</button>
        <button id="myb" onClick={handleExtractClick}>Extract</button>
      </div>
      {showUsersPage && (
        <div>
          <ChequeCreation />
          <button className="butto" onClick={handleRemoveUserPage}>X</button>
        </div>
      )}
      {ShowExtractPage && (
        <div>
          <ChequeExtraction />
          <button className="butto" onClick={handleRemoveExtractPage}>X</button>
        </div>
      )}
      <div className="leftalign">Cheque History
      {chequeData.map((data) => (
          
          <RenderBlockdata  chequeData={data} />
         
        ))}
      </div>
    </div>
  );
}

export default ChequeWindow;
