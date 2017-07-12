const EventEmitter = require('events').EventEmitter;

class Router {
  constructor() {
    this.tickerList = [];
    this.tickerEvents = {};
    this.firehose = new EventEmitter();
    this.firehose.setMaxListeners(0);
  }

  get tickers() {
    return this.tickerEvents;
  }

  processMessage(message) {
    let ticker = message[3];

    this.checkTickerHandler(ticker);

    this.tickerEvents[ticker].emit('tick', message);
    this.firehose.emit('tick', message);
  }

  checkTickerHandler(ticker) {
    if (!this.tickerList.includes(ticker)) {
      // send event to subscribers of this ticker

      this.tickerList.push(ticker);
      this.tickerEvents[ticker] = new EventEmitter();
      this.tickerEvents[ticker].setMaxListeners(0);
    }
  }

  getTickerCount() {
    return this.tickerList.length;
  }
}

module.exports = Router;
