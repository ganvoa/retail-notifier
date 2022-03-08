stop:
	@docker-compose stop

start:
	@docker-compose build && docker-compose up -d

start-others:
	@docker-compose up -d rabbitmq elasticsearch kibana

monitor:
	@docker-compose exec scrapper pm2 monit