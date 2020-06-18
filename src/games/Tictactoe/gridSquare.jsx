import React, { Component } from 'react';
import './Tictactoe.css'

class gridSquare extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      player: this.props.player, 
      colour: this.props.colour,
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleAI = this.handleAI.bind(this);
  }

  //Refactor this
  UNSAFE_componentWillReceiveProps(newProps) {
    //console.log('newProps:', newProps)
    if(newProps.player === 0){
      this.setState({
        colour: newProps.colour,
        player: newProps.player
      })
    }
  }

  componentDidMount() {
    this.setState({
      colour: this.props.colour
    })
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
    //console.log('DidUpdate: ',this.state)
  }

  handleClick() {
    console.log('clicked ', this.state.id)
    this.props.parentCB(this.state)
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

  handleAI() {
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
    let c;
    if(s === 0) c = 'white';
    if(s === 1) c = 'red';
    if(s === 2) c = 'blue';
    //console.log('c is ', c)
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