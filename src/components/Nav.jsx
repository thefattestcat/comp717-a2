import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import './Nav.css';

class Nav extends Component {

  render() {
    
    return (
      <Navbar variant='dark' sticky='top' bg='dark'>
        <a className="navbar-brand" href="/">COMP717 Assignment 2</a>
        <Button>asd</Button>
      </Navbar>
    );
  }
  
}

export default Nav;