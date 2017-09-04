import React from 'react';
import Actions from './Actions';

export default class HomePage extends React.Component {
  state = {
    message_text: ""
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
   switch( msg.action){
     case "add":
      Actions.getStock( {code: this.state.message_text})
      .then( (response) => {
        console.log( "get stock response:", response);
      });
      break;
     default:
      console.log( "unhandled ws message:", msg);
      break;
   }
  };
  onMessageChanged = (e) => {
    this.setState( {message_text: e.target.value});
  };
  onSendClicked = (e) => {
    const msg = { action: "add", code: this.state.message_text};
    this.ws.send( JSON.stringify( msg));
  };
  render = () => {
    return (
      <div className="App">
        <h1>Stocks</h1>
        This is the home page
        <input type="text" onChange={this.onMessageChanged} value={this.state.message_text}/>
        <button type="button" onClick={this.onSendClicked}>Send</button>
      </div>
    );
  };
}
