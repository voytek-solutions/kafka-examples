PWD = $(shell pwd)

producer: kafka.up
	@echo " :: Start up producer"
	docker run \
		-v $(PWD):/build \
		-w /build \
		--network single-node_default \
		--env "CONFIG_FILE=./config-example-$(EXAMPLE).js" \
		node:11-slim \
		nodejs src/producer/index.js

consumer: kafka.up
	@echo " :: Start up consumer"
	docker run \
		-v $(PWD):/build \
		-w /build \
		--network single-node_default \
		--env "CONFIG_FILE=./config-example-$(EXAMPLE).js" \
		node:11-slim \
		nodejs src/consumer/index.js

kafka.up:
	@echo " :: Start up Kafka"
	cd docker-compose/single-node && \
		docker-compose up -d --build

kafka.down:
	@echo " :: Start up Kafka"
	cd docker-compose/single-node && \
		docker-compose down
