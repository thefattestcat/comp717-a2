import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Tictactoe from './games/Tictactoe/Tictactoe.jsx';
import Nav from './components/Nav.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Nav />
    <Tictactoe />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
