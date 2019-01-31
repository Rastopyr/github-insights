import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
// import { task } from 'ember-concurrency';

export default Route.extend(ApplicationRouteMixin, {
  store: service(),
  session: service(),

  async model() {
    const { store, session } = this;

    if (!session.isAuthenticated) {
      return;
    }

    const currentUser = await store.findRecord('github-user', '#');

    session.currentUser = currentUser;
  }
});
