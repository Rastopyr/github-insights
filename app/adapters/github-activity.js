import GitHubAdapter from 'ember-data-github/adapters/github';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default GitHubAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:github',

  urlForQuery(query) {
    return `${this.get('host')}/users/${query.user}/events`;
  },
});
