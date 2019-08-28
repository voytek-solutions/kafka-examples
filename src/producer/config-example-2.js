module.exports = {
  kafkaBootstrap: 'kafka:29092',
  groupId: 'voytek-solution.group.example2',
  topicName: 'voytek-solutions.data.example2',
  topicConfigEntries: [
    {
      name: 'cleanup.policy',
      value: 'compact'
    },
    { // for demo, we want to keep segment files small (1k), to encourage cleanup process
      name: 'segment.bytes',
      value: '1024'
    },
    { // keep messages for 60s min
      name: 'retention.ms',
      value: '30000'
    },
    // { // keep messages for 60s min before compaction can
    //   name: 'max.compaction.lag.ms',
    //   value: '10000'
    // },
    { // keep messages for 60s min before compaction can
      name: 'min.cleanable.dirty.ratio',
      value: '0.01'
    },
  ]
};
