

import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./loginStyles.css";
import axios from "axios";
import firebase from './firebase';


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  
  
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setmessage] = useState("");

  const validateForm = () => {
    // Perform validation checks here
    let valid = true;

    setEmailError("");
    setPasswordError("");

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
    } 
    return valid;
  };

  const checklogin = () => {
    if (validateForm()) {
      
    axios.post("http://localhost:3001/api/checkmylogin", {email, password})
    .then((response) => {
      
      if(response.data.message === "proceed"){
        PhoneButton()
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
 

  const PhoneButton = () => {
    if (email) {
      axios
        .post("http://localhost:3001/api/phonebutton", {
          email: email,
        })
        .then((response) => {
          const phoneNumberFromAPI = response.data.myphone.phone;
          const formattedPhoneNumber = "+91" + phoneNumberFromAPI;
        setphonenumber(formattedPhoneNumber);
        
          configureCaptcha();
          sendOtp(formattedPhoneNumber);
          
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };
 
  
  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          
          console.log("Recaptcha verified");
        },
        defaultCountry: "IN",
      }
    );
  };
  
  const sendOtp = (phoneNumber) => {
   
    const appVerifier = window.recaptchaVerifier;
  
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent to your mobile");
        verifyOTP();
      })
      .catch((error) => {
        console.log("SMS not sent", error);
      });

  };
  
  const verifyOTP = () => {
    const enteredOTP = window.prompt('Please enter the OTP:');
    console.log(enteredOTP);
    window.confirmationResult
      .confirm(enteredOTP)
      .then((result) => {
        const user = result.user;
        console.log(JSON.stringify(user));
        axios.post("http://localhost:3001/api/login", {
      email: email,
      password: password,
    })
      .then((response) => {
        const userType = response.data.userType;
        const userstatus = response.data.status;
        localStorage.setItem("id",response.data.id)
        localStorage.setItem("name",response.data.name)
        localStorage.setItem("email",response.data.email)
       
        setEmail("");
        setPassword("");

       
        
          if (userType === "admin") {
            navigate('/admin');
          } else if(userType === "user"){
            if(userstatus === 0){
            navigate('/user');
          }
         else {
          alert("Your account is frozen by the authorities.");
        }
          }
      })
      .catch((error) => {
        alert(error.message);
      });
        alert('User is verified');
      })
      .catch((error) => {
        console.log("User couldn't sign in", error);
      });
  };

  
  return (
    <>
    <div class="alert alert-danger" role="alert">
       <p>{message}</p> <p>{emailError}</p><p>{passwordError}</p>
   </div>
    <div className="mycontainer">
      
      <div className="login-container">
        <h1>CBDP</h1>
        <form >
        <div id="sign-in-button"></div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" id="login" onClick={checklogin}>
            Login
          </button>
         
          <div className="new-user">
            <b>New user? </b>
            <Link to="/signup"><b>Sign Up</b></Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default LoginPage;
