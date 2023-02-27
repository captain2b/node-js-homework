# node-js-homework
Prerequisites:
1. latest LTS version of Node.js
2. rename file '.env.example' to '.env' and populate with data

To start please run: 
1. npm ci
2. npm run build
3. npm run dev
4. open postman and check the endpoints (please note that body should be in JSON format)
you can find some test data in testData.txt:
   Users:
   a) get '/users' - list of users (has query parameters: 'limit' and 'loginSubstring')
   b) post '/users' - creates new user 
   c) put '/users/:id' - updates a user by id or creates one if id is not found
   d) delete '/users/:id' - marks user as deleted by id
   e) get '/users/:id' - returns a user by id
   
   Groups:
   a) get '/groups' - list of groups
   b) post '/groups' - creates new group 
   c) put '/groups/:id' - updates a group by id or creates one if id is not found
   d) delete '/groups/:id' - deletes a group
   e) get '/groups/:id' - returns a group by id
   f) get '/groups/:id/users' - returns a list of users in a group by group id
   f) post '/groups/:id/users' - adds users to a group by group id
