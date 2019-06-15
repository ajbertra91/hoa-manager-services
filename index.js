const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const mongoose = require('mongoose');

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

mongoose
.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-iizq4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
  { useNewUrlParser: true }
  )
  .then(() => {
    // This `listen` method launches a web-server.
    const PORT = process.env.PORT || 4000;
    app.listen({ port: PORT}, () => {
      console.log(`Server ready ${process.env === 'production' ? ':: ' : 'at http://localhost:4000'}${server.graphqlPath}`)
    });
  })
  .catch(error => {
    console.error(error, 'FROM index.js');
  });
