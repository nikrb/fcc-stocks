import React from 'react';
import * as d3 from 'd3';
import weekday from './weekday';

export default class Axis extends React.Component {
  componentDidMount = () => {
    this.renderAxis();
  };
  componentDidUpdate = () => {
    this.renderAxis();
  };
  renderAxis = () => {
    if( this.props.orient === "horiz"){
      const dateFormat = d3.timeFormat( "%b-%d");
      const haxis = d3.axisBottom( this.props.scale)
        .tickFormat( (d) => dateFormat( weekday.invert(d)));
      // FIXME: this.refs.axis isn't working here
      haxis( d3.select( '.horiz'));
    } else {
      const haxis = d3.axisLeft( this.props.scale);
      haxis( d3.select( '.vert'));
    }
  };

  render = () => {
    let cn = `${this.props.orient}`;
    if( this.props.orient === "horiz"){
      cn += ` axis_centre`;
    }
    return <g className={cn} transform={this.props.translate} ></g>;
  };
}
