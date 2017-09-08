import React from 'react';
import moment from 'moment';
import Actions from './Actions';
import StockChart from '../components/StockChart';
import * as d3 from 'd3';
import {genLastWeekdays, normaliseDates, weekday} from '../components/charts';

export default class HomePage extends React.Component {
  state = {
    weekdays100: genLastWeekdays( moment(), 100),
    stock_text: "",
    stocks: []
  };
  componentWillMount = () => {
    this.ws = new WebSocket( 'ws://localhost:8080');
    this.ws.addEventListener( 'message', this.onWsMessage);
  };
  componentWillUnmount = () => {
    this.ws.removeEventListener( 'message', this.onWsMessage);
    this.ws.close();
  };

  onWsMessage = (e) => {
    const msg = JSON.parse( e.data);
    console.log( "ws message:", msg);
    switch( msg.action){
      case "ack":
        if( msg.message === "connected"){
          console.log( "requesting stock list");
          this.ws.send( JSON.stringify( { action: "show"}));
        }
        break;
      case "add":
        if( msg.stock){
          Actions.getStock( {code: msg.stock.code})
          .then( (response) => {
            const stocks = this.state.stocks.filter( (stock) => {
              return stock.code !== msg.stock.code;
            });
            const norm = normaliseDates( response.data, this.state.weekdays100);
            // conver the dates to weekdays
            const parseTime = d3.timeParse("%Y-%m-%d");
            const data = norm.map( (p) => {
              return { date: p.date,
                weekday: weekday( parseTime( p.date)), close: +p.close};
            });
            stocks.push( {...msg.stock, data});
            this.setState( {stocks});
          });
        } else {
          console.error( "stock not found:", msg);
        }
        break;
      case "remove":
        if( msg.code){
          const stocks = this.state.stocks.filter( (d) => {
            return d.code !== msg.code;
          });
          this.setState( {stocks});
        } else {
          console.err( "stock not found:", msg);
        }
        break;
      case "error":
        if( msg.message){
          // TODO: ui feedback
          alert( msg.message);
        }
        break;
      default:
        console.log( "unhandled ws message:", msg);
        break;
    }
  };
  onMessageChanged = (e) => {
    this.setState( {stock_text: e.target.value.toUpperCase()});
  };
  onSendClicked = (e) => {
    const msg = { action: "add", code: this.state.stock_text};
    this.ws.send( JSON.stringify( msg));
  };
  onRemoveStock = ( code) => {
    console.log( `remove stock [${code}]`);
    const msg = { action: "remove", code};
    this.ws.send( JSON.stringify( msg));
  };
  render = () => {
    const width = 800, height = 400;
    const margin = { top: 20, left: 40, bottom:20, right:20};
    const search_style = {
      margin: "10px",
      display: "flex",
      flexDirection: "row"
    };
    return (
      <div className="App">
        <h1>Stocks</h1>
        <StockChart stocks={this.state.stocks} margin={margin}
          width={width} height={height}
          onRemoveStock={this.onRemoveStock} />
        <div style={search_style}>
          <input type="text" onChange={this.onMessageChanged}
            placeholder="Stock code" value={this.state.stock_text}/>
          <button type="button" onClick={this.onSendClicked}>Add</button>
        </div>
      </div>
    );
  };
}
