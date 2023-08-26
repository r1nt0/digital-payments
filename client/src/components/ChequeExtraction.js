import React, { useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import bcrypt from 'bcryptjs';
import axios from 'axios';

function ChequeExtraction() {

  const mymail = localStorage.getItem("email");

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'image/png') {
      setSelectedFile(file);
      processImage(file);
    }
  };

  const processImage = async (file) => {
    const imageData = await readFileAsDataURL(file);
    const qrCode = await decodeQRCode(imageData);
    

    if (qrCode) {
      const qrCodeText = qrCode.getText();
     
      const [dataString, signature] = qrCodeText.split('|');
      console.log(dataString);
      const CreatedSignature = await bcrypt.hash(dataString, 10);
      console.log(CreatedSignature);

      bcrypt.compare(signature, CreatedSignature, (err, result) => {
        if (err) {
          console.log(err);
        } else if (result) {
          // Hashes match
          console.log('Hashes match');
        } else {
          // Hashes do not match
          console.log('Hashes do not match');
        }
      });

      const [senderName, receiverName, chequeNumber, amount] = dataString.split(',');

      console.log('Sender Name:', senderName);
      console.log('Receiver Name:', receiverName);
      console.log('Cheque Number:', chequeNumber);
      console.log('Amount:', amount);
      console.log('Digital Signature:', signature);

      if(chequeNumber){
      axios.post("http://localhost:3001/api/chequeentry",{senderName, chequeNumber, amount, mymail})
      .then((response) => {
         setMessage(response.data.message);
       })
       .catch((error) => {
         console.log(error);
       });
      }
    } else {
      console.log('QR code not found');
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (event) => {
        reject(event.target.error);
      };

      reader.readAsDataURL(file);
    });
  };

  const decodeQRCode = (imageData) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const barcodeReader = new BrowserQRCodeReader();
        barcodeReader
          .decodeFromImageElement(img)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      };

      img.onerror = (event) => {
        reject(event);
      };

      img.src = imageData;
    });
  };

  return (
    <div className='ChequeExtraction'>
      <div className='middle'>
        <input type='file' accept='image/png' onChange={handleFileChange} />
        <br />
        {message}
      </div>
    </div>
  );
}

export default ChequeExtraction;
