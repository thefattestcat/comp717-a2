import React, { Component } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';

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
      startingPlayer: 'Player',
      depth: 2,
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
      minmaxLevel: 0,
    }, () => {
      console.log('new game: ', this.state)
      let ng = this.createGrid();
      this.setState({
        grid: ng,
      }, () => {
        console.log('Grid mounted')
        //console.log(this.state.grid)
          
        console.log('Game Started!')
        if(this.state.startingPlayer === 'AI') {
          //this.aiMove();
        }
        let o = this.state.positionState
        this.makeMove(o, 1,2, this.state.depth)
        console.log('Finished!')
      })
    })
  }
  
  incrementTurn = () => {
    let t = this.state.turnCount;
    if(t < 9) {
      t++;
      this.setState({ turnCount: t }, () => {
        this.aiMove();
      })
    }
  }

  whoStart = () => {
    let p = this.state.startingPlayer;
    if(p === 'Player') p = 'AI'
    else p = 'Player';
    this.setState({
      startingPlayer: p
    })
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
            if(this.checkTerminal(this.state.positionState))
              this.checkWin(this.state.positionState)
          }
          resolve(this.state.positionState[squareId])
        }) 
      } else {
        console.log('Position already filled')
        reject(this.state.positionState[squareId]) 
      }
    })
  }

  /** Component Callbacks */
  squaresCB = (state) => {
    return this.setSquareState(state.id, 1); //(positionId, playerId= 1, for player)
  }
  aiCB = (id) => {
    return this.setSquareState(id, 2);
  }

  /** AI */
  aiMove = () => {
    /**
    * 1) Get positionState array and list all available options in availPos
    * 2) Put each position through evaluation func
    * 3) choose position with highest eval value;
    */
    //s = current board state,
    //Eval(s) = 3X2(s) + X1(s) − (3O2(s) + O1(s))
    
    let availPos = [];
    console.log(this.state.positionState)
    
    for(let i = 0; i< this.state.positionState.length; i++) {
      if(this.state.positionState[i] === 0) {
        availPos.push(i)
      }
    }
    
    console.log('availPos', availPos)
    if(availPos.length > 0){
      const o = this.state.positionState;
      this.makeMove(o,1,2, this.state.depth)
    } else {
      console.log('no more moves')
    }
  }


  
  /** Minmax */
  
  /**
   * 
   * @param {positionStateArray} boardState
   * @returns {Array} Array of indexes of empty positions left. 
   */
  checkEmptyPositions = (boardState) => {
    let emptyPositions = []; //Stores indexes of empty board positions.
    for(let i = 0; i < boardState.length; i++) {
      if(boardState[i] === 0) emptyPositions.push(i);
    }
    return emptyPositions;
  }

  /**
   * 
   * @param {Number} id - index of square in grid 
   * @returns true if id has been used
   */
  checkPosition = (id) => {
    return this.state.moveArray.indexOf(id) === -1;
  }
  
  /**
   * 
   * @param {positionStateArray} boardState - board state
   * @returns playerId (1 or 2) for win, -1 for draw 
   */
  checkWin = (boardState) => {
    const winIndexes = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [3, 4, 5],
      [6, 7, 8],
    ];

    for (let i = 0; i < winIndexes.length; i++) {
      const [a, b, c] = winIndexes[i];
      if (boardState[a] !== 0 && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a]; 
      } 
    }
    return -1; //No winner
  }
  
  /**
   * 
   * @param {postionStateArray} boardState - board state 
   */
  checkTerminal = (boardState) => {
    if(this.checkEmptyPositions(boardState).length === 0) return true;
    if(this.checkWin(boardState) !== -1) return true;
    return false;
  }

  /**
   * 
   * @param {positionArrayState} boardState 
   * @param {Number} p1 - playerId of turn i
   * @param {Number} p2 - playerId of turn i+1
   * @description recursively iterates mves from boardState until terminal state is reached.
   * @returns
   */
  makeMove = (boardState, p1, p2, depth) => {
    let x = this.state.minmaxLevel;
    x++;
    this.setState({minmaxLevel: x}, () => {
      
      if(this.state.minmaxLevel <= depth) {  
        
        if(this.checkTerminal(boardState)) {
          const w = this.checkWin(boardState)
          if(w === -1) console.log('Draw')
          if(w === 0 ) console.log('bug: ', boardState, w)
          else console.log('Game finished, winner= ', w)
          return boardState;
        } 

        let empty = this.checkEmptyPositions(boardState);
        if(empty.length > 0) {
          let k;
          for(let i = 0; i < empty.length; i++) {
            k = [...boardState];
            k[empty[i]] = p1;
            this.makeMove(k, p2, p1, this.state.depth);
          } 
        
        
        }
      } 

    })
  } 

  /**
   * 
   * @param {positionStateArray} boardState - board state.
   * @returns
   * @description State evaluation function. 
   * 
   * Returns evaluation score from boardState. Scores it from -10 to 10 
   * based upon the evaluation function given in the assignment documentation.
   * 
   * Eval(s) = 3*X2(s) + X1(s) - (3*O2(s) + O1(s))
   */
  stateEval = (boardState) => {
    function X2 (boardState) {
      const openLines = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8],
      ];
      for (let i = 0; i < openLines.length; i++) {
        const [a, b, c] = openLines[i];
        if (boardState[a] !== 2 && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
          return a;
        } 
      }
    }
  }

  minmax = () => {
    /**
     * 1. Store current boardState and current players turn (1 or 2).
     */
    let b = this.state.positionState;

    if (this.checkTerminal(b) === true) {
      if (this.checkWin(b) === 1) {
        return  10; 
      } else if (this.checkWin(b) === 2) {  
        return -10;
      } else {
        return 0;
      }
    }
     
  }

  //**Div stuff */
  createGrid = () => {
    let sqs = [];
    this.gs = [];
    for(var i = 0; i < 9; i++) {
      this.gs[i] = React.createRef();
      sqs.push(
        <GridSquare 
          parentCB={this.squaresCB}
          aiCB={this.aiCB} 
          id={i} 
          state={this.state.positionState[i]} 
          colour={'white'}
          player={0}
          ref={this.gs[i]}
        />
      )
    }
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
            <div>
              <p>Search Depth: {this.state.depth}</p>
              <RangeSlider
                value={this.state.depth}
                onChange={changeEvent => this.setState({depth: changeEvent.target.value})}
                min={0}
                max={7}
                tooltipStyle={{display: 'none'}}
              />
            </div>
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