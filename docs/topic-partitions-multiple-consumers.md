# Topic Partitions and Multiple Consumers

This example shows:
* How "delete" cleanup policy works and what "partition segment" is.
* What topic partition is, and how you can use it for parallel processing.
* What Consumer Group is, and how it helps with parallel processing.

![](./img/example1.jpg)


## Delete Cleanup Policy and Segments

For this demo we would use 2 terminals.

It will show how "delete cleanup" works, and how data is stored in partition's
segments.

In **terminal 1** let's start up Kafka.

```BASH
make kafka.up
```

In **terminal 2** we will start up producer.

```BASH
make producer EXAMPLE=1
```

Back to **terminal 1**. Let's see segments files being created and filled with data.
A segment is just a file where Kafka saves messages. Segment has a maximum size
which you can control using `segment.bytes` topic configuration. Default size is
set to 1GB. For our demo it is set to 1k.

```BASH
docker exec -it single-node_kafka_1 watch ls -lh /var/lib/kafka/data/voytek-solutions.data.example1-*/*.log
```

Soon (2-3 minutes), cleanup process will kick in, and delete old segments. You can
see that by looking just for segments ending `000.log`.

```
  982 Aug 28 10:22 voytek-solutions.data.example1-0/00000000000000000001.log
  948 Aug 28 10:23 voytek-solutions.data.example1-0/00000000000000000012.log
  164 Aug 28 10:24 voytek-solutions.data.example1-0/00000000000000000022.log
 1002 Aug 28 10:21 voytek-solutions.data.example1-1/00000000000000000000.log
  979 Aug 28 10:23 voytek-solutions.data.example1-1/00000000000000000010.log
  813 Aug 28 10:24 voytek-solutions.data.example1-1/00000000000000000020.log
  974 Aug 28 10:22 voytek-solutions.data.example1-2/00000000000000000001.log
  975 Aug 28 10:23 voytek-solutions.data.example1-2/00000000000000000011.log
  220 Aug 28 10:24 voytek-solutions.data.example1-2/00000000000000000021.log
  965 Aug 28 10:21 voytek-solutions.data.example1-3/00000000000000000000.log
  975 Aug 28 10:23 voytek-solutions.data.example1-3/00000000000000000010.log
  793 Aug 28 10:24 voytek-solutions.data.example1-3/00000000000000000020.log
  960 Aug 28 10:20 voytek-solutions.data.example1-4/00000000000000000000.log
 1010 Aug 28 10:23 voytek-solutions.data.example1-4/00000000000000000010.log
  687 Aug 28 10:24 voytek-solutions.data.example1-4/00000000000000000021.log
  954 Aug 28 10:21 voytek-solutions.data.example1-5/00000000000000000000.log
  950 Aug 28 10:22 voytek-solutions.data.example1-5/00000000000000000010.log
  950 Aug 28 10:23 voytek-solutions.data.example1-5/00000000000000000020.log
  298 Aug 28 10:24 voytek-solutions.data.example1-5/00000000000000000030.log
  935 Aug 28 10:21 voytek-solutions.data.example1-6/00000000000000000000.log
  977 Aug 28 10:21 voytek-solutions.data.example1-6/00000000000000000009.log
  938 Aug 28 10:22 voytek-solutions.data.example1-6/00000000000000000019.log
  752 Aug 28 10:24 voytek-solutions.data.example1-6/00000000000000000029.log
  990 Aug 28 10:23 voytek-solutions.data.example1-7/00000000000000000000.log
  388 Aug 28 10:24 voytek-solutions.data.example1-7/00000000000000000010.log
  944 Aug 28 10:21 voytek-solutions.data.example1-8/00000000000000000001.log
  986 Aug 28 10:23 voytek-solutions.data.example1-8/00000000000000000011.log
  593 Aug 28 10:24 voytek-solutions.data.example1-8/00000000000000000021.log
  994 Aug 28 10:22 voytek-solutions.data.example1-9/00000000000000000000.log
 1022 Aug 28 10:23 voytek-solutions.data.example1-9/00000000000000000010.log
  121 Aug 28 10:23 voytek-solutions.data.example1-9/00000000000000000021.log
```

Now after cleanup process finished, the old segments are gone, and consumers will
not be able to consume messages from the beginning of the topic (offset 0 for
instance).

```
  375 Aug 28 10:26 voytek-solutions.data.example1-0/00000000000000000027.log
  964 Aug 28 10:26 voytek-solutions.data.example1-1/00000000000000000030.log
  199 Aug 28 10:26 voytek-solutions.data.example1-1/00000000000000000040.log
 1007 Aug 28 10:25 voytek-solutions.data.example1-2/00000000000000000021.log
  192 Aug 28 10:26 voytek-solutions.data.example1-2/00000000000000000031.log
 1005 Aug 28 10:26 voytek-solutions.data.example1-3/00000000000000000030.log
  983 Aug 28 10:25 voytek-solutions.data.example1-4/00000000000000000031.log
  300 Aug 28 10:26 voytek-solutions.data.example1-4/00000000000000000041.log
  377 Aug 28 10:26 voytek-solutions.data.example1-5/00000000000000000038.log
  955 Aug 28 10:26 voytek-solutions.data.example1-6/00000000000000000039.log
  109 Aug 28 10:26 voytek-solutions.data.example1-6/00000000000000000049.log
  748 Aug 28 10:26 voytek-solutions.data.example1-7/00000000000000000020.log
  670 Aug 28 10:26 voytek-solutions.data.example1-8/00000000000000000030.log
  931 Aug 28 10:25 voytek-solutions.data.example1-9/00000000000000000021.log
  454 Aug 28 10:26 voytek-solutions.data.example1-9/00000000000000000030.log
```




## Partitions and Parallel Consumers

Now that we have data in our topic, we will consume it.

For this, your will need 2 more terminals

In **terminal 3 & 4** we will start up 2 consumers

```BASH
make consumer EXAMPLE=1
```

You will notice that each consumer consume messages from its own partitions.
Consumer 1 odd and Consumer 2 even partitions.

Now, stop one of the consumers, and you will see that Kafka will reassign all
partitions to the running consumer.




## Consumer Group

The Consumer Group is what allows you to manage assignment partitions to consumers.
You can see current consumer group configuration using the following command

```BASH
docker exec -it single-node_kafka_1 watch kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group voytek-solution.group.example1
```

Now try starting and stoping more consumers. You will see how Kafka assigns
consumers. You will also notice, that if is start up 11 consumers, the last one
will not receive any data, as it will not be assigned to any partition.s
