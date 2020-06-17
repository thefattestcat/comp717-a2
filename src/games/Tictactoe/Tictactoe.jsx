import React, { Component } from 'react';
import { unmountComponentAtNode, findDOMNode } from 'react-dom';

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
      console.log('new game: ', this.state)
      let ng = this.createGrid();
      this.setState({
        grid: ng,
      }, () => {
        console.log('Grid mounted')
        console.log(this.state.grid)
        
        console.log('Game Started!')
        if(this.state.startingPlayer == 'AI') {
          this.aiEval();
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
    let w = 0; let winner;
    
    //Horizontal
    if(p[0] == p[1] && p[1] == p[2]) w = p[0];
    if(p[3] == p[4] && p[4] == p[5]) w = p[3];
    if(p[6] == p[7] && p[7] == p[8]) w = p[6];
    
    //Vertical
    if(p[0] == p[3] && p[3] == p[6]) w = p[0];
    if(p[1] == p[4] && p[4] == p[7]) w = p[1];
    if(p[2] == p[5] && p[5] == p[8]) w = p[2];

    //Diag
    if(p[0] == p[4] && p[4] == p[8]) w = p[0];
    if(p[2] == p[4] && p[4] == p[6]) w = p[2];

    if(w == 1) winner = 'Player';
    if(w == 2) winner = 'AI';
    if(w == 0) winner = 'Noone';

    this.setState({
      winner: winner,
    })

    return winner;
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
          //console.log(this.state.moveArray);
          //console.log(this.state.positionState);
          if(this.state.moveArray.length >= 5) {
            this.checkWin()
          }
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

  aiEval = () => {
    //Do evaluation function here;
    /**
     * 1) Get positionState array and list all available options in availPos
     * 2) Put each position through evaluation func
     */
    let availPos = [];
    console.log(this.state.positionState)
    
    for(let i = 0; i< this.state.positionState.length; i++) {
      if(this.state.positionState[i] === 0) {
        availPos.push(i)
      }
    }

    console.log('availPos', availPos)
    if(availPos.length > 0){
      let d = availPos[Math.floor(Math.random() * availPos.length)]
      console.log('Moving to ', d)
      this.gs[d].current.handleAI();
    } else {
      console.log('no more moves')
    }
  }

  aiMove = (id) => {
    return this.setSquareState(id, 2);
  }

  incrementTurn = () => {
    let t = this.state.turnCount;
    if(t < 9) {
      t++;
      this.setState({ turnCount: t }, () => {
        this.aiEval();
      })
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
    this.gs = [];
    console.log('Grid: ', this.state)
    for(var i = 0; i < 9; i++) {
      this.gs[i] = React.createRef();
      sqs.push(
        <GridSquare 
          parentCB={this.squaresCB}
          aiCB={this.aiMove} 
          id={i} 
          state={this.state.positionState[i]} 
          colour={'white'}
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
              <div className="grid" onClick={this.incrementTurn}>
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