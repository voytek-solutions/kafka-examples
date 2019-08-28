const kafka = require('kafka-node');
const App = require('./app');
const configurationFile = process.env.CONFIG_FILE || './config-example-1';
const configuration = require(configurationFile)

const client = new kafka.KafkaClient({
  kafkaHost: configuration.kafkaBootstrap,
  requestTimeout: 1000,
  clientId: configuration.clientId,
});

client.on('error', function (err) {
  console.error('Client error', err)
});

const kafkaConsumer = new kafka.Consumer({
  kafkaHost: configuration.kafkaBootstrap,
  groupId: configuration.groupId,
  clientId: configuration.clientId,
  fromOffset: 'earliest',
}, [configuration.topicName]);

app = new App(kafkaConsumer, configuration);

app.bootstrap(client)
  .then(() => {
    app.start();
  })
