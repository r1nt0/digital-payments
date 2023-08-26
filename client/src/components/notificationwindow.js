import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Notificationwindow() {
    const [email, setemail] = useState("");
    const [allnotification, setallnotification] = useState([]);
    const [mynotification, setmynotification] = useState([]);

    useEffect(() => {
        const myemail = localStorage.getItem("email");
        setemail(myemail);
    },[]);

    useEffect(()=>{
        if(email){
        axios.post("http://localhost:3001/api/usernotification",{email})
        .then((response) => {
            console.log(response);
            setallnotification(response.data.allResults || []);
            setmynotification(response.data.myResults || []);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    },[email])

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
    <>
    <div className='notify'>
        <h2>All Notifications</h2>
    <table>
      
      <tbody>
        {allnotification.map((notification, index) => (
          <tr className="notify"key={index}>
            <td>{notification.notification}</td>
            <td className='dateof'>{formatDateToIST(notification.date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    <div className='notify'>
    <h2>My Notifications</h2>
    <table>
      
      <tbody>
        {mynotification.map((notification, index) => (
          <tr className="notify"key={index}>
            <td>{notification.notification}</td>
            <td className='dateof'>{formatDateToIST(notification.date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  )
}

export default Notificationwindow;