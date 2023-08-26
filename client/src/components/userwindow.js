import ListGroup from "./listgroup";
import "./loginStyles.css";
import MyCarousel from "./carousal";
import MyIcon from "./pictures/box-arrow-right.svg";
import CashIcon from "./pictures/cash.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import DigitalCurrency from "./DigitalCurrency";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function UserWindow() {

  const [id, setId] = useState('');
  const [name, setname] = useState('');
  const [showCurrencyPage, setCurrencyPage] = useState(false);
  const navigate = useNavigate();

  const handleCurrencyClick = () => {
    setCurrencyPage(true); // Show the AnotherPage component
  };
  const handleRemoveCurrencyPage = () => {
      setCurrencyPage(false); // Remove the AnotherPage component
    };


  useEffect(() => {
    // Retrieve the id from local storage
    const storedId = localStorage.getItem('id');
    setId(storedId);

    const storedname = localStorage.getItem('name');
    setname(storedname);
  }, []);

  const handleLogout = () =>{

    navigate('/', { replace: true });
  }
 

  return (
    <>
   
    <button className="digi-button" onClick={handleCurrencyClick}>Block Money</button>
          {showCurrencyPage && (
        <div>
          <DigitalCurrency />
          <Button className="butto"onClick={handleRemoveCurrencyPage}>X</Button>
        </div>
      )} 
     
      <div className="mytext">
        <span id="cb">CENTRAL BANK</span>
        <span id="dc">
          <p>
            Digital Payments <img src={CashIcon} alt="Cash Icon" />
          </p>
        </span>
        
      
      </div>
      <div className="white">
        <div className="list-g">
          <ListGroup />
         
        </div>
        <div className="caro">
          <MyCarousel />
        </div>
      
        <div className="logout">
          <p>
          {name}<br/>
            ID : {id}<br/>
          <Button onClick={handleLogout}> Log Out <img src={MyIcon} alt="Logout Icon" /></Button> 
          </p>
         
        </div>
      </div>
      
    </>
  );
}

export default UserWindow;
