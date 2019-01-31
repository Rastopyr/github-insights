import GitHubUserAdapter from 'ember-data-github/adapters/github-user';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default GitHubUserAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:github',

  urlForQuery(query) {
    const { repo, user: owner, type = 'contributors' } = query;
    return `${this.get('host')}/repos/${owner}/${repo}/stats/${type}`;
  },

  urlForQueryRecord(query) {
    const { repo, user: owner, type = 'contributors' } = query;
    return `${this.get('host')}/repos/${owner}/${repo}/stats/${type}`;
  },
});
