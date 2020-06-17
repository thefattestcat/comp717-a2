import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Tictactoe.css'

class gridSquare extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      player: 0, //Why am I tracking this here?
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleAI = this.handleAI.bind(this);

  }

  static getDerivedStateFromProps(props, state) {
    console.log(props, state)
  }

  componentDidMount() {
    document.addEventListener('doAI', this.handleAI);
  }

  componentWillUnmount() {
    document.removeEventListener('doAI', this.handleAI);
  }

  componentDidUpdate() {
    console.log('DidUpdate: ',this.state)
  }

  handleClick() {
    console.log('clicked ', this.state.id)
    this.props.parentCB(this.state)
      .then( (s) => {
        console.log(s)
        this.setState({
          player: s
        }, () => {
          this.changeCol();
        })
      })
      .catch( (err) => {
        console.log(err)
      })
  }

  handleAI() {
    console.log('HandleAI')
    this.props.aiCB(this.state.id) 
      .then( (s) => {
        this.setState({
          player: s
        }, () => {
          this.changeCol();
        })
      })
      .catch( (err) => {
        console.log(err)
      })
  }

  changeCol = () => {
    let s = this.state.player
    console.log(s)
    let c;
    if(s == 0) c = 'white';
    if(s == 1) c = 'red';
    if(s == 2) c = 'blue';
    console.log('c is ', c)
    this.setState({
      colour: c,
    })
  }

  render() {
    return (
      <>
        <div className="grid-square" 
          onClick={this.handleClick} 
          style={{backgroundColor: this.state.colour}}
          id={this.state.id}
          ref={this.state.id}
        >
        </div>
      </>
    );
  }
    
}
  
export default gridSquare;