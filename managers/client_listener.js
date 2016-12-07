class ClientListener {
  // when a client connects, they get their own aggregator
  // this class just manages client connections and routes their messages to the aggregator
  constructor(config, router) {
    this._port = config.client_port;
    this._router = router;
  }

  listen() {
    console.log("Setting up listener for clients on " + this._port);
    const WebSocketServer = require('ws').Server;
    this._server = new WebSocketServer({ port: this._port });
    this._server.on('connection', this.clientConnect.bind(this));
  }

  clientConnect(ws) {
    // hooray, you get an aggregator
    const Aggregator = require('../managers/aggregator');

    // Aggregator will now handle all this clients queries
    let aggregator = new Aggregator(ws, this._router);

    ws.on('close', () => {
      aggregator.close();
      aggregator = null;
    });

    aggregator.start();
  }

  getConnectedClients() {
    return 0;
  }
}

module.exports = ClientListener;