'use strict';

var path = require('path');
var serverPath = path.join(path.dirname(module.parent.filename), '../../../server/');
var kafka = require('kafka-node');

module.exports = function(options) {
  options = options || {};

  var canReceive = true;
  if (!options['consumerHandler']) {
    console.warn('You have to define a consumer handling module');
    canReceive = false;
  }
  if (!process.env.KAFKA_URL) {
    console.warn('Kafka url not set, events will not received. Please set KAFKA_URL.');
    canReceive = false;
  }
  if (!process.env.KAFKA_TOPIC) {
    console.warn('Kafka topic not set, events will not received. Please set KAFKA_TOPIC');
    canReceive = false;
  }

  if (canReceive) {
    var handler = require(path.join(serverPath, options['consumerHandler']));
    console.log(handler);
    var Consumer = kafka.Consumer;
    var client = new kafka.Client(process.env.KAFKA_URL);
    var consumer = new Consumer(client,
      [{topic: process.env.KAFKA_TOPIC, offset: 0}],
      {
        autoCommit: true,
      }
    );

    consumer.on('message', function(message) {
      if (handler.onMessage && typeof handler.onMessage === 'function') {
        handler.onMessage(message);
	  } else {
        console.log(JSON.parse(message.value));
	  }
    });

    consumer.on('error', function(err) {
      if (handler.onError && typeof handler.onError === 'function') {
        handler.onError(err);
	  } else {
        console.log('Error:', err);
	  }
    });

    consumer.on('offsetOutOfRange', function(err) {
      if (handler.onOffsetOutOfRange && typeof handler.onOffsetOutOfRange === 'function') {
        handler.onOffsetOutOfRange(err);
	  } else {
        console.log('offsetOutOfRange:', err);
	  }
    });
  }

  return function(req, res, next) {
    next();
  };
};
