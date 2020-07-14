# Passport-SAM

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [SAM](http://samdesk.io/) using the OAuth 2.0 API.

This module lets you authenticate using SAM in your Node.js applications.
By plugging into Passport, SAM authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-sam

## Usage

#### Configure Strategy

The SAM authentication strategy authenticates users using a SAM
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new SAMStrategy({
        clientID: SAM_CLIENT_ID,
        clientSecret: SAM_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/sam/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ samId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'sam'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/sam',
      passport.authenticate('sam'));

    app.get('/auth/sam/callback', 
      passport.authenticate('sam', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/samdesk/passport-sam/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/samdesk/passport-sam.png)](http://travis-ci.org/samdesk/passport-sam)

## Credits

  - [Jordan Ranson](http://github.com/jordanranson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Social Asset Management Inc. <[http://samdesk.io/](http://samdesk.io/)>
