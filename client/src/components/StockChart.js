import React from 'react';
import {LineChart} from './charts';
import StockCard from './StockCard';
import {Legend} from './charts';
import Loader from '../images/loader.gif';
import * as d3 from 'd3';

export default class StockChart extends React.Component {
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
      flexWrap: "wrap"
    };
    const wrapper = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    };
    return (
      <div style={wrapper}>
        <div>{stock_data.length?
            <LineChart data={stock_data} margin={margin}
              width={width} height={height} cScale={cScale} />
            : <p><img src={Loader} alt="Please wait ...." /></p>
        }
        </div>
        <div>
          <Legend stocks={stocks} cScale={cScale} />
        </div>
        <div style={stock_card_wrapper}>
          {stock_cards}
        </div>
      </div>
    );
  };
};
