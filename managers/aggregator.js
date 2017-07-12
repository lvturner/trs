class Aggregator {
  constructor(ws, router) {
    this._ws = ws;
    this._router = router;
    this._tickers = [];
    this._boundHandler = this.tickerEvent.bind(this);
  }

  start() {
    this._ws.on('message', this.processMessage.bind(this));
  }

  processMessage(message) {
    message = JSON.parse(message);
    switch (message.type) {
      case "S":
        this.subscribe(message.ticker.toLowerCase());
        break;
      case "U":
        this.unsubscribe(message.ticker.toLowerCase());
        break;
      case "F":
        this.firehose();
        break;
    }
  }

  firehose() {
    this._router.firehose.on('tick', this._boundHandler);
  }

  subscribe(ticker) {
    this._router.checkTickerHandler(ticker);
    this._router.tickers[ticker].on('tick', this._boundHandler);
    this._tickers.push(ticker);
    this._ws.send("Subscribed to " + ticker);
  }

  unsubscribe(ticker) {
    if(this._tickers.includes(ticker)) {
      this._router.tickers[ticker].removeListener('tick', this._boundHandler);
      let idx = this._tickers.indexOf(ticker);
      this._tickers.splice(idx, 1);
    } else {
      this._ws.send("You aren't subscribed to ticker: " + ticker);
    }
  }

  tickerEvent(data) {
    // Maybe we want to send this as binary or smth?
    try {
      this._ws.send(JSON.stringify(data));
    } catch(error) {
      throw new Error(error);
    }
  }

  close() {
    // connection closed
    for(let x  = 0; x < this._tickers.length; x++) {
      let ticker = this._tickers[x];
      this._router.tickers[ticker].removeListener('tick', this._boundHandler);
    }

    this._tickers = null;
  }
}

module.exports = Aggregator;
