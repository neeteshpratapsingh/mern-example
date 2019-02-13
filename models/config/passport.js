const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

module.exports = (passport) => {
	passport.use(
		new jwtStrategy(
			{ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'secret' },
			(jwt_payload, done) => {
				console.log(jwt_payload);
			}
		)
	);
};
