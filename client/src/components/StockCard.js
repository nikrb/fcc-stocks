import React from 'react';

export default class StockCard extends React.Component {
  onDelete = () => {
    this.props.onDelete( this.props.code);
  };
  render = () => {
    const {code, description,colour} = this.props;
    const card = {
      display:"flex",
      flexDirection: "row",
      flexBasis: "24%",
      flexShrink: "1",
      border: "none",
      borderLeft: `3px solid ${colour}`,
    };
    const desc_style = {
      margin: "10px",
      padding: "0",
      fontSize: "0.8em",
      fontStyle: "italic"
    };
    return (
      <div style={card}>
        <button type="button" onClick={this.onDelete} >X</button>
        <div>
          {code}
          <div style={desc_style}>{description}</div>
        </div>
      </div>
    );
  };
};
