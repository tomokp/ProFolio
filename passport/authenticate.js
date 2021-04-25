'use strict';
import jwt from 'jsonwebtoken';
import passport from './strategy.js';

const login = (req, res) => {
    return new Promise((resolve, reject) => {
        console.log(req.body);
        passport.authenticate(
            'local',
            { session: false },
            async (err, user, info) => {
                try {
                    console.log('user: ', user);
                    if (err || !user) reject(info.message);

                    req.login(user, { session: false }, async (err) => {
                        if (err) reject(err);
                        const token = jwt.sign(user, 'asd123');
                        resolve({ user, token });
                    });
                } catch (e) {
                    reject({ message: e.message });
                }
            }
        )(req, res);
    });
};

const checkAuth = (req, res) => {
    return new Promise((resolve, _) => {
        passport.authenticate('jwt', (err, user) => {
            if (err || !user) {
                resolve(false);
            }
            resolve(user);
        })(req, res);
    });
};

export { login, checkAuth };