import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  session: service(),

  async model() {
    const { session } = this;
    const { currentUser } = session;

    // await this.store.query('github-repository', { user: currentUser.login });
    // await this.store.query('github-commit', { repo: 'elwayman02/ember-data-github' });
  }
});
