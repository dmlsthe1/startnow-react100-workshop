import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
  return (
    <button className={props.highlight[props.index]} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, obj) {
    return (
      <Square
        key={i}
        index={i}
        equivalent={obj}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, obj)}
        highlight= { this.props.highlight }
      />
    );
  }

  render() {
    let counter = 0, equivalent = {};
    return (
      <div>
        {[1,2,3].map((row) => {
          return (
            <div key={row} className="board-row">
              {[1,2,3].map((col) => {
                return this.renderSquare(counter++, [col,row]);
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      toggle: true,
    };
  }

  handleClick(i, obj) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        move : obj,
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggle(){
    this.setState({
      toggle: !this.state.toggle
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let highlight = {
      0: 'square',
      1: 'square',
      2: 'square',
      3: 'square',
      4: 'square',
      5: 'square',
      6: 'square',
      7: 'square',
      8: 'square',
    }

    let status;
    if(winner) {
      status = "Winner: " + winner.shift();
      
      highlight[winner[0]]= 'square highlight';
      highlight[winner[1]]= 'square highlight';
      highlight[winner[2]]= 'square highlight';
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X": "O");
    }


    const moves = history.map((step, move) => {
      const desc = move ?
        "Move (" + step.move + ")" :
        "Game start";
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </a>
        </li>
      );
    });
    
    let tempMoves = [...moves];
    let temp = tempMoves.shift();
    tempMoves.reverse().unshift(temp);
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i, obj) => this.handleClick(i, obj)}
            highlight = { highlight }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggle()}>{this.state.toggle === true ? "Ascending" : "Descending"}</button>
          {this.state.toggle === true ? <ol>{moves}</ol> : <ol>{tempMoves}</ol>}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

      return [squares[a], a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
