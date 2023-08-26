import axios from "axios";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { createCanvas, loadImage, registerFont } from "canvas";
import bcrypt from "bcryptjs";
import qrcode from "qrcode";
//const crypto = require('node:crypto');

//import NodeRSA from "node-rsa";
// Rest of the code...




function ChequeCreation(){
    const [amount, setAmount] = useState("");
     const [password, setPassword] = useState("");
     const [reciever, setreciever] = useState("");
     const [message, setMessage] = useState("");
     const [generatedNumbers, setGeneratedNumbers] = useState([]);
     const [Dbalance, setDbalance] = useState("");

     const myemail = localStorage.getItem("email");
     const currentDate = new Date();
     const formattedDate = currentDate.toLocaleDateString('en-GB');

     useEffect(() => {
        if (myemail) {
          axios
            .post("http://localhost:3001/api/chequebalance", { myemail})
            .then((response) => {
             // console.log(response.data);
              
              setDbalance(response.data.DBal.dmoney);
              
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }, [myemail]);

     const generateUniqueNumber = () => {
        let randomNumber;
        do {
          randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
        } while (generatedNumbers.includes(randomNumber));
    
        setGeneratedNumbers((prevNumbers) => [...prevNumbers, randomNumber]);
        return randomNumber;
      };
    
      const SubmitButton = () => {
        if(Dbalance >= amount){
        const nextNumber = generateUniqueNumber();
        setMessage(`Cheque Number: ${nextNumber}`);
       // console.log(formattedDate);

        generateDigitalSignature(myemail, reciever, nextNumber.toString(), amount);
    
  
    async function generateDigitalSignature(senderName, receiverName, chequeNumber, amount) {
      // Combine the data into a single string
      const dataString = `${senderName},${receiverName},${chequeNumber},${amount}`;
        console.log(dataString);
  
      // Generate the digital signature using bcrypt (async version)
     const signature = await bcrypt.hash(dataString, 10);
     console.log(signature);

       // Generate the QR code with the data and digital signature
  const qrCodeText = `${dataString}|${signature}`;
  

  // Create the QR code image as a data URL
  const qrCodeDataURL = await qrcode.toDataURL(qrCodeText);
  
  
      // Create a new canvas
      const canvas = createCanvas(1000, 400);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const qrCodeImage = await loadImage(qrCodeDataURL);

  // Draw the QR code image on the canvas
  ctx.drawImage(qrCodeImage, 670, 130);

  
      // Draw the text on the canvas
      ctx.font = "40px registerFont";
      ctx.fillStyle = 'black';
      
      ctx.fillText(`Date: ${formattedDate}`, 650, 30);
      ctx.fillText(`Cheque Number: ${chequeNumber}`, 10, 40);
      ctx.fillText(`Sender: ${senderName}`, 10, 100);
      ctx.fillText(`Receiver: ${receiverName}`, 10, 170);
      
      ctx.fillText(`Amount: ${amount}`, 120, 350);
     
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL();
  
      // Convert the data URL to a Blob
      const blob = await (await fetch(dataURL)).blob();
  
      // Save the Blob as a file using FileSaver.js
      saveAs(blob, `${receiverName}.png`);
  
     // console.log("Digital signature image created: cheque.png");
    }
  

        axios.post("http://localhost:3001/api/chequecreation",{nextNumber, myemail, reciever, amount, formattedDate, password})
        .then((response)=>{
            console.log(response);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    else{
        setMessage("not sufficient balance");
    }
      };
    
      
    return(
        <div className="chequecreation">
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
            <label htmlFor="amount">Reciever:</label>
            <input
              type="text"
              id="reciever"
              name="reciever"
              required
              value={reciever}
              onChange={(e) => setreciever(e.target.value)}
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
          <button type="button" id="Submitbutton"  onClick={SubmitButton} >Get</button>
          {message && <p>{message}</p>}
        </div>
    )
}
export default ChequeCreation