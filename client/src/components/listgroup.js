import React, { useState } from 'react';
import "./loginStyles.css" // Import the CSS file
import { Link } from 'react-router-dom';

const ListGroup = () => {
  const [activeItem, setActiveItem] = useState(null); // State to keep track of the active item

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  

  return (
    <div className="list-group">
      <Link
        to="/balance"
        className={`list-group-item list-group-item-action ${activeItem === 1 ? 'active' : ''}`}
        onClick={() => handleItemClick(1)}
      >
        Balance
      </Link>
      <Link
        to="/transfer"
        className={`list-group-item list-group-item-action ${activeItem === 2 ? 'active' : ''}`}
        onClick={() => handleItemClick(2)}
      >
        Transfer
      </Link>
      <Link
        to="/cheques"
        className={`list-group-item list-group-item-action ${activeItem === 3 ? 'active' : ''}`}
        onClick={() => handleItemClick(3)}
      >
        Cheques 
      </Link>
      <Link
        to="/transaction-history"
        className={`list-group-item list-group-item-action ${activeItem === 4 ? 'active' : ''}`}
        onClick={() => handleItemClick(4)}
      >
        Transaction History
      </Link>
      <Link
        to="/notifications"
        className={`list-group-item list-group-item-action ${activeItem === 5 ? 'active' : ''}`}
        onClick={() => handleItemClick(5)}
      >
        Notifications
      </Link>
     
    </div>
  );
};

export default ListGroup;
