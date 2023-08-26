import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';

function UserPage(){
    const [UserResult, setUserResult] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          
            axios
              .post("http://localhost:3001/api/userpage")
              .then((response) => {
               setUserResult(response.data.selResult);
               //console.log(response.data.selResult);
              })
              .catch((error) => {
                console.log(error);
              });
         
        };
      
        fetchData();
      }, []);

  return (
    <div className='user-page'>
        <div className='notification-space'>
         <table>
        <thead>
          <tr className="box">
            <th className="cell-spacing2">ID</th>
            <th className="cell-spacing2">Name</th>
            <th className="cell-spacing2">Email</th>
            <th className="cell-spacing2">Phone</th>
            <th className="cell-spacing2">Aadhar</th>
          </tr>
        </thead>
        <tbody>
          {UserResult.map((user) => (
            <tr className="box" key={user.id}>
              <td className="cell-spacing">{user.id}</td>
              <td className="cell-spacing">{user.name}</td>
              <td className="cell-spacing">{user.email}</td>
              <td className="cell-spacing">{user.phone}</td>
              <td className="cell-spacing">{user.aadhar}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default UserPage