import GithubSerializer from 'ember-data-github/serializers/github';

export default GithubSerializer.extend({
  extractId: (model, { author }) => {
    return `#${author.id}`;
  }
});
