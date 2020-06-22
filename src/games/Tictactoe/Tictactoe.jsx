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
      startingPlayerId: 1,
      depth: 2,
      moveScores: [],
      maxmin: [],
      depth: 2,
    };

  }

  componentDidMount() {
    console.log(React.version)
  }

  /**Util functions */
  objectlength = (obj) => {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }

  isOdd = (n) => {
    return (Math.abs(this.state.minmaxLevel % 2) === 1)
  }

  isEven = (n) => {
    return (n % 2 === 0)
  }

  /**
   * @description Resets game state variables.
   */
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
      bestMax: -100, bestMin: 100,
      bestMoveMax: {}, bestMoveMin: {},
    }, () => {
      console.log('new game: ', this.state)
      let ng = this.createGrid();
      this.setState({
        grid: ng,
      }, async () => {
        console.log('Grid mounted')
        //console.log(this.state.grid)
          
        console.log('Game Started!')
        if(this.state.startingPlayer === 'AI') {
          await this.aiMove()
            .then( pos => {
              this.gs[pos].current.handleAI()
            })
        }
        console.log('Finished!')
        
        
      })
    })
  }
  
  /**
   * @description Increments turnCount then triggers aiMove it needed.
   */
  incrementTurn = () => {
    let t = this.state.turnCount;
    if(t < 9) {
      t++;
      const b = this.state.positionState;
      this.setState({ turnCount: t }, async () => {
        console.log('Incrementing turn', this.isOdd(t))
        await this.aiMove()
        .then( pos => {
          this.gs[pos].current.handleAI()
        }) 
      })
      
    }
  }

  /**
   * @description Sets starting player
   */
  whoStart = () => {
    let p = this.state.startingPlayer;
    let i = this.state.startingPlayerId;
    if(p === 'Player') {
      p = 'AI';
      i = 2;
    }
    else p = 'Player'; i = 1;
    this.setState({
      startingPlayer: p,
      startingPlayerId: i,
    })
  }

  /**
   * 
   * @param {Number} squareId index of square on grid (positions 0-8)
   * @param {Number} playerId id of player
   * @description sets state of grid position with the value of the player id (1 = player, 2 = AI)
   * @returns {Promise} for component refs (gridSquare)
   */
  setSquareState = async (squareId, playerId) => {
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
        console.log(`Position already filled [${squareId}] player=${playerId}`)
        reject(this.state.positionState[squareId]) 
      }
    })
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /** Component Callbacks */
  squaresCB = async (state) => {
    return await this.setSquareState(state.id, 1); //(positionId, playerId= 1, for player)
  }
  aiCB = async (id) => {
    return await this.setSquareState(id, 2);
  }
  incrementCB = async () => {
    await this.aiMove()
      .then( pos => {
        this.gs[pos].current.handleAI()
      })
  }

  /** AI */
  aiMove = async () => {
    return new Promise ( async resolve => {
      console.log(`AI turn ${this.state.turnCount} [${this.state.positionState}]`)
      await this.makeMove(this.state.positionState, 2, 1, this.state.depth, null, this.state.depth)
      console.log(`AI move to [${this.state.bestMoveMax}]`)
      resolve(this.state.bestMoveMax);
    })
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
    return 0; //No winner
  }
  
  /**
   * 
   * @param {postionStateArray} boardState - board state 
   */
  checkTerminal = (boardState) => {
    if(this.checkEmptyPositions(boardState).length === 0) return true;
    if(this.checkWin(boardState) !== 0) return true;
    return false;
  }

  /**
   * 
   * @param {positionArrayState} boardState 
   * @param {Number} p1 - playerId of turn i
   * @param {Number} p2 - playerId of turn i+1
   * @param {Number} depth - Maximum depth of search
   * @param {Number} n - Index of last move made
   * @description recursively iterates mves from boardState until terminal state is reached.
   * @returns
   */
  makeMove = (boardState, p1, p2, depth, n, level) => {
    //return new Promise ( async resolve => {
      if(level === depth) {
        this.state.bestMax = -100;
      }
      if(level === 0) {
        let currentBest = this.state.bestMax;
        let bestMove = this.state.bestMoveMax;
        let score = this.stateEval(boardState, p1, p2);
        console.log(`score=${score}, currentBest=${currentBest}`)  
        if(score >= currentBest) {
          this.state.bestMax = score;
          this.state.bestMoveMax = n;
          console.log(`FinalMax: Level[${level}] score=${score} (bestMax=${currentBest} bestMove=[${bestMove}]) move=[${n}] => [${boardState}]`)
        }
        console.log(`resolving [${this.state.bestMoveMax}]`)
        return (this.state.bestMoveMax)
      }
      else if(level > 0){
        console.log(`${p1}: level=[${level}] depth=${depth} boardState=[${boardState}]`)
        let empty = this.checkEmptyPositions(boardState);  
        if(empty.length > 0) {
          //MinMax score checks
          if(p1 === 2) {
            console.log('MAX!')
            for(let i = 0; i < empty.length; i++) {
              const move = empty[i]; //Current move index
              let k = [...boardState];
              k[move] = p1;
              if(level > 0) {
                let l = level; l--
                (this.makeMove(k, p2, p1, this.state.depth, move, l))
              }
            }  
          }
          else {
            console.log('MIN!')
            for(let i = 0; i < empty.length; i++) {
              const move = empty[i]; //Current move index
              let k = [...boardState];
              k[move] = p1;            
              if(level > 0) {
                let l = level; l--
                (this.makeMove(k, p1, p2, this.state.depth, move, l))
              }
            }
          }
        } 
      }
    //})
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
   * 
   * Note: Does not take into account board symmetry (Reflections/rotations).
   */
  stateEval = (boardState, playerId, oppId) => {
    const rows = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    const cols = [
      [0, 3, 6],
      [2, 5, 8],
      [1, 4, 7],
    ]
    const diags = [
      [0, 4, 8],
      [2, 4, 6],
    ]

    function x1 (boardState, playerId) {
      function x1RowCheck (boardState, playerId) {
        let rowVal = [];
        let rowScore = 0;
        for(let i = 0; i < rows.length; i++) {
          const [a, b, c] = rows[i]; //[ 0, 1, 2]
          if(boardState[a] === playerId) {
            if(boardState[b] === 0 && boardState[c] === 0) {
              rowScore++;
              rowVal[i] = [a,b,c];
            }
          }
          else if(boardState[b] === playerId) {
            if(boardState[a] === 0 && boardState[c] === 0) {
              rowScore++;
              rowVal[i] = [a,b,c];
            }
          }
          else if(boardState[c] === playerId) {
            if(boardState[a] === 0 && boardState[b] === 0) {
              rowScore++;
              rowVal[i] = [a,b,c];
            }
          }
        }
        //if(rowScore > 0)console.log(rowScore, rowVal, boardState)
        return rowScore;
      }
  
      function x1ColCheck (boardState, playerId) {
        let colVal = [];
        let colScore = 0;
        for(let i = 0; i< cols.length; i++) {
          const [a, b, c] = cols[i];
          if(boardState[a] === playerId) {
            if(boardState[b] === 0 && boardState[c] === 0) {
              colScore++;
              colVal[i] = [a,b,c]
            }
          }
          else if(boardState[b] === playerId) {
            if(boardState[a] === 0 && boardState[c] === 0) {
              colScore++;
              colVal[i] = [a,b,c]
            }
          }
          else if(boardState[c] === playerId) {
            if(boardState[a] === 0 && boardState[b] === 0) {
              colScore++;
              colVal[i] = [a,b,c]
            }
          }
        }
        return colScore;
      }
  
      function x1DiagCheck(boardState, playerId) {
        let diagVal = [];
        let diagScore = 0;
        for(let i = 0; i< diags.length; i++) {
          const [a, b, c] = diags[i];
          if(boardState[a] === playerId) {
            if(boardState[b] === 0 && boardState[c] === 0) {
              diagScore++;
              diagVal[i] = [a,b,c]
            }
          }
          else if(boardState[b] === playerId) {
            if(boardState[a] === 0 && boardState[c] === 0) {
              diagScore++;
              diagVal[i] = [a,b,c]
            }
          }
          else if(boardState[c] === playerId) {
            if(boardState[a] === 0 && boardState[b] === 0) {
              diagScore++;
              diagVal[i] = [a,b,c]
            }
          }
        }
        return diagScore;
      }
      return (x1RowCheck(boardState, playerId) + x1ColCheck(boardState, playerId) + x1DiagCheck(boardState, playerId));
    }
    
    function x2 (boardState, playerId) {
      function x2RowCheck (boardState, playerId) {
        let rowScore = 0;
        for(let i = 0; i < rows.length; i++) {
          const [a,b,c] = rows[i];
          if(boardState[a] === playerId && boardState[b] === playerId && boardState[c] === 0) rowScore++;
          else if(boardState[a] === playerId && boardState[c] === playerId && boardState[b] === 0) rowScore++;
          else if(boardState[c] === playerId && boardState[b] === playerId && boardState[a] === 0) rowScore++;
        }
        return rowScore;
      }
      function x2ColCheck (boardState, playerId) {
        let colScore = 0;
        for(let i = 0; i < cols.length; i++) {
          const [a,b,c] = cols[i];
          if(boardState[a] === playerId && boardState[b] === playerId && boardState[c] === 0) colScore++;
          else if(boardState[a] === playerId && boardState[c] === playerId && boardState[b] === 0) colScore++;
          else if(boardState[c] === playerId && boardState[b] === playerId && boardState[a] === 0) colScore++;
        }
        return colScore;
      }
      function x2DiagCheck (boardState, playerId) {
        let diagScore = 0;
        for(let i = 0; i < diags.length; i++) {
          const [a,b,c] = diags[i];
          if(boardState[a] === playerId && boardState[b] === playerId && boardState[c] === 0) diagScore++;
          else if(boardState[a] === playerId && boardState[c] === playerId && boardState[b] === 0) diagScore++;
          else if(boardState[c] === playerId && boardState[b] === playerId && boardState[a] === 0) diagScore++;
        }
        return diagScore;
      }
      return (x2RowCheck(boardState, playerId) + x2ColCheck(boardState,playerId) + x2DiagCheck(boardState, playerId)); 
    }

    //Check if terminal, return -10, 0, +10 score here.
    if(this.checkTerminal(boardState)) {
      const w = this.checkWin(boardState)
      if(w === 0) return 0; //Draw, no moves left
      else {
        console.log(`Game finished, winner= ${w}, depth=${this.state.minmaxLevel} state=${boardState}`)
        if(w === 1) return 10;
        if(w === 2) return -10;
      }
    }

    //if boardState is not terminal, return evaluation score
    return ((3 * x2(boardState, playerId)) + x1(boardState, playerId)) - ((3 * x2(boardState, oppId)) + x1(boardState, oppId)); 
  }

  getScores = (move, score, isMaxMin, level) => {
    let leafNodes = {};
    
  }

  compareScore = (move, score, isMaxMin, level) => {
    level = level - 1;
    /**
    * Save minmax scores for each layer via parity of minmaxLevel .
    * Save the associated move to maxmin array.
    * */
    let moves = [...this.state.minmaxMoves];
    let moveScores = [...this.state.minmaxMoveScores];
    
    if(typeof moves[level] === 'undefined') {
      moves[level] = move;
      moveScores[level] = score;
    } else { 
      if(isMaxMin === 'max') 
        if(score > moveScores[level]) {
          moveScores[level] = score;
          moves[level] = move;
        }
      else if(isMaxMin === 'min')
        if(score < moveScores[level]) {
          moveScores[level] = score;
          moves[level] = move;
        }
    }

    this.setState({
      minmaxMoves: moves,
      minmaxMoveScores: moveScores
    }, () => {
      console.log('Updated moveScores', this.state.minmaxMoves, this.state.minmaxMoveScores)
    })
    
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
          incrementCB={this.incrementCB}
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
                min={1}
                max={9}
                tooltipStyle={{display: 'none'}}
              />
            </div>
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