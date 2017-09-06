import React from 'react';

export default class Legend extends React.Component {
  render = () => {
    const {stocks, cScale} = this.props;
    const ul_style = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      listStyleType: "square"
    };
    const legends = stocks.map( (stock,i) => {
      return (
        <li key={i} style={{marginLeft:"2em", color:cScale(i)}}>
          {stock.code}
        </li>
      );
    });
    return (
      <div>
        <ul style={ul_style}>
          {legends}
        </ul>
      </div>
    );
  };
};
