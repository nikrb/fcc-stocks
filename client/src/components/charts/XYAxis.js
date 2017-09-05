import React from 'react';
import Axis from './Axis';

export default class XYAxis extends React.Component {
  render = () => {
    const {margins, height} = this.props;
    const xaxis_translate = `translate( ${margins.left}, ${height-margins.bottom} )`;
    const yaxis_translate = `translate( ${margins.left}, ${margins.top} )`;
    return (
      <g>
        <Axis className="axis" orient="horiz"
          translate={xaxis_translate} scale={this.props.scales.xScale} />
        <Axis className="axis" orient="vert"
          translate={yaxis_translate} scale={this.props.scales.yScale} />
      </g>
    );
  };
}
