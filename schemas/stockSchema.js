import { gql } from 'apollo-server-express';

export default gql`
    type Stock {
        id: ID
        Symbol: String
        Stockname: String
        Price: String
    }
    extend type Query {
        stocks: [Stock]
    }
    extend type Mutation {
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