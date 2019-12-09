import { settings, select } from '../settings.js';


class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    thisWidget.value = settings.amountWidget.defaultValue;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();

    // console.log('AmountWidget:', thisWidget);
    // console.log('constructor arguments:', element);
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  validationMax() {
    const thisWidget = this;

    let max = thisWidget.input.getAttribute('data-max');

    if (!max) {
      max = settings.amountWidget.defaultMax;
    }
    return max;
  }

  validationMin() {
    const thisWidget = this;

    let min = thisWidget.input.getAttribute('data-min');

    if (!min) {
      min = settings.amountWidget.defaultMin;
    }
    return min;
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    /* Validation */
    if (newValue !== thisWidget.value && newValue >= thisWidget.validationMin() && newValue <= thisWidget.validationMax()) {
      // console.log('Validation works!');
      thisWidget.value = newValue;
      thisWidget.announce();
    }
    thisWidget.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function () {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function () {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });

    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;
