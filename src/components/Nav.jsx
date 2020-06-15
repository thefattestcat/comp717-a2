import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import './Nav.css';

class Nav extends Component {

  render() {
    
    return (
      <Navbar variant='dark' fixed='top' bg='dark'>
        <a class="navbar-brand">COMP717 Assignment 2</a>
        <Button>asdasd</Button>
        <Button>asdasd</Button>
      </Navbar>
    );
  }
  
}

export default Nav;