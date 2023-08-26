import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function SearchResultsPage ({searchValue}) {
    const [Dbalance, setDbalance] = useState("");
    const [recievedResults, setRecievedResults] = useState([]);
    const [sendResults, setSendResults] = useState([]);
    const [buttonText, setButtonText] = useState('Freeze Account');
    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        // Add your API call to retrieve the account status here
        axios.get("http://localhost:3001/api/checkAccountStatus")
          .then((response) => {
            const { accountFrozen } = response.data; // Assuming the response contains a property indicating the account status
            setButtonClicked(accountFrozen); // Set the button state based on the retrieved account status
            setButtonText(accountFrozen ? 'Account Frozen' : 'Freeze Account'); // Set the button text accordingly
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
  
    const handleClick = () => {
      if (!buttonClicked) {
        setButtonText('Account Frozen');
        setButtonClicked(true);
        // Perform additional actions or logic here
        axios.post("http://localhost:3001/api/freeze" , {searchValue})
        .then((response) => {
           
         })
         .catch((error) => {
           console.log(error);
         });
      }else {
        setButtonText('Freeze Account');
        setButtonClicked(false);
        // Perform additional actions or logic here
        axios.post("http://localhost:3001/api/defroze" , {searchValue})
        .then((response) => {
           
         })
         .catch((error) => {
           console.log(error);
         });
      }
    };
   
    useEffect(() => {
       if(searchValue){
          axios
            .post("http://localhost:3001/api/search", { searchValue })
            .then((response) => {
              console.log(response.data);
              setDbalance(response.data.myDBal.dmoney)
              
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }, [searchValue]);

      useEffect(() => {
        const fetchData = async () => {
          if (searchValue) {
            axios
              .post("http://localhost:3001/api/searchwindow", { searchValue })
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
      }, [searchValue]);
      
      
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
  

  return (
    
    <div className='search-page'>
      <div className='scrollstyle'>
        <div>
            Digital Balance : {Dbalance}
        <button onClick={handleClick}>{buttonText}</button>
        </div>
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
    </div>
    </div>
  )
}

export default SearchResultsPage