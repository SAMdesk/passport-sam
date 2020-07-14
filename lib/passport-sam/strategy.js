'use strict';

/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The SAM authentication strategy authenticates requests by delegating
 * to SAM using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `clientID`      your SAM application's client id
 *   - `clientSecret`  your SAM application's client secret
 *   - `callbackURL`   URL to which SAM will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new SAMStrategy({
 *         clientID: 'your client id',
 *         clientSecret: 'your client secret'
 *         callbackURL: 'https://localhost/auth/sam/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://app.samdesk.io/oauth/authorize';
    options.tokenURL = options.tokenURL || 'https://app.samdesk.io/oauth/token';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'sam';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from SAM.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `sam`
 *   - `id`               the user's SAM account ID
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get('https://api.samdesk.io/profile.json', accessToken, function (err, body, res) {
        if (err) {
            return done(new InternalOAuthError('failed to fetch user profile', err));
        }

        try {
            var json = JSON.parse(body);

            var profile = {provider: 'sam'};
            profile.id = json.id;
            profile.displayName = json.full_name;

            profile._raw = body;
            profile._json = json;

            done(null, profile);
        } catch (e) {
            done(e);
        }
    });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
