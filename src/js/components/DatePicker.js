/* global flatpickr*/ // eslint-disable-line no-unused-vars

import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      // dateFormat: 'Y-m-d',
      locale: {
        firstDayOfWeek: 1,
      },
      // Nie działa - zwraca zły format daty
      // onChange: function (dateStr) {
      //   thisWidget.value = dateStr;
      // }
      onChange: function () {
        thisWidget.value = thisWidget.dom.input.value;
      }
    });
  }

  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {
  }
}

export default DatePicker;
