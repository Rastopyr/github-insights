import DS from 'ember-data';
const { Model, attr } = DS;

export default Model.extend({
  public: attr('boolean'),
  created_at: attr('date'),
  type: attr('string'),
  org: attr(),
  payload: attr(),
  repo: attr(),
  actor: attr()
});
