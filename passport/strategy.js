'use strict';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (user === null)
                return done(null, false, { message: 'Credentials incorrect' });

            const validate = await bcrypt.compare(password, user.password);
            if (!validate)
                return done(null, false, { message: 'Credentials incorrect' });

            const strippedUser = user.toObject();
            delete strippedUser.password;

            return done(null, strippedUser, { message: 'Successfully logged in' });
        } catch (err) {
            return done(err);
        }
    })
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'asd123',
        },
        async (jwtPayload, done) => {
            console.log('payload', jwtPayload);
            try {
                const user = await User.findById(jwtPayload._id, '-password -__v');

                return user !== null ? done(null, user) : done(null, false);
            } catch (e) {
                return done(null, false);
            }
        }
    )
);

export default passport;