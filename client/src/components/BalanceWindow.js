import { useState, useEffect } from "react";
import "./loginStyles.css";
import axios from "axios";


function BalanceWindow() {
  const [id, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");
  const [email, setemail] = useState("");
  const [Dbalance, setDbalance] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setId(storedId);
    const myemail = localStorage.getItem("email");
    setemail(myemail);
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .post("http://localhost:3001/api/balance", { email })
        .then((response) => {
          console.log(response.data);
          setBalance(response.data.myBal.bank_balance);
          setDbalance(response.data.myDBal.dmoney);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

 
 
  const GetButton = () =>{
    if(balance > amount){
      const newbankbalance = balance - Number(amount);
      const newdigitalbalance = Dbalance + Number(amount);
    
      axios
        .post("http://localhost:3001/api/newbalance", { email, password, newbankbalance, newdigitalbalance, amount })
        .then((response) => {
          console.log(response.data);
         setAmount("");
         setPassword("");
         setMessage(response.data.message);
        })
        .catch((error) => {
          console.log(error);
        
        });
      }
      else{
        setMessage("Not sufficient balance");
      }
    };
  

    return(

      
      <div className="background-container">
        
      <div className="balancepage">
        Your current bank balance is <h1><b> {balance} </b></h1><br/>
        Current digital money balance is <h1><b> {Dbalance} </b></h1> <br/>
        <div>Get digital money <span
            style={{
              display: "inline-block",
              padding: "0.25em 0.5em",
              borderRadius: "0.25rem",
              backgroundColor: "#7D6C74",
              color: "#fff",
            }}
          >
            now!
          </span>
          
        <div >
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div >
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
          <button type="button" id="currencybutton"  onClick={GetButton} >Get</button>
          {message && <p>{message}</p>}
        </div>
      </div>
      </div>
      
    )
}
export default BalanceWindow;