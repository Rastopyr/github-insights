import { inject as service }   from '@ember/service';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import config from 'github-insights/config/environment';

export default ToriiAuthenticator.extend({
  torii: service(),
  ajax: service(),
  store: service(),
  session: service(),

  authenticate() {
    const { ajax, session, store } = this;
    const tokenExchangeUri = config.torii.providers['github-oauth2'].tokenExchangeUri;

    return this._super(...arguments).then((data) => {
      return ajax.request(tokenExchangeUri, {
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          authorizationCode: data.authorizationCode
        })
      }).then(async (response) => {
        const { access_token } = JSON.parse(response);

        return {
          access_token,
          provider: data.provider
        };
      });
    });
  }
});
