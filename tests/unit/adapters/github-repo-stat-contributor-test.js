import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | github repo stat contributor', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:github-repo-stat-contributor');
    assert.ok(adapter);
  });
});
