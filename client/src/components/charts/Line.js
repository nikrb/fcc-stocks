import React from 'react';
import * as d3 from 'd3';

export default class Line extends React.Component {
  render = () => {
    const {xScale,yScale,data,stroke} = this.props;
    // define the line
    const valueline = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.close); });
    return (
        <path d={valueline(data)} fill="transparent" stroke={stroke}/>
    );
  };
};
