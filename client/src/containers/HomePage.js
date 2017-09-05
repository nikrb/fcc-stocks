import React from 'react';
import Actions from './Actions';
import {LineChart} from '../components/charts';
import StockCard from '../components/StockCard';

export default class HomePage extends React.Component {
  state = {
    stock_text: "",
    stock_data: {},
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
            const stock_data = {...this.state.stock_data}
            stock_data[msg.stock.code] = response.data;
            const stocks = [...this.state.stocks, msg.stock];
            this.setState( {stock_data, stocks});
          });
        } else {
          console.error( "stock not found:", msg);
        }
        break;
      case "remove":
        if( msg.code){
          const stock_data = {...this.state.stock_data};
          if( stock_data[msg.code]){
            delete stock_data[msg.code];
          }
          const stocks = this.state.stocks.filter( (d) => {
            return d.code !== msg.code;
          });
          this.setState( { stock_data, stocks});
        } else {
          console.err( "stock not found:", msg);
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
    const stock_cards = this.state.stocks.map( (s,i) => {
      return (
        <StockCard key={i} code={s.code} description={s.description}
          onDelete={this.onRemoveStock} />
      );
    });
    const search_style = {
      display: "flex",
      flexDirection: "row"
    };
    const stock_data = Object.keys( this.state.stock_data)
      .map( (k) => {
        return this.state.stock_data[k];
      });
    return (
      <div className="App">
        <h1>Stocks</h1>
        <div>
          <LineChart data={stock_data} margin={margin}
            width={width} height={height} />
        </div>
        <div>
          {stock_cards}
        </div>
        <div style={search_style}>
          <input type="text" onChange={this.onMessageChanged} value={this.state.stock_text}/>
          <button type="button" onClick={this.onSendClicked}>Send</button>
        </div>
      </div>
    );
  };
}
