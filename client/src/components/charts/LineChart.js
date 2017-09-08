import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Line from './Line';
import XYAxis from './XYAxis';
import RectTrigger from './RectTrigger';

export default class LineChart extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    margin: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    cScale: PropTypes.func.isRequired
  };
  render = () => {
    const {width,height,margin,cScale, highlight_ndx,data} = this.props;
    const inner_width = width-margin.left-margin.right;
    const inner_height = height - margin.top - margin.bottom;
    const transform = `translate( ${margin.left}, ${margin.top})`;
    // set the ranges
    const xScale = d3.scaleTime().range([0, inner_width]);
    const yScale = d3.scaleLinear().range([inner_height, 0]);

    // flatten the array of lines to find boundary values
    const fd = data.concatAll();
    // xScale.domain(d3.extent(fd, function(d) { return d.date; }));
    xScale.domain( d3.extent( fd, d => d.weekday));
    yScale.domain([d3.min(fd, d => d.close), d3.max(fd, d => d.close )]);
    let highlight = null;
    if( highlight_ndx > -1){
      let dt = "";
      if( data[0] && data[0][highlight_ndx]){
        dt = data[0][highlight_ndx].weekday;
      }
      highlight = <line x1={xScale(dt)} x2={xScale(dt)}
        y1={0} y2={inner_height} stroke="black" />;
    }
    const trigger_width = Math.floor( width/100)-1;
    const half_trigger_width = Math.floor( trigger_width/2);
    const rects = data[0].map( (price, i) => {
      return <RectTrigger key={i} x={xScale(price.weekday)-half_trigger_width} y={0}
        width={trigger_width} height={inner_height} fill="transparent" ndx={i}
        onMouseEnter={this.props.onTargetRectEnter}
        onMouseLeave={this.props.onTargetRectLeave} />;
    });
    const lines = data.map( (line,i) => {
        return <Line key={i} data={line} xScale={xScale} yScale={yScale}
          fill="transparent" stroke={cScale( i)}/>;
    });
    const dots = data.map( (line,i) => {
      return line.map( (l,j) => {
        return <circle key={i*100+j} cx={xScale(l.weekday)} cy={yScale(l.close)}
          r="3" fill={cScale(i)} />;
      });
    });
    return (
      <svg width={width} height={height}>
        <g transform={transform} >
          {highlight}
          {lines}
          {dots}
          {rects}
        </g>
        <XYAxis scales={{xScale,yScale}} margins={margin} height={height} width={width} />
      </svg>
    );
  };
};
