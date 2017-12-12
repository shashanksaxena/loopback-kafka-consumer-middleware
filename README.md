[![NPM](https://nodei.co/npm/loopback-kafka-consumer-middleware.png?compact=true)](https://nodei.co/npm/loopback-kafka-consumer-middleware/)
# Loopback kafka consumer middleware

This is a simple middleware listening for kafka events on a speficied topic.

INSTALL
=============

```bash
  npm install loopback-kafka-consumer-middleware --save
```

SERVER CONFIG
=============

Add the middleware to your *middleware.json*:

```json
{
  "loopback-kafka-consumer-middleware": {
    "params": {
      "consumerHandler": "./kafkaEventHandler"
    }
  }
}
```

HANDLER
=============

You need to define an event handler (in the previous example config, kafkaEventHandler.js) with the following structure in the loopback server directory.

```javascript
'use strict';

module.exports = {
  onMessage: function(message) {
    console.log('Msg: ' + JSON.stringify(message));
  },
  onError: function(err) {
    console.log(err);
  },
  onOffsetOutOfRange: function(err) {
    console.log(err);
  },
};
```

CONNEXIONS
=============

To be able to connect to your kafka host or zookeeper host and listen for events in the topic, you have to set the KAFKA_URL and KAFKA_TOPIC env variables

```bash
export KAFKA_URL=192.168.99.100:2181
export KAFKA_TOPIC=node-test
```

LICENSE
=============
[Apache-2.0] (LICENSE)
