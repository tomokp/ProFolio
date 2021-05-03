require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const { typeDefs } = require('./schemas/stockSchema')
const { resolvers } = require('./resolvers/stockResolver')

// const resolvers = require('./resolvers/index.js');

const rtsIndex = require('./routes/index.router');

// Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// };

const server = new ApolloServer({ typeDefs, resolvers });

var app = express();
server.applyMiddleware({ app });

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));