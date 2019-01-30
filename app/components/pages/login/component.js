import { inject } from '@ember/service';
import Component from '@ember/component';

export default class PagesLoginComponent extends Component {

  // session = inject();

  authorize() {
    console.log('authorize');
    // this.session.authorize('authorizer:github');
  }
}
