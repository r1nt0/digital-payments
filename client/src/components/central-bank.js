import React from 'react';
import { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import SearchIcon from "./pictures/search.svg";
import Anotherpage from './anotherpage';
import UserPage from './UserPage';
import SearchResultsPage from './SearchResultsPage';
import CurrencyPage from './CurrencyPage';
import "./styles.css"
import { useNavigate } from 'react-router-dom';

function CentralBank() {
    const [showAnotherPage, setShowAnotherPage] = useState(false);
    const [showUsersPage, setShowUsersPage] = useState(false);
    const [ ShowSearchPage,  setShowSearchPage] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [showCurrencyPage, setCurrencyPage] = useState(false);
   const navigate = useNavigate();

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
      };
    
      const handleSearchSubmit = (event) => {
        event.preventDefault();
        setShowSearchPage(true);
      };

    const handleLinkClick = () => {
      setShowAnotherPage(true); // Show the AnotherPage component
    };
    const handleRemoveAnotherPage = () => {
        setShowAnotherPage(false); // Remove the AnotherPage component
      };

      const handleUserClick = () => {
        setShowUsersPage(true); // Show the AnotherPage component
      };
      const handleRemoveUserPage = () => {
          setShowUsersPage(false); // Remove the AnotherPage component
        };

        const handleCurrencyClick = () => {
          setCurrencyPage(true); // Show the AnotherPage component
        };
        const handleRemoveCurrencyPage = () => {
            setCurrencyPage(false); // Remove the AnotherPage component
          };
          const handleLogout = () =>{

            navigate('/', { replace: true });
          }

  return (
    <>
      <Navbar bg="body-tertiary" expand="lg">
        <div className="container-fluid">
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link >
                Home
              </Nav.Link>
              <Nav.Link onClick={() => handleLinkClick('/another-page')}>
                New Notification
              </Nav.Link>
              <Nav.Link onClick={() => handleUserClick('/user-page')}>
                All Users
              </Nav.Link>
              <Nav.Link onClick={() => handleCurrencyClick('/currency-page')}>
               Block Money
              </Nav.Link>
              <Nav.Link to="/" onClick={handleLogout}>
               Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <div className="search-bar">
        <Form className="d-flex"  onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            placeholder="Search user"
            className="me-2"
            aria-label="Search"
            value={searchValue}
            onChange={handleInputChange}
          />
          <Button variant="outline-success" type="submit">
            <img src={SearchIcon} alt="Search" />
          </Button>
        </Form>
      </div>
      
      {showAnotherPage && (
        <div>
          <Anotherpage />
          <Button className="butto"onClick={handleRemoveAnotherPage}>X</Button>
        </div>
      )} 
      {showUsersPage && (
        <div>
          <UserPage />
          <Button className="butto"onClick={handleRemoveUserPage}>X</Button>
        </div>
      )} 
       {showCurrencyPage && (
        <div>
          <CurrencyPage />
          <Button className="butto"onClick={handleRemoveCurrencyPage}>X</Button>
        </div>
      )} 
       {ShowSearchPage && (
        <div>
          <SearchResultsPage searchValue={searchValue} />
          <Button className="butto" onClick={() => setShowSearchPage(false)}>X</Button>
        </div>
      )}
    </>
  );
}

export default CentralBank;
