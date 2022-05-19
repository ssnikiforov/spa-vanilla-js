import { createElement } from '../render';

const footerCounterTemplate = () => '<p>130 291 movies inside</p>';

export default class FooterCounterView {
  getTemplate () {
    return footerCounterTemplate();
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
