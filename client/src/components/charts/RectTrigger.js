import React from 'react';

export default (props) => {
  const {x,y,width,height,fill} = props;
  const onMouseEnter = (e) => {
    props.onMouseEnter( e, props.ndx);
  };
  return (
    <rect  x={x} y={y} width={width} height={height} fill={fill}
      onMouseEnter={onMouseEnter}
      onMouseLeave={props.onMouseLeave} />
  );
}
