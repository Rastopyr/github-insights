import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { localClassNames } from 'ember-css-modules';

@localClassNames('login-page')
export default class PagesLoginComponent extends Component {

  @service session;
  @service store;

  async authorize() {
    const { store, session } = this;

    await this.session.authenticate('authenticator:torii', 'github');

    const currentUser = await store.findRecord('github-user', '#');

    session.set('currentUser', currentUser);
  }
}
