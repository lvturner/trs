class TiingoDataService {
  constructor(config, router) {
    this._url = config.tiingo_ws_urls.iex;
    this._apiKey = config.tiingo_api_key;
    this._router = router;
  }

  connect() {
    console.log("Connecting Tiingo (IEX) data service");
    const WebSocket = require('ws');
    this._ws = new WebSocket(this._url);
    this._ws.on('open', this.wsOpen.bind(this));
    this._ws.on('message', this.wsMessage.bind(this));
    this._ws.on('close', this.wsClose.bind(this));
    this._ws.on('error', this.wsError.bind(this));
  }

  wsClose() {
    // TODO come up with some sort of smarter reconnection strategy!
    throw new Error("Disconnected!");
  }

  wsError(error) {
    throw new Error(error);
  }

  wsOpen() {
    let subs = {
      'eventName': 'subscribe',
      'authorization': this._apiKey,
      'eventData': { thresholdLevel: 0}
    };

    this._ws.send(JSON.stringify(subs));

    setInterval(() => {
      this._ws.ping();
    }, 1000);
  }

  wsMessage(data, flags) {
    let response = JSON.parse(data);
    if(response.messageType === "A") {
      this._router.processMessage(response.data);
    }

    if(response.messageType === "E") {
      throw new Error("[" + response.code + "] " + response.message);
    }

    if(response.messageType === "H") {
      // process.stdout.write("❤️ ");
    }

    if(response.messageType === "I") {
      // console.log(data);
    }
  }
}

module.exports = TiingoDataService;
