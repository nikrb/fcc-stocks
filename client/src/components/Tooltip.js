/**
 * usage:
  <ToolTip tip_text={tooltip_text} pos={tooltip} />
  where pos is: {
    display: ["block"|"none"],
    top: tooltip_y,
    left: tooltip_x
  }
 */
import React from 'react';

export default ( props) => {
  const style =  {
    position: "absolute",
    textAlign: "center",
    width: props.width?props.width : "",
    whiteSpace: "pre",
    padding: "5px",
    font: "12px sans-serif",
    background: "lightsteelblue",
    border: "0px",
    borderRadius: "8px",
    pointerEvents: "none"
  };
  const tips = props.tip_text.map( (txt, ndx) => {
    return (
      <div key={ndx}>{txt}</div>
    );
  });
  return (
    <div style={{...style, ...props.pos}}>
      {tips}
    </div>
  );
};
