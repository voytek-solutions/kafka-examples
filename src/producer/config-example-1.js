module.exports = {
  kafkaBootstrap: 'kafka:29092',
  groupId: 'voytek-solution.group.example1',
  topicName: 'voytek-solutions.data.example1',
  topicConfigEntries: [
    {
      name: 'cleanup.policy',
      value: 'delete'
    },
    { // for demo, we want to keep segment files small (1k), to encourage cleanup process
      name: 'segment.bytes',
      value: '1024'
    },
    { // keep messages for 60s min
      name: 'retention.ms',
      value: '10000'
    },
  ]
};
