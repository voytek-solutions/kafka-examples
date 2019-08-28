// data is static to all instances of class Applications
class Application {
  constructor(kafkaConsumer, configuration) {
    this.consumer = kafkaConsumer;
    this.configuration = configuration;
    this.state = {};
  }

  bootstrap(kafkaClient) {
    console.log('bootstraping...');

    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  start() {
    setInterval(this.tick.bind(this), 1000);
    var self = this;
    // consume
    this.consumer.on('message', function (message) {
      self._updateState(message)
    });
  }

  tick() {
    this.printState()
  }

  printState() {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    for (var i in this.state) {
      console.log("| " + i + " | " + this.state[i].count + " | " + this.state[i].value);
    }
  }

  _updateState(message) {
    var count = 0
    if (this.state[message.key]) {
      count = this.state[message.key].count + 1;
    }

    this.state[message.key] = {
      value: message.value,
      count: count
    };
  }
}

module.exports = Application
