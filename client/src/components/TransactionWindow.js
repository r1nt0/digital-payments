import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

function TransactionWindow() {
    const [email, setemail] = useState("");
    const [recievedResults, setRecievedResults] = useState([]);
    const [sendResults, setSendResults] = useState([]);

    useEffect(() => {
        const myemail = localStorage.getItem("email");
        setemail(myemail);
    },[]);

    useEffect(() => {
      const fetchData = async () => {
        if (email) {
          axios
            .post("http://localhost:3001/api/transactionwindow", { email })
            .then((response) => {
              setRecievedResults(response.data.recieved);
              setSendResults(response.data.send);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      };
    
      fetchData();
    }, [email]);
    
    
function formatDateToIST(date) {
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return new Date(date).toLocaleString("en-IN", options);
}

    return(
        <div className="splitscreen">
            <div className="leftpane"><b>RECIEVED</b>
            <table>
        <thead>
          <tr className="box">
            <th className="cell-spacing">Sender</th>
            <th className="cell-spacing">Amount</th>
            <th className="cell-spacing">Date</th>
            <th className="cell-spacing">Time</th>
          </tr>
        </thead>
        <tbody>
        {recievedResults.map((transaction) => (
            <React.Fragment key={transaction.date}>
              <tr className="box">
                <td className="cell-spacing">{transaction.sender}</td>
                <td className="cell-spacing">{transaction.amount}</td>
                <td className="cell-spacing">{formatDateToIST(transaction.date)}</td>
              </tr>
              
            </React.Fragment>
          ))}
        </tbody>
      </table>
            </div>
            <div className="rightpane"><b>SEND</b>
            <table>
        <thead>
          <tr className="box">
            <th className="cell-spacing">Receiver</th>
            <th className="cell-spacing">Amount</th>
            <th className="cell-spacing">Date</th>
            <th className="cell-spacing">Time</th>
          </tr>
        </thead>
        <tbody>
          {sendResults.map((transaction) => (
            <React.Fragment key={transaction.date}>
            <tr className="box">
              <td className="cell-spacing">{transaction.reciever}</td>
              <td className="cell-spacing">{transaction.amount}</td>
              <td className="cell-spacing">{formatDateToIST(transaction.date)}</td>
            </tr>
            
            </React.Fragment>
          ))}
        </tbody>
      </table>
            </div>
        </div>
    )
}
export default TransactionWindow;