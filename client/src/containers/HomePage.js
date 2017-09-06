import React from 'react';
import Actions from './Actions';
import {LineChart} from '../components/charts';
import StockCard from '../components/StockCard';
import Loader from '../images/loader.gif';

export default class HomePage extends React.Component {
  state = {
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
            stocks.push( {...msg.stock, data: response.data});
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
    const stock_cards = this.state.stocks.map( (s,i) => {
      return (
        <StockCard key={i} code={s.code} description={s.description}
          onDelete={this.onRemoveStock} colour="red" />
      );
    });
    const search_style = {
      display: "flex",
      flexDirection: "row"
    };
    const stock_data = this.state.stocks.map( (stock) => {
      return [...stock.data];
    });
    const stock_card_wrapper = {
      display: "flex",
      flexDirection: "row"
    };
    return (
      <div className="App">
        <h1>Stocks</h1>
        <div>{stock_data.length?
            <LineChart data={stock_data} margin={margin}
              width={width} height={height} />
            : <p><img src={Loader} alt="Please wait ...." /></p>
          }
        </div>
        <div style={stock_card_wrapper}>
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
