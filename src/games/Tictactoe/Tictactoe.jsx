import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import GridSquare from './gridSquare'
import './Tictactoe.css'

class Tictactoe extends Component {

  constructor(props) {
    super(props);
    this.gs = []
    this.state = {
      turnCount: 1, //Current turn
      whosTurn: 'Your turn', 
      moveArray: [],  //Array of Moves
      positionState: [], //Who owns each square (0-8), 0 = empty, 1 = player, 2 = AI
      mode: '', //Not implemented (AI or 2-PLayer)
      startingPlayer: 'Player'
    };

  }

  componentDidMount() {
    console.log(React.version)
  }

  newGame = () => {
    let p = []
    for(let i = 0; i < 9; i++)
      p[i] = 0;
    
    this.setState( {
      turnCount: 1,
      whosTurn: '',
      moveArray: [],
      positionState: p,
      winner: '',
    }, () => {
      this.setState({
        grid: this.createGrid(),
      }, () => {
        console.log('Grid mounted')
        console.log(this.state.grid)
        
        console.log('Game Started!')
        if(this.state.startingPlayer == 'AI') {
          let d = Math.floor(Math.random() * 10)
          this.gs[d].current.handleAI();
        }
      })
    })
  }
  
  checkPosition = (id) => {
    return this.state.moveArray.indexOf(id) == -1;
  }
  
  checkWin = () => {
    //Get positionState and do calculations for winner
    let p = this.state.positionState;
    let w;
    //make this func
    if(
      (p[0] == 1 && p[1] == 1 && p[2] == 1) ||
      (p[0] == 1 && p[4] == 1 && p[8] == 1) ||
      (p[0] == 1 && p[3] == 1 && p[6] == 1) ||
      (p[0] == 1 && p[1] == 1 && p[2] == 1) 
      ){ w = 'Player wins';}
    else w = 'Noone';
    this.setState({
      winner: w,
    })
    return w;
  }

  setSquareState = (squareId, playerId) => {
    return new Promise ((resolve, reject) => {
      if(this.checkPosition(squareId)) {
        let j = this.state.moveArray.concat(squareId)
        let k = this.state.positionState;
        k[squareId] = playerId;
        this.setState({ 
          moveArray: j,
          positionState: k
        }, () => {
          console.log(this.state.moveArray);
          console.log(this.state.positionState);
          if(this.state.moveArray.length >= 5) {
            this.checkWin()
          }
          this.incrementTurn();
          resolve(this.state.positionState[squareId])
        }) 
      } else {
        console.log('Position already filled')
        reject(this.state.positionState[squareId]) 
      }
    })
  }

  squaresCB = (state) => {
    return this.setSquareState(state.id, 1); //(positionId, playerId= 1, for player)
  }

  aiMove = (id) => {
    return this.setSquareState(id, 2);
  }

  incrementTurn = () => {
    let t = this.state.turnCount;
    if(t < 9) {
      t++;
      this.setState({turnCount: t})
    }
  }

  whoStart = () => {
    let p = this.state.startingPlayer;
    if(p == 'Player') p = 'AI'
    else p = 'Player';
    this.setState({
      startingPlayer: p
    })
  }

  //**Div stuff */
  createGrid = () => {
    let sqs = [];
    for(var i = 0; i < 9; i++) {
      this.gs[i] = React.createRef();
      sqs.push(
        <GridSquare 
          parentCB={this.squaresCB}
          aiCB={this.aiMove} 
          id={i} 
          state={this.state.positionState[i]} 
          player={0}
          ref={this.gs[i]}
        />
      )
    }
    console.log(this.gs)
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
              <br></br>
              The game checks for a winner from the 5th move onwards.
              <br></br>
              <b>Mode: {this.state.mode}</b>
            </p>
            <Button onClick={this.whoStart}>Start: {this.state.startingPlayer}</Button>
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
              <h3>Winner:   <span style={{color: "green"}}>{this.state.winner}</span></h3>
            </div>
            
          </Col>
        </Row>
        
      </Container>
      </>
    );
  }
  
}


export default Tictactoe;