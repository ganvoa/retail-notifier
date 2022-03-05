stop:
	@pm2 stop all

clean:
	@pm2 delete all
	@pm2 flush
	@rm -rf build/*

compile:
	@npx tsc

start: stop clean compile
	@pm2 start build/app/abcdin.js --restart-delay 300000 --time
	@pm2 start build/app/paris.js --restart-delay 300000 --time
	@pm2 start build/app/falabella.js --restart-delay 300000 --time
	@pm2 start build/app/ripley.js --restart-delay 300000 --time

monitor:
	@pm2 monit