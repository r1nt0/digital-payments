const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const cookieParser = require('cookie-parser');


const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client's origin
  //credentials: true, // Enable sending cookies (session)
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use (cookieParser());

const creditstr = `credited to your account`;
const debitstr = `debited from your account`;
const insertnotification = "INSERT INTO notification (notification, email) VALUES (?, ?)";

app.post("/api/checkinsert", (req, res) => {
  const {email, phone} = req.body;
  const checkemail = "SELECT * FROM user WHERE email = ?";
  const checkphone = "SELECT * FROM user WHERE phone = ?";
  db.query(checkemail, [email], (err, emailresult) => {
    if(err){
      console.log(err);
    }
    else {
      if(emailresult.length > 0){
        res.json({message: "User exists with that email"});
      }
      else{
        db.query(checkphone, [phone], (err, phoner) => {
          if(err){
            console.log(err);
          }
          else {
            if(phoner.length > 0){
              res.json({message: "User exists with that phone"});
            }
            else{
              res.json({message: "proceed"});
            }
          }
        })
      }
    }
  })
  
})

app.post("/api/insert", (req, res) => {
  const { name, phone, email, password, aadhar } = req.body;
  const sqlInsertUser = "INSERT INTO user (name, phone, email, password, aadhar) VALUES (?, ?, ?, ?, ?)";
  const sqlInsertBalance = "INSERT INTO balance_table (name, email) VALUES (?, ?)";
  const sqlblockinsert = "INSERT INTO blockmoney (email) VALUES (?)";

  db.query(sqlInsertUser, [name, phone, email, password, aadhar], (err, userResult) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'An error occurred while inserting into user table' });
    } else {
      db.query(sqlInsertBalance, [name, email], (err, balanceResult) => {
        if (err) {
          console.log(err);
          res.status(500).json({ success: false, message: 'An error occurred while inserting into balance_table' });
        } else {
          res.status(200).json({ success: true, message: 'Insertion successful' });
        }
        db.query(sqlblockinsert, [email], (err, insresult) => {
          if(err){
            console.log(err);
          }
        })
      });
    }
  });
});

app.post("/api/checkmylogin", (req, res) => {
  const {email, password} = req.body;
  const verifyemail = "SELECT * FROM user WHERE email = ?";
  db.query(verifyemail, [email], (err, verifyresult) => {
    if(err){
      console.log(err);
    }
   
      if(verifyresult.length === 0){
     
        res.json({message: "no user by that email"});
      }
    
      else{
        if(verifyresult.length > 0){
          if(verifyresult[0].password !== password){
            res.json({message: "Password does not match"});
          }
          else{
            res.json({message: "proceed"});
          }
        }
      }
    
  })
})

app.post("/api/phonebutton", (req, res) =>{
  const {email} = req.body;
  const phonequery = "SELECT phone FROM user WHERE email = ?";
  db.query(phonequery, [email], (err, phoneresults) => {
    if(err){
      console.log(err);
    }
    else{
      const myphone = phoneresults.length > 0 ? phoneresults[0] : null;

    const response = { myphone: myphone,
    };
    res.json(response);
    }
  })
})


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM user WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      if (results.length > 0) {
        const userType = results[0].utype;
        const id = results[0].id;
        const name = results[0].name;
        const status = results[0].status;
        const email = results[0].email;
        if (userType === "user") {
          res.json({ userType: "user", results: results, id: id ,name: name, status: status, email: email});
        } else if (userType === "admin") {
          res.json({ userType: "admin", results: results });
        }
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  });
});

app.post("/api/balance", (req, res) => {
  const { email } = req.body;
  const queryBal = "SELECT bank_balance FROM user WHERE email = ?";
  const queryDBal = "SELECT dmoney from balance_table WHERE email = ?";

  db.query(queryBal, [email], (err, balanceResults) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    db.query(queryDBal, [email], (err, dbalanceResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const myBal = balanceResults.length > 0 ? balanceResults[0] : null;
      const myDBal = dbalanceResults.length > 0 ? dbalanceResults[0] : null;

      const response = {
        myBal: myBal,
        myDBal: myDBal,
      };

      res.json(response);
    });
  });
});

app.post("/api/newbalance", (req, res) => {
  const { email,password, newbankbalance, newdigitalbalance,amount } = req.body;
  const queryauth = "SELECT * FROM user WHERE email = ? AND password = ?";
  db.query(queryauth, [email, password], (err, results)=>{
    if(err){
      console.log(err);
      
    }
    if(results.length > 0){

   
  const querybalance1 = "UPDATE user SET bank_balance = ? WHERE email = ?";
  const querybalance2 = "UPDATE balance_table SET dmoney = ? WHERE balance_table.email = ?";
  
  const notifystring = `${amount} ${creditstr}`;
  db.query(insertnotification, [notifystring, email], (err, noresult) => {
    if(err){
      console.log(err);
    }
  })
  db.query(querybalance1,[newbankbalance, email],(err, result) =>{
    if(err){
      console.log(err);
    }
    db.query(querybalance2, [newdigitalbalance, email], (err, res2) => {
      if(err){
        console.log(err);
      }
      res.json({ message: "Balance updated successfully" });
    });
  });
}
else{
  res.json({message: "wrong password"});
}
});
});

app.post("/api/twindow", (req, res) => {
  const { email } = req.body;
  const query4 = "SELECT dmoney from balance_table WHERE email = ?";

  db.query(query4, [email], (err, dbalanceResults) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const DBal = dbalanceResults.length > 0 ? dbalanceResults[0] : null;

    const response = { DBal: DBal,
    };
    res.json(response);
  });
});

app.post("/api/twindowsend",(req, res) => {

  const {email, recievermail, amount} = req.body;
  const query6 = "SELECT * from user WHERE email = ?";
  const query8 = "UPDATE balance_table SET dmoney = dmoney - ? WHERE balance_table.email = ?";
  const query9 = "UPDATE balance_table SET dmoney = dmoney + ? WHERE balance_table.email = ?";
  const query10 = "INSERT INTO transaction (sender, reciever, amount) VALUES (?, ?, ?)";
  const notifystring = `${amount} ${creditstr}`;
  const dnotify = `${amount} ${debitstr}`;

  db.query(query6, [recievermail], (err, reciverDetails) => {
    if(err){
      console.log(err);
    }
    else{
      if(reciverDetails.length > 0) {
        
        db.query(query8, [amount, email],(err, sender) => {
          if(err){
            console.log(err);
          }
        
        db.query(query9, [amount, recievermail], (err,recieverbalance) => {
          if(err){
            console.log(err);
          }
        db.query(query10, [email, recievermail, amount], (err, tResults) => {
          if(err){
            console.log(err);
          }
          
          else{
            db.query(insertnotification, [notifystring, recievermail], (err, noresult) => {
              if(err){
                console.log(err);
              }
            })
            db.query(insertnotification, [dnotify,email], (err, noresult) => {
              if(err){
                console.log(err);
              }
            })
            res.json({message: "successfully transfered"});
          }
        })
        })
      })
     
      }
      else{
        res.json({message: "No user by that email"});
      }
    }
  })
})

app.post("/api/transactionwindow", (req, res) => {
  const {email} = req.body;
  const query11 = "SELECT sender, amount, date FROM transaction WHERE reciever = ?";
  const query12 = "SELECT reciever, amount, date FROM transaction WHERE sender = ?";
  db.query(query11, [email], (err,recievedResults) => {
    if(err){
      console.log(err);
    }
   
    db.query(query12, [email], (err,sendResults) => {
      if(err){
        console.log(err);
      }
      
        const response = {
          recieved: recievedResults,
          send: sendResults,
        }
        res.status(200).json(response);
      
    })
  })
})

app.post("/api/usernotification",(req, res) => {
  const {email} = req.body;
  const query13 = "SELECT notification, date from notification WHERE email = 'all' ORDER BY date desc";
  const query14 = "SELECT notification, date from notification WHERE email = ? ORDER BY date desc";
  db.query(query13, (err,allResults) =>{
    if(err){
      console.log(err);
    }
   
    db.query(query14, [email], (err, myResults) => {
      if(err){
        console.log(err);
      }
      else{
        //console.log(myResults);
        res.json({ allResults, myResults });
      }
    })
  })
})

app.post("/api/mynotify", (req, res) => {
  const { notification, recievermail } = req.body;
  const insertnotify = "INSERT INTO notification (notification, email) VALUES (?, ?)";
  

  db.query(insertnotify, [notification, recievermail], (err, notifyResult) => {
    if (err) {
      console.log(err);
    }
    else{
      res.json({ message: "successfully sended" });
    }
  })
})

app.post("/api/userpage", (req, res) => {
  const selectuser = "SELECT id, name, email, phone, aadhar from user WHERE utype = 'user'";
  db.query(selectuser, (err, selResult) => {
    if(err){
      console.log(err);
    }
    else{
      //console.log(selResult);
      res.json({selResult});
    }
  })
})

app.post("/api/search", (req, res) => {
  const { searchValue } = req.body;
  
  const queryDBal = "SELECT dmoney from balance_table WHERE email = ?";

    db.query(queryDBal, [searchValue], (err, dbalanceResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const myDBal = dbalanceResults.length > 0 ? dbalanceResults[0] : null;

      const response = {
        myDBal: myDBal,
      };

      res.json(response);
    });
  });

  app.post("/api/searchwindow", (req, res) => {
    const {searchValue} = req.body;
    const query11 = "SELECT sender, amount, date FROM transaction WHERE reciever = ?";
    const query12 = "SELECT reciever, amount, date FROM transaction WHERE sender = ?";
    db.query(query11, [searchValue], (err,recievedResults) => {
      if(err){
        console.log(err);
      }
     
      db.query(query12, [searchValue], (err,sendResults) => {
        if(err){
          console.log(err);
        }
        
          const response = {
            recieved: recievedResults,
            send: sendResults,
          }
          res.status(200).json(response);
        
      })
    })
  })

  app.get("/api/checkAccountStatus", (req, res) => {
    // Retrieve the account status based on the search value or any other criteria
    const { searchValue } = req.body;
    
    // Assuming you have a database table called "users" with a "status" column
    const checkAccountStatusQuery = "SELECT * FROM user WHERE email = ?";
    
    db.query(checkAccountStatusQuery, [searchValue], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (result.length > 0) {
          const accountStatus = result[0].status;
          res.status(200).json({ accountFrozen: accountStatus === 1 });
        } else {
          res.status(404).json({ error: "Account not found" });
        }
      }
    });
  });

  app.post("/api/freeze",(req, res) => {
    const {searchValue} = req.body;
    const freeze = "UPDATE user SET status = 1 WHERE email = ?";
    db.query(freeze, [searchValue], (err, freezeResult) => {
      if(err){
        console.log(err);
      }
    })
  })

  app.post("/api/defroze",(req, res) => {
    const {searchValue} = req.body;
    const defroze = "UPDATE user SET status = 0 WHERE email = ?";
    db.query(defroze, [searchValue], (err, defrozeResult) => {
      if(err){
        console.log(err);
      }
    })
  })

  app.post("/api/chequebalance", (req, res) => {
    const { myemail } = req.body;
    const query4 = "SELECT dmoney from balance_table WHERE email = ?";
  
    db.query(query4, [myemail], (err, dbalanceResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const DBal = dbalanceResults.length > 0 ? dbalanceResults[0] : null;
  
      const response = { DBal: DBal,
      };
      res.json(response);
    });
  });

  app.post("/api/chequecreation", (req, res) =>{
    const {nextNumber , myemail, reciever, amount, formattedDate, password} = req.body;
    const queryauth = "SELECT * FROM user WHERE email = ? AND password = ?";
    db.query(queryauth, [myemail, password], (err, results)=>{
      if(err){
        console.log(err);
        
      }
      if(results.length > 0){
    const updatebalance = "UPDATE balance_table SET dmoney = dmoney - ? WHERE balance_table.email = ?"
    const chequequery = "INSERT INTO cheque (cheque_number, sender, reciever, amount, date) VALUES (?, ?, ?, ?, ?)";
    
    const dnotify = `${amount} ${debitstr}`;
    db.query(chequequery, [nextNumber, myemail, reciever, amount, formattedDate], (err, chequeResults) => {
      if(err){
        console.log(err);
      }
      db.query(updatebalance, [amount, myemail], (err,updateresults)=>{
        if(err){
          console.log(err);
        }
      })
    })
    db.query(insertnotification, [dnotify,myemail], (err, noresult) => {
      if(err){
        console.log(err);
      }
    })
  }

})
  })

app.post("/api/chequeentry", (req, res) =>{
  const {senderName, chequeNumber, amount, mymail} = req.body;
  const getcheque = "SELECT * FROM cheque WHERE cheque_number = ?";
  const getmoney = "UPDATE balance_table SET dmoney = dmoney + ? WHERE balance_table.email = ?";
  const insertdetails = "INSERT INTO transaction (sender, reciever, amount) VALUES (?, ?, ?)";
  const changestatus = "UPDATE cheque SET status = 1 WHERE cheque_number = ?";
  const notifystring = `${amount} ${creditstr}`;

  db.query(getcheque, [chequeNumber], (err, cheqResults) => {
    if(err){
      console.log(err);
    }
    if(cheqResults.length > 0){
      //console.log(cheqResults);
      
      const verifyreciever = cheqResults[0].reciever;
      
      const verifystatus = cheqResults[0].status;

      if(verifystatus === 0){
          if(verifyreciever === mymail){
              db.query(getmoney, [amount, mymail], (err, moneyresults) =>{
                if(err){
                  console.log(err);
                }
                db.query(insertdetails, [senderName, mymail, amount], (err, transactionresults) => {
                  if(err){
                    console.log(err);
                  }
                  db.query(changestatus, [chequeNumber], (err, statusresults) => {
                      if(err){
                        console.log(err);
                      }
                      else{
                        db.query(insertnotification, [notifystring,mymail], (err, noresult) => {
                          if(err){
                            console.log(err);
                          }
                        })
                        res.json({message:"successfully extracted cheque"});
                      }
                  })
                  
                })
              })
          }
          else{
            res.json({message: "the cheque is not for you"});
          }
      }
      else{
        res.json({message: "the cheque is already used"});
      }
    }
    else{
      res.json({message: "Cheque not found"});
    }
  })
})

app.post("/api/chequedata", (req, res) => {
  const {email} = req.body;
  const showcheque = "SELECT cheque_number, reciever, amount, date FROM cheque WHERE sender = ?";
  db.query(showcheque, [email], (err, mychequeresult) => {
    if(err){
      console.log(err);
    }
    else{
      //console.log(mychequeresult);
      res.json(mychequeresult);
    }
  })
})

app.post("/api/newblockchain", (req, res) => {
  const {chainId, currentHash} = req.body;
  
  const blockchainvalues = "INSERT INTO blockchain (chain_id, current_hash) VALUES(?, ?)";
  db.query(blockchainvalues, [chainId, currentHash], (err, blockresults) => {
    if(err){
      console.log(err);
    }
  })
})

app.post("/api/blockdata", (req, res) => {
  const showblockdata = "SELECT * FROM blockchain WHERE previous_hash = 0";
  db.query(showblockdata, (err, blockdata) => {
    if(err){
      console.log(err);
    }
    else{
      //console.log(blockdata);
      res.json(blockdata);
    }
  })
})

app.post("/api/getbutton", (req, res) => {
  const showblockdata = "SELECT DISTINCT * FROM blockchain WHERE current_owner = 'central-bank' AND status = 0";
  db.query(showblockdata, (err, blockdata) => {
    if(err){
      console.log(err);
    }
    else{
      if(blockdata.length > 0){
      const chain_id = blockdata[0].chain_id;
      const chainhash = blockdata[0].current_hash;
      res.json({chain_id: chain_id, chainhash: chainhash});
      }
    }
  })
})

app.post("/api/confirmbutton", (req, res) => {
  const {chain_id, email, previoushash, newhash} = req.body;
  //const status = 1;
  const amount = 1000;
  const blockchainvalues = "INSERT INTO blockchain (chain_id, current_owner, previous_hash, current_hash) VALUES(?, ?, ?, ?)";
  const updatetable = "UPDATE blockchain SET status = 1 WHERE chain_id = ? AND current_owner = 'central-bank'";
  
  const notifystring = `${amount} ${creditstr}`;

  db.query(blockchainvalues, [chain_id, email, previoushash, newhash], (err, blockinsertresults) => {
    if(err){
      console.log(err);
    }
  })
  db.query(updatetable, [chain_id], (err, updresults) => {
    if(err){
      console.log(err);
    }
  })
  db.query(insertnotification, [notifystring,email], (err, noresult) => {
    if(err){
      console.log(err);
    }
  })
})

app.post("/api/showbutton", (req, res) => {
  const {email} = req.body;
  const showblockdata = "SELECT * FROM blockchain WHERE current_owner = ? AND status = 0";
  db.query(showblockdata, [email], (err, blockdata) => {
    if(err){
      console.log(err);
    }
    else{
      //console.log(blockdata);
      res.json(blockdata);
    }
  })
})

app.post("/api/sendbutton", (req, res) => {
  const {email} = req.body;
  const sendblockdata = "SELECT DISTINCT * FROM blockchain WHERE current_owner = ? AND status = 0";
  db.query(sendblockdata, [email], (err, myblockdata) => {
    if(err){
      console.log(err);
    }
    else{
      //console.log(blockdata[0]);
      const mychain_id = myblockdata[0].chain_id;
      const mychainhash = myblockdata[0].current_hash;
      res.json({mychain_id: mychain_id, mychainhash: mychainhash});
    }
  })
})

app.post("/api/blocksendbutton", (req, res) => {
  const {mychain_id, recievermail, myprevioushash, mynewhash, email} = req.body;
  const amount = 1000;

  const sendblockchainvalues = "INSERT INTO blockchain (chain_id, current_owner, previous_hash, current_hash) VALUES(?, ?, ?, ?)";
  const sendupdatetable = "UPDATE blockchain SET status = 1 WHERE chain_id = ? AND current_owner = ?";
  const sendrecieverbalance = "UPDATE balance_table SET dmoney = dmoney + 1000 WHERE balance_table.email = ?";
  const sendmybalance = "UPDATE balance_table SET dmoney = dmoney - 1000 WHERE balance_table.email = ?";
  const tquery = "INSERT INTO transaction (sender, reciever, amount) VALUES (?, ?, ?)";
  const notifystring = `${amount} ${creditstr}`;
  const dnotify = `${amount} ${debitstr}`;
  
  db.query(sendblockchainvalues, [mychain_id, recievermail, myprevioushash, mynewhash], (err, blockinsertresults) => {
    if(err){
      console.log(err);
    }
  })
  db.query(sendupdatetable, [mychain_id, email], (err, updresults) => {
    if(err){
      console.log(err);
    }
  })
  db.query(sendrecieverbalance, [recievermail], (err, blockbal) => {
    if(err){
      console.log(err);
    }
  })
  db.query(sendmybalance, [email], (err, blockbal) => {
    if(err){
      console.log(err);
    }
  })
  db.query(tquery, [email, recievermail, amount], (err, tqueryresults) =>{
    if(err){
      console.log(err);
    }
  })
  db.query(insertnotification, [dnotify,email], (err, noresult) => {
    if(err){
      console.log(err);
    }
  })
  db.query(insertnotification, [notifystring,recievermail], (err, noresult) => {
    if(err){
      console.log(err);
    }
  })
})

app.post("/api/blocksearch", (req, res) => {
  const {searchvalue} = req.body;
  const searchblock = "SELECT * FROM blockchain WHERE chain_id = ? ORDER BY timestamp desc";
  db.query(searchblock, [searchvalue], (err, searchresponse) => {
    if(err){
      console.log(err);
    }
    else{
      
      res.json(searchresponse);
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
