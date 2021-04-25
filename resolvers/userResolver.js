import { AuthenticationError } from 'apollo-server-errors';
import User from '../models/user.js';
import { login } from '../passport/authenticate.js';
import bcrypt from 'bcrypt';

export default {
    Query: {
        login: async (parent, args, { req, res }) => {
            try {
                req.body = args;

                const authResponse = await login(req, res);
                return {
                    id: authResponse.user._id,
                    username: authResponse.user.username,
                    token: authResponse.token,
                };
            } catch (e) {
                throw new AuthenticationError('Credentials invalid');
            }
        },
        user: async (parent, args, { user }) => {
            if (!user) {
                throw new AuthenticationError('Not authenticated');
            }
            return await User.findById({ _id: args.id }).exec();
        },
    },
    Mutation: {
        registerUser: async (parent, args) => {
            try {
                const hash = await bcrypt.hash(args.password, 12);
                const userWithHash = {
                    ...args,
                    password: hash,
                };
                const newUser = new User(userWithHash);
                const result = await newUser.save();
                return result;
            } catch (e) {
                console.log(`Error while registering user ${e.message}`);
            }
        },
    },
};