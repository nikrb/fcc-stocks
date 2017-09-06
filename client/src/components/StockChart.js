import React from 'react';
import {LineChart} from './charts';
import StockCard from './StockCard';
import Loader from '../images/loader.gif';

export default class StockChart extends React.Component {
  render = () => {
    const {stocks, margin, width, height} = this.props;
    const stock_cards = stocks.map( (s,i) => {
      return (
        <StockCard key={i} code={s.code} description={s.description}
          onDelete={this.props.onRemoveStock} colour="red" />
      );
    });
    const stock_data = this.props.stocks.map( (stock) => {
      return [...stock.data];
    });
    const stock_card_wrapper = {
      display: "flex",
      flexDirection: "row"
    };
    return (
      <div>
        <div>{stock_data.length?
            <LineChart data={stock_data} margin={margin}
              width={width} height={height} />
            : <p><img src={Loader} alt="Please wait ...." /></p>
        }
        </div>
        <div style={stock_card_wrapper}>
          {stock_cards}
        </div>
      </div>
    );
  };
};
