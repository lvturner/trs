class Router {
  constructor() {
    this.tickerList = [];
    this.tickerEvents = {};
  }

  get tickers() {
    return this.tickerEvents;
  }

  processMessage(message) {
    let ticker = message[3];

    this.checkTickerHandler(ticker);

    this.tickerEvents[ticker].emit('tick', message);
  }

  checkTickerHandler(ticker) {
    if (!this.tickerList.includes(ticker)) {
      // send event to subscribers of this ticker
      const EventEmitter = require('events').EventEmitter;

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
