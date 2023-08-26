import { useState , useEffect} from "react";
import axios from "axios";


function TransferWindow() {

    const [email, setemail] = useState("");
    const [Dbalance, setDbalance] = useState("");
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [password, setPassword] = useState("");
    const [recievermail, setrecievermail] = useState("");
   

    useEffect(() => {
        const myemail = localStorage.getItem("email");
        setemail(myemail);
    },[]);

    useEffect(() => {
      if (email) {
        axios
          .post("http://localhost:3001/api/twindow", { email})
          .then((response) => {
           // console.log(response.data);
            
            setDbalance(response.data.DBal.dmoney);
            
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, [email]);

   

    const SendButton = () =>{
      if (email) {
        if(Dbalance > amount)
        {
         
         axios
          .post("http://localhost:3001/api/twindowsend", { email, recievermail, amount })
          .then((response) => {
             console.log(response.data);
             setMessage(response.data.message);
          })
          .catch((error) => {
            console.log(error);
          });
        }
        else{
          setMessage("Not sufficient balance");
        }
      }
     
    }

    

    return(
        <div className="transfer-container">
        <div className="transferpage">
       
        Current digital money balance is <h1><b> {Dbalance} </b></h1> <br/>
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
          </div>
       
          
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
          <button type="button" id="currencybutton"  onClick={SendButton} >Send</button>
          {message && <p>{message}</p>}
        
      </div>
      </div>
    )
}
export default TransferWindow;