import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';

export default class LayoutHeaderComponent extends Component {
  @service session;

  logout() {
    this.session.invalidate();
  }
}
