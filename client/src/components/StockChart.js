import React from 'react';
import {LineChart} from './charts';
import StockCard from './StockCard';
import {Legend} from './charts';
import Tooltip from './Tooltip';
import Loader from '../images/loader.gif';
import * as d3 from 'd3';

export default class StockChart extends React.Component {
  state = {
    tooltip_text: [],
    tooltip_visible: false,
    tooltip_pos : {x: 0, y:0},
    tooltip_ndx : -1
  };
  onTooltipTargetEnter = (e, ndx) => {
    const tip_data = this.props.stocks.map( (stock) => {
      let ret = {};
      if( stock.data[ndx]){
        ret = { code: stock.code, date: stock.data[ndx].date, close: stock.data[ndx].close };
      }
      return ret;
    });
    let date = "";
    const text = tip_data.reduce( (acc, c) => {
      let ret = acc;
      if( c.code){
        date = c.date;
        ret = acc.concat( c.code+" "+c.close);
      }
      return ret;
    }, []);
    this.setState( { tooltip_text: [date, ...text],
      tooltip_visible:true,
      tooltip_pos: {x: e.clientX, y: e.clientY},
      tooltip_ndx: ndx
    });
  };
  onTooltipTargetLeave = () => {
    this.setState( { tooltip_visible: false, tooltip_ndx: -1});
  };
  render = () => {
    const {stocks, margin, width, height} = this.props;
    const cScale = d3.scaleOrdinal(d3.schemeCategory10);
    const stock_cards = stocks.map( (s,i) => {
      return (
        <StockCard key={i} code={s.code} description={s.description}
          onDelete={this.props.onRemoveStock} colour={cScale(i)} />
      );
    });
    const stock_data = this.props.stocks.map( (stock) => {
      return [...stock.data];
    });
    const stock_card_wrapper = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap"
    };
    const wrapper = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    };
    const tooltip = {display: (this.state.tooltip_visible)?"block":"none",
      left: this.state.tooltip_pos.x,
      top: this.state.tooltip_pos.y,
      padding: "10px"
    };
    return (
      <div style={wrapper}>
        <div>{stock_data.length?
            <LineChart data={stock_data} margin={margin}
              width={width} height={height} cScale={cScale}
              onTargetRectEnter={this.onTooltipTargetEnter}
              onTargetRectLeave={this.onTooltipTargetLeave}
              highlight_ndx={this.state.tooltip_ndx}/>
            : <p><img src={Loader} alt="Please wait ...." /></p>
        }
        </div>
        <div>
          <Legend stocks={stocks} cScale={cScale} />
        </div>
        <div style={stock_card_wrapper}>
          {stock_cards}
        </div>
        <Tooltip tip_text={this.state.tooltip_text} pos={tooltip} />
      </div>
    );
  };
};
