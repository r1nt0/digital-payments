import React, { useState } from "react";
import "./loginStyles.css";
import Axios from "axios";
import MyComponent from "./thumbsup";
import CountUpAnimation from "./counterup";
import wallet from "./pictures/wallet.svg";
import happyface from "./pictures/emoji-smile.svg"
import axios from "axios";


function SignupPage() {

  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aadhar, setaadhar] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [message, setmessage] = useState("");

  const validateForm = () => {
    // Perform validation checks here
    let valid = true;
    

    // Reset error messages
    setNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    setAadharError("");


    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    }

    if (!phone.trim()) {
      setPhoneError("Phone is required");
      valid = false;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError("Phone should be a 10-digit number");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.trim().length < 3) {
      setPasswordError("Password should be at least 3 characters long");
      valid = false;
    }

    if (!aadhar.trim()) {
      setAadharError("Aadhar is required");
      valid = false;
    } else if (!/^[0-9]{12}$/.test(aadhar)) {
      setAadharError("Aadhar should be a 12 digit number");
      valid = false;
    }

    return valid;
  };

  const checkinsert = () => {
    if (validateForm()) {
    axios.post("http://localhost:3001/api/checkinsert", {email, phone})
    .then((response) => {
      
      if(response.data.message === "proceed"){
        submitButton()
        setmessage("");
      }
      else{
      setmessage(response.data.message);
      
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  }

  const submitButton = () => {
    
    Axios.post("http://localhost:3001/api/insert", {
      name: name,
      phone: phone,
      email: email,
      password: password,
      aadhar: aadhar
    })
      .then(() => {
        alert("Successful Insert");
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setaadhar("");
      })
      .catch((error) => {
        alert(error);
      });
    
  };

  return (
    <div className="container2">
      <div className="signup-container">
        <h2>
          <p>A new way to make payments</p>Join
          <span
            style={{
              display: "inline-block",
              padding: "0.25em 0.5em",
              borderRadius: "0.25rem",
              backgroundColor: "#6c757d",
              color: "#fff",
            }}
          >
            now!
          </span>
        </h2>
        
        <form >
          <p>{message}</p>
        {nameError && <small className="error-text">{nameError}</small>}
        <div className="form-group2">
       
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name" // Added name attribute
              value={name}
             
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
           
          </div>
          {phoneError && <small className="error-text">{phoneError}</small>}
          <div className="form-group2">
         
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel" // Changed to tel input type
              id="phone"
              name="phone" // Added name attribute
              value={phone}
              
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            
          </div>
          {emailError && <small className="error-text">{emailError}</small>}
        <div className="form-group2">
        
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            
            value={email}
           
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          
        </div>
        {passwordError && <small className="error-text">{passwordError}</small>}
        <div className="form-group2">
        
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="pass"
            name="pass"
            
            value={password}
           
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          
        </div>
        {aadharError && <small className="error-text">{aadharError}</small>}
        <div className="form-group2">
        
          <label htmlFor="aadhar">Aadhar:</label>
          <input
            type="number"
            id="aadh"
            name="aadh"
            
            value={aadhar}
            
            onChange={(e) => {
              setaadhar(e.target.value);
            }}
          />
         
        </div>
        </form>
        
        <div className="woman">
            <MyComponent />
        </div>
        <div className="customers">
          <div>
          <p> <img src={happyface} alt="happy"/><br/>
          <CountUpAnimation endValue={1000} duration={7000} /> K+ <br/> happy <br/> customers
          </p>
          </div>
        </div>
        <div className="transaction">
          <div>
          <p><img src={wallet} alt="walle"/><br/>
          <CountUpAnimation endValue={21000} duration={8000} /> K+ <br/> transactions 
          </p>
          </div>
        </div>

        <button type="submit" id="submit" onClick={checkinsert}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
