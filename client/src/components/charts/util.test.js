import moment from 'moment';
import {genLastWeekdays, normaliseData} from './util';

it('gets five days', () => {
  const expected = ["2017-09-05", "2017-09-04", "2017-09-01", "2017-08-31", "2017-08-30"];
  const dt = moment( "2017-09-05", 'YYYY-MM-DD');
  const res = genLastWeekdays( dt, 5);
  const fres = res.map( d => d.format( 'YYYY-MM-DD'));
  expect( fres).toEqual( expected);
});

it( 'normalises data that is ok', () => {
  const dates = ["2017-09-05", "2017-09-04", "2017-09-01", "2017-08-31", "2017-08-30"];
  const expected = [
    { date:"2017-09-05", close: 10},
    { date:"2017-09-04", close: 9},
    { date:"2017-09-01", close: 8},
    { date:"2017-08-31", close: 7},
    { date:"2017-08-30", close: 6}
  ];
  const test = [
    { date:"2017-09-05", close: 10},
    { date:"2017-09-04", close: 9},
    { date:"2017-09-01", close: 8},
    { date:"2017-08-31", close: 7},
    { date:"2017-08-30", close: 6}
  ];
  const dt = moment( "2017-09-05", 'YYYY-MM-DD');
  const days = genLastWeekdays( dt, 5);
  const res = normaliseData( test, days);
  expect( res).toEqual( expected);
});
it( 'normalises data missing a middle data point', () => {
  const dates = ["2017-09-05", "2017-09-04", "2017-09-01", "2017-08-31", "2017-08-30"];
  const expected = [
    { date:"2017-09-05", close: 10},
    { date:"2017-09-04", close: 9},
    { date:"2017-09-01", close: 9},
    { date:"2017-08-31", close: 7},
    { date:"2017-08-30", close: 6}
  ];
  const test = [
    { date:"2017-09-05", close: 10},
    { date:"2017-09-04", close: 9},
    { date:"2017-08-31", close: 7},
    { date:"2017-08-30", close: 6}
  ];
  const dt = moment( "2017-09-05", 'YYYY-MM-DD');
  const days = genLastWeekdays( dt, 5);
  const data = normaliseData( test, days);
  expect( data).toEqual( expected);
});
it( 'normalises data with an extra data point', () => {
  const dates = ["2017-09-05", "2017-09-04", "2017-09-01", "2017-08-31", "2017-08-30"];
  const expected = [
    { date:"2017-09-05", close: 10},
    { date:"2017-09-04", close: 9},
    { date:"2017-09-01", close: 8},
    { date:"2017-08-31", close: 7},
    { date:"2017-08-30", close: 6}
  ];
  const test = [
    { date:"2017-09-05", close: 10},
    { date:"2017-09-04", close: 9},
    { date:"2017-09-03", close: 30},
    { date:"2017-09-01", close: 8},
    { date:"2017-08-31", close: 7},
    { date:"2017-08-30", close: 6}
  ];
  const dt = moment( "2017-09-05", 'YYYY-MM-DD');
  const days = genLastWeekdays( dt, 5);
  const data = normaliseData( test, days);
  expect( data).toEqual( expected);
});
