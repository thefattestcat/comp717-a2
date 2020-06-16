import React, { Component } from 'react';
import './Tictactoe.css'

class gridSquare extends Component {

    constructor(props) {
      super(props)
      this.state = {
        id: this.props.id,
        color: this.props.color,
        player: '', //Why am I tracking this here?
      }
    }

    componentWillReceiveProps (props) {
      this.changeCol(props)
    }

    handleClick = () => {
      console.log('clicked ', this.state.id)
      this.props.parentCB(this.state)
        .then( (s) => {
          this.changeCol(s)
        })
        .catch( (err) => {
          console.log(err)
        })
    }

    changeCol = (s) => {
      console.log(s)
      let c;
      if(s == 0) c = 'white';
      if(s == 1) c = 'red';
      console.log('c is ', c)
      this.setState({
        color: c
      })
    }
  
    render() {
      return (
        <>
          <div className="grid-square" 
            onClick={this.handleClick} 
            style={{backgroundColor: this.state.color}}>
          </div>
        </>
      );
    }
    
  }
  
  export default gridSquare;