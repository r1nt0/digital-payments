import React, { useState } from 'react'
import axios from 'axios';


function Anotherpage(){
    const [notification, setnotification] = useState("");
    const [recievermail, setrecievermail] = useState("");
    const [message, setmessage] = useState("");

    const SendButton = () =>{
        
          if (recievermail) {
            axios
              .post("http://localhost:3001/api/mynotify", { recievermail, notification })
              .then((response) => {
                setmessage(response.data.message);
               setnotification("");
               setrecievermail("");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        };
      

  return (
    <div className='another'>
        <div className='notificationspace'>
        <label htmlFor="person">message:</label>
        <input
              type="text"
              id="mynotification"
              name="mynotification"
              required
              value={notification}
              onChange={(e) => setnotification(e.target.value)}
            />
        </div>
        <div className='notificationspace'>
        <label htmlFor="person">To:</label>
        <input
          type="text"
          id="toperson"
          name="toperson"
          required
          value={recievermail}
          onChange={(e) => setrecievermail(e.target.value)}
            />
          </div>
          <button type="button" id="sendbutton" onClick={SendButton} >Send</button>
          {message && <p>{message}</p>}
    </div>
  )
}

export default Anotherpage;