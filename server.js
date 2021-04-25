import { ApolloServer } from 'apollo-server-express';
import schemas from './schemas/index.js';
import resolvers from './resolvers/index.js';
import express from 'express';
import dotenv from 'dotenv';
import db from './database/db.js';
import { checkAuth } from './passport/authenticate.js';
import helmet from 'helmet';
import cors from 'cors';
import localhost from './security/localhost.js';
import production from './security/production.js';

dotenv.config();

(async () => {
   try {
      const conn = await db();
      if (conn) {
         console.log('Connected successfully.');
      }

      const server = new ApolloServer({
         typeDefs: schemas,
         resolvers,
         context: async ({ req, res }) => {
            if (req) {
               const user = await checkAuth(req, res);
               return {
                  req,
                  res,
                  user,
               };
            }
         },
      });

      const app = express();

      app.use(
         helmet({
            contentSecurityPolicy: false,
            ieNoOpen: false,
         })
      );

      server.applyMiddleware({ app });

      process.env.NODE_ENV = process.env.NODE_ENV || 'development';
      if (process.env.NODE_ENV === 'production') {
         production(app, 3000);
      } else {
         localhost(app, 8000, 3000);
      }

      app.get('/', (req, res) => {
         res.send('Hello Secure World!');
      });

      // app.listen({ port: 3000 }, () =>
      //    console.log(
      //       `🚀 Server ready at http://localhost:3000${server.graphqlPath}`
      //    )
      // );
   } catch (e) {
      console.log('server error: ' + e.message);
   }
})();