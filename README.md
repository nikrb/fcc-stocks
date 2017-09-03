fcc project Chart the Stockmarket

# User Stories
1. I can view a graph displaying the recent trend lines for each added stock.
2. I can add new stocks by their symbol name.
3. I can remove stocks.
4. I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.

create a base for react authentication.

* node.js
* react.js
* react-router-dom (react-router v4)
* mongodb & mongoose
* passport.js (passport-local)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Following vlad's authentication [blog](https://vladimirponomarev.com/blog/authentication-in-react-apps-jwt)

# setup

### install mongo
unixy:
```sudo apt-get install mongodb-org```

## development
1. clone repo
2. create .env file, e.g.
```
dbUri=mongodb://localhost:27017/testdb
jwtSecret=somesecretphrase
```
2. npm install (top level and client dirs)
3. startup mongo
4. npm start

## production (cloud9)
1. clone repo
2. create .env file, e.g.
```
dbUri=mongodb://localhost:27017/testdb
jwtSecret=somesecretphrase
NODE_ENV=production
```
3. npm install (top level and client dirs)
4. cd client && npm run build
5. cd ..
6. start mongo
7. node server
