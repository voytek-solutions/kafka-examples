PWD = $(shell pwd)

producer: kafka.up
	@echo " :: Start up producer"
	docker run -v $(PWD):/build -w /build node:11-slim nodejs src/producer/index.js

consumer: kafka.up
	@echo " :: Start up consumer"

kafka.up:
	@echo " :: Start up Kafka"
	cd docker-compose/single-node && \
		docker-compose up -d --build

kafka.down:
	@echo " :: Start up Kafka"
	cd docker-compose/single-node && \
		docker-compose down
