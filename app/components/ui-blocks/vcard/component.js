import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { alias } from '@ember-decorators/object/computed';

export default class VcardComponent extends Component {
  @service session;
  @alias('session.currentUser') user;
}
