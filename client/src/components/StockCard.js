import React from 'react';

export default class StockCard extends React.Component {
  onDelete = () => {
    this.props.onDelete( this.props.code);
  };
  render = () => {
    const {code, description} = this.props;
    const card = {
      display:"flex",
      flexDirection: "row"
    };
    return (
      <div style={card}>
        <button type="button" onClick={this.onDelete} >X</button>
        <div>
          {code}
          <p>{description}</p>
        </div>
      </div>
    );
  };
};
