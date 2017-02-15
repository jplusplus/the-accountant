run:
		./node_modules/.bin/webpack-dashboard -p 3030 -- ./node_modules/.bin/gulp serve

deploy:
		node_modules/.bin/gulp deploy

install:
		yarn || npm install

test:
		npm run test:auto
