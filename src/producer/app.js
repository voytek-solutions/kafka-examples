// data is static to all instances of class Application
const data = require('./data');

class Application {
  constructor(kafkaProducer, configuration) {
    this.producer = kafkaProducer;
    this.configuration = configuration;
    this.putInitialMessage = false;
  }

  bootstrap(kafkaClient) {
    console.log('bootstraping...')

    // check if topic exist
    const topic = [{
      topic: this.configuration.topicName,
      partitions: 10,
      replicationFactor: 1,
      configEntries: this.configuration.topicConfigEntries,
    }];
    var self = this

    return new Promise((resolve, reject) => {
      kafkaClient.createTopics(topic, (err, data) => {
        if (err) {
          console.error('Bootstrap Error', err)
          reject(err)
        }

        self._createTopicHandler(data);
        console.log('bootstraping finished')
        resolve();
      })
    })
  }

  start() {
    if (this.putInitialMessage) {
      this._sendMessage('Initial marker', 11, 0)
    }
    setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    const randomDataIndex = Math.floor(Math.random() * data.length)
    const randomKey = Math.floor(Math.random() * 10)

    this._sendMessage(data[randomDataIndex], randomKey, randomKey)
  }

  _sendMessage(message, key, partition) {
    console.log(key + ": " + message)
    this.producer.send([{
      topic: this.configuration.topicName,
      messages: message,
      key: key,
      partition: partition,
    }], function (err, data) {
      if (err) {
        console.log('Producer error', err);
      }
    });
  }

  _createTopicHandler(data) {
    if (data.length > 0) {
      if (data[0].topic == this.configuration.topicName) {
        console.log('topic already created.')
      }
    }
    else {
      this.putInitialMessage = true;
    }
  }
}

module.exports = Application
