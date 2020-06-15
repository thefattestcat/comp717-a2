import React, { Component } from 'react';
import './Tictactoe.css'

class gridSquare extends Component {

    constructor(props) {
      super(props)
      this.state = {
        id: this.props.id,
        color: this.props.color,
        player: '', //What player owns this square.
      }
              
    }

    changeColour = () => {
        this.setState({color: 'red'})
        console.log('clicked')
    }

    insertIcon = () => {
        this.setState({
            
        })
    }
  
    render() {
      return (
        <>
          <div className="grid-square" onClick={this.props.parentCB(this.state)} style={{backgroundColor: this.state.color}}></div>
        </>
      );
    }
    
  }
  
  export default gridSquare;