# node-js-homework
Prerequisites:
1. latest LTS version of Node.js

To start please run: 
1. npm ci
2. npm run build
3. npm run dev
4. open postman and check the endpoints (please note that body should be in JSON format)
you can find some test data in testData.txt:
   a) get '/users' - list of users (has query parameters: 'limit' and 'loginSubstring')
   b) post '/users' - creates new user 
   c) put '/users/update/:id' - updates a user by id or creates one if id is not found
   d) delete '/users/:id' - marks user as deleted by id
   e) get '/users/:id' - returns a user by id
