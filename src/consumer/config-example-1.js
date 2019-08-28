module.exports = {
  kafkaBootstrap: '127.0.0.1:9092',
  groupId: 'voytek-solution.group.example1',
  clientId: 'voytek-solution.example2' + Math.random().toString(26).slice(2),
  topicName: 'voytek-solutions.data.example1',
};
