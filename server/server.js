const express = require('express');
const app = express();
require('dotenv').config()

const mongoose = require('mongoose');
const bodyParser =  require('body-parser');

// SANITIZE
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// ERROR MIDDLEWARE
const { handleError, convertToApiError } = require('./middleware/apiError');


// ROUTES
const routes = require('./routes');

const mongooseURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&w=majority`;

mongoose.connect(mongooseURI);

// TO VERIFY TOKEN
const passport = require('passport');
const { jwtStrategy } = require('./middleware/passport');

// JSON BODY PARSER
app.use(bodyParser.json());

// SANITIZE
app.use(xss());
app.use(mongoSanitize());

// VERIFY THE TOKEN
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// ROUTES
// Everytime the  route starts, it will be looking in the file "routes"
app.use('/api', routes);

// ERROR HANDLING
app.use(convertToApiError);
app.use((err, request, response, next) => {
    handleError(err, response);
})

// The server muss be changed: The server and the client are executed to different location and we must set the proxy on the client side
// The following muss be implemented when we post all on production
app.use(express.static('client/build'));
if(process.env.NODE_ENV === 'production'){
    const path = require('path');

    app.get('/*', (request, response)=>{
        response.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// THE ROUTES WILL BE STRUCTURED AS FOLLOW:
// server.js > routes.use() > index > route > controller > services
// + index knows all the routes and redirects to the right one
// + controller: in charge of executing, in charge of requests, responses
// + services: reuse the functions