import React, { Component } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import GridSquare from './gridSquare'
import './Tictactoe.css'

class Tictactoe extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      turnCount: 0,
      whosTurn: 'Your turn',
      moveArray: [],
      mode: 'AI',
    };
                
  }

  newGame = () => {
    this.setState({
      turnCount: 0,
      whosTurn: '',
      moveArray: [],
    })
  }

  squaresCB = (state) => {
    console.log(state)
  }

  toggleMode = () => {
    if(this.state.mode == 'AI') this.setState({mode: '2-Player'})
    else this.setState({mode: 'AI'})
    return this.state.mode;
  }

  incrementTurn = () => {
    let t = this.state.turnCount;
    if(t < 9) {
      t++;
      this.setState({turnCount: t})
    }
  }

  createGrid = () => {
    let sqs = [];
    for(var i = 0; i < 9; i++) 
      sqs.push(<GridSquare parentCB={this.squaresCB} id={i}></GridSquare>)
    return (
      <>
        <div class="grid" onClick={this.incrementTurn}>
          {sqs}
        </div>
      </>
    )
  }
   

  render() {
    let grid = this.createGrid();
    return (
      <>
      <Container>
        <Row style={{ paddingTop: '5rem'}}>
          <Col md="4" xs="12">
            <h1>Tic-tac-toe</h1>
            <p>
              <b>Rules:</b><br></br> 
              In order to win the game, a player must place three of their marks in a horizontal, vertical, or diagonal row.
              <br></br><b>Mode: {this.state.mode}</b>
            </p>
            <Button onClick={this.toggleMode}>{this.state.mode}</Button>
            <Button onClick={this.newGame}>New Game</Button>
          </Col>
          <Col md="8" xs="12">
            <div className="align-content-center">
              {grid}
            </div>
            <div style={{paddingTop: '20px'}}>
              <h3>Move #{this.state.turnCount}:  <span style={{color: "green"}}>{this.state.whosTurn}</span></h3>
            </div>
            
          </Col>
        </Row>
        
      </Container>
      </>
    );
  }
  
}


export default Tictactoe;