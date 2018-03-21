var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var sqlQuery = require('../database/sqlWrapper');
var jwt = require('jwt-simple');
var _ = require('underscore');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = 'eg[isfd-8axcewfgi43209=1dmnbvcrt67890-[;lkjhyt5432qi24';
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
      console.log("Came here", jwt_payload)
      done(null, jwt_payload);
    }))
};
