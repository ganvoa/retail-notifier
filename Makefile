up: up-infra up-services
stop: stop-services stop-infra

stop-infra:
	@docker-compose stop rabbitmq elasticsearch

stop-services:
	@docker-compose stop scrapper notifier backend

up-services: up-backend up-notifier up-scrapper

up-backend:
	@docker-compose build && docker-compose up -d backend

up-notifier:
	@docker-compose build && docker-compose up -d notifier

up-scrapper:
	@docker-compose build && docker-compose up -d scrapper

up-infra:
	@docker-compose up -d rabbitmq elasticsearch

up-kibana:
	@docker-compose up -d kibana

monitor-scrapper:
	@docker-compose exec scrapper pm2 monit

monitor-notifier:
	@docker-compose exec notifier pm2 monit

monitor-backend:
	@docker-compose exec backend pm2 monit