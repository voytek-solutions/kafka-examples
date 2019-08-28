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

// High LevelProducer - uncomment to roundrobin partitions
//const kafkaProducer = new kafka.HighLevelProducer(client);
const kafkaProducer = new kafka.Producer(client);

app = new App(kafkaProducer, configuration);

client.on('ready', () => {
  console.log(' :: Client ready')
  app.bootstrap(client)
    .then(() => {
      app.start();
    })
})
