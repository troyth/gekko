// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  //start the strategy only after enough candles have passed to initiate the longest MA
  this.requiredHistory = this.tradingAdvisor.historySize;

  // add the Simple Moving Average (SMA) indicators to the strategy
  this.addIndicator('simpma_8', 'SMA', 8);
  this.addIndicator('simpma_78', 'SMA', 78);

  this.trend = {
    direction: 'none',
    duration: 0
  };
}

// What happens on every new candle?
strat.update = function(candle) {
  // nothing!
}

// For debugging purposes.
strat.log = function() {
  // your code!
}

// Based on the newly calculated
// information, check if we should
// update or not.
/*
  candle = { start: moment("2020-11-06T09:16:00.000"),
    open: 433.75,
    high: 446.58,
    low: 426,
    close: 440.49,
    vwp: 437.6252572909475,
    volume: 352351.95558,
    trades: 116515
  }
  */
strat.check = function(candle) {
  //load indicator results
  var ma8 = this.indicators.simpma_8.result;
  var ma78 = this.indicators.simpma_78.result;


  //if MAs cross over
  if(ma8 > ma78){
    //only advise (buy) if change in direction
    if(this.trend.direction != 'up'){
      this.trend.direction = 'up';
      this.trend.duration = 0;
      console.log("BOUGHT AT: " + candle.close);
      this.advice('long');
    }else{
      //continuation of trend
      this.trend.duration++;
    }
  }else{
    //only advise (sell) if change in direction
    if(this.trend.direction != 'down'){
      this.trend.direction = 'down';
      this.trend.duration = 0;
      console.log("SOLD AT: " + candle.close);
      this.advice('short');
    }else{
      //continuation of trend
      this.trend.duration++;
    }
  }// end cross over

  console.log("\n check, day: " + candle.start.format('MMMM Do YYYY, h:mm:ss a'));
  console.log(this.trend);

}

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function() {
  // your code!
}

module.exports = strat;
