import Component from '@ember/component';

export default class LayoutComponent extends Component {
  constructor(...args) {
    super(...args);
    this.classNames = ['layout'];
  }
}
