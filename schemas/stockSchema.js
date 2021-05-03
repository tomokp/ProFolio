// import { gql } from 'apollo-server-express';
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Stock {
        id: ID
        Symbol: String
        Stockname: String
        Price: String
    }
    type Query {
        stocks: [Stock]
        stock(id: ID!): Stock
    }
    type Mutation {
        addStock(
            Symbol: String
            Stockname: String
            Price: String
        ): Stock
        modifyStock(
            id: ID!
            Symbol: String
            Stockname: String
            Price: String
        ): Stock
        deleteStock(id: ID!): ID
      }
`;

module.exports = { typeDefs };