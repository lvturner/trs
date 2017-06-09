### Tick Relay Server

This is a very simple websocket relay for market data.

Currently the only supported data set is [Tiingo's IEX Realtime feed](https://api.tiingo.com/docs/iex/realtime) however adding another data source is just a case of creating another data_service in 'data_services' and it will be automatically loaded in on server initialisation.

### Usage

Edit config.json to include your Tiingo API key, and adjust the port to your liking then run `node bin/server` to get things up and running.

### Example client

Subscribe to tick data for SPY and print it to the console - data follows the format detailed in [Tiingo's Documentation](https://api.tiingo.com/docs/iex/realtime)

```javascript
const WebSocket = require('ws');
const ws = new WebSocket("ws://127.0.0.1:1337");

ws.on('open', () => {
  ws.send(JSON.stringify({ type: "S", ticker: "SPY" }));
})

ws.on('message', (data, flags) => {
  console.log(data);
});
```



### Notes

* Currently no authentication on client connections
* Currently no ability to subscribe to a 'firehose' of all tickers
* Currently doesn't run with NodeJS's cluster model
* Only Tiingo's IEX feed supported as a data_service