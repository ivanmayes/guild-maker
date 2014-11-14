# NLMG API

This will be our API server using express 4, mongoose, and passport.

Would like to write tests that:

√ - save a user in the db
√ - save an access token for that user 
√- use passport-http-bearer to get a user from an access token
√- protect an endpoint to attach a user to the request
- oauth2orize to exchange user/pass for token


## Examples

From [http://passportjs.org/guide/oauth2-api/](http://passportjs.org/guide/oauth2-api/)

Setting up passport-http-bearer

    passport.use(new BearerStrategy(
      function(token, done) {
        User.findOne({ token: token }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user, { scope: 'read' });
        });
      }
    ));

The verify callback for bearer tokens accepts the token as an argument. When invoking done, optional info can be passed, which will be set by Passport at req.authInfo. This is typically used to convey the scope of the token, and can be used when making access control checks.

Protect Endpoints

    app.get('/api/me', 
      passport.authenticate('bearer', { session: false }),
      function(req, res) {
        res.json(req.user);
      }
    );
