import React, { Component } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import GridSquare from './gridSquare'
import './Tictactoe.css'

class Tictactoe extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      turnCount: 0, //Current turn
      whosTurn: 'Your turn', 
      moveArray: [],  //Array of Moves
      positionState: [], //Who owns each square (0-8), 0 = empty, 1 = player, 2 = AI
      mode: '', //Not implemented (AI or 2-PLayer)
      
    };
                
  }

  componentDidMount() {
    
  }

  newGame = () => {
    let p = []
    for(let i = 0; i < 9; i++)
      p[i] = 0;
    this.setState( {
      turnCount: 0,
      whosTurn: '',
      moveArray: [],
      positionState: p,
    }, () => {
      this.setState({
        grid: this.createGrid(),
      })
      console.log('Grid mounted')
      console.log(this.state.grid)
    })
  }

  squaresCB = (state, cb) => {
    return new Promise ((resolve, reject) => {
      if(this.state.moveArray.indexOf(state.id) == -1) {
        let j = this.state.moveArray.concat(state.id)
        let k = this.state.positionState;
        k[state.id] = 1;
        this.setState({ 
          moveArray: j,
          positionState: k
        }, () => {
          console.log(this.state.moveArray);
          console.log(this.state.positionState);
          this.incrementTurn();
          resolve(this.state.positionState[state.id])
        }) 
      } else {
        console.log('Position already filled')
        reject(this.state.positionState[state.id]) 
      }
    })
    //If square id is not in moveArray
    
  }

  incrementTurn = () => {
    let t = this.state.turnCount;
    if(t < 9) {
      t++;
      this.setState({turnCount: t})
    }
  }

  //**Div stuff */
  createGrid = () => {
    let sqs = [];
    for(var i = 0; i < 9; i++) 
      sqs.push(
        <GridSquare 
          parentCB={this.squaresCB} 
          id={i} 
          state={this.state.positionState[i]} 
        />
      )
    return (sqs)
  }
   
  render() {
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
            <Button onClick={this.newGame}>New Game</Button>
          </Col>
          <Col md="8" xs="12">
            <div className="align-content-center">
              <div className="grid">
                {this.state.grid}
              </div>
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