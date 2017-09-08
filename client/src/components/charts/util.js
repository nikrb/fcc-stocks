import moment from 'moment';

export const genLastWeekdays = ( date, day_count) => {
  let dt = moment( date).add( 1, 'days');
  return Array.from({length:day_count}, (v,i) => {
    dt.subtract( 1, 'days');
    while( dt.day() < 1 || dt.day() > 5 ){
      dt.subtract( 1, 'days');
    }
    return moment( dt);
  });
};

export const normaliseData = ( data, days) => {
  const new_data = [];
  let data_ndx = 0;
  let last_close = 0;
  days.forEach( (d,i) => {
    if( data_ndx >= data.length){
      console.log( "we ran out of data");
      new_data.push( { date: d.format( 'YYYY-MM-DD'), close: last_close});
    } else if( d.isSame( data[data_ndx].date, 'day')) {
      last_close = data[data_ndx].close;
      new_data.push( {...data[data_ndx]});
      data_ndx += 1;
    } else if( d.isAfter( data[data_ndx].date, 'day')) {
      new_data.push( {date: d.format( 'YYYY-MM-DD'), close:last_close});
    } else { // if( d.isBefore( data[data_ndx], 'day')){
      // we have a data value that isn't in our 100 day list
      console.log( `days [${d.format('YYYY-MM-DD')}] is before data[${data[data_ndx].date}]`);
      while( d.isBefore( data[data_ndx].date, 'day') && data_ndx < data.length){
        data_ndx += 1;
      }
      console.log( `now comparing data:`,data[data_ndx]);
      if( data[data_ndx]){
        if( d.isSame( data[data_ndx].date, 'day')){
          console.log( "adding to new data");
          last_close = data[data_ndx].close;
          new_data.push( {date: d.format( 'YYYY-MM-DD'), close: last_close});
          data_ndx += 1;
        } else {
          console.log( "not the same");
        }
      }
    }
  });
  return new_data;
};
