//@ts-nocheck
import passport from 'passport';
import UserModel from '../../_user/schemas/user.schema';
import { Strategy as jwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Strategy as localStrategy } from 'passport-local';
import { jwtSecret } from './../../utils/configs';
import bcrypt from 'bcryptjs';


//! ****************************** jwT STRATEGY
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: jwtSecret
};

const authenticateWithJwt = new jwtStrategy(jwtOptions, function (payload, done) {

    UserModel.findOne({_id: payload.sub}, function (err, user) {
        if (err) done(err, false);

        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }


    })

})
//! ****************************** local STRATEGY
const localOptions = {usernameField: 'email'}

const loginWithJwt = new localStrategy(localOptions, function (email, pass, done) {
    console.log(email, pass)
    
    UserModel.findOne({ email }, function (err, user) {
        if (err) done(err);
        if (!user) done(null, false);


        if (user) {
            user.correctPassword(pass, (err, isMatch) => {
                if (err) { return done(err); }
                if (!isMatch) { return done(null, false); }
    
                done(null, user);
            })
        } else {
            done(null, user);
        }
    })
})



passport.use(authenticateWithJwt)
passport.use(loginWithJwt)