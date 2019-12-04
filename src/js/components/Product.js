import { select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    // console.log('new Product:', thisProduct);
  }

  renderInMenu() {
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu conatiner */
    const menuContainer = document.querySelector(select.containerOf.menu);

    /*add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    // const button = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function () {

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');

      /* find all active products */
      const products = document.querySelectorAll(select.all.menuProductsActive);

      /* START LOOP: for each active product */
      for (let product of products) {

        /* START: if the active product isn't the element of thisProduct */
        if (product !== thisProduct.element) {

          /* remove class active for the active product */
          product.classList.remove('active');

          /* END: if the active product isn't the element of thisProduct */
        }

        /* END LOOP: for each active product */
      }

      /* END: click event listener to trigger */
    });
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;

    /* Read all data form the form */
    const formData = utils.serializeFormToObject(thisProduct.form);

    thisProduct.params = {};

    /* Default price in variable*/
    let price = thisProduct.data.price;

    /* START LOOP for every param */
    for (let paramId in thisProduct.data.params) {

      /* Element with key paramId from thisProduct.data.params */
      const param = thisProduct.data.params[paramId];

      /* START LOOP for every option */
      for (let optionId in param.options) {

        /* Element with key optionId from param.options */
        const option = param.options[optionId];

        /* Checking if formData[paramId] exist and if it contains key equal to optionId value */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        /* if option is selected and option is not default */
        if (optionSelected && !option.default) {

          /* add price to the variable */
          price = price + option.price;
        }

        /* if option is not selected and option is default */
        else if (!optionSelected && option.default) {

          /* deduct price from the variable */
          price = price - option.price;
        }

        /* find images */
        const images = thisProduct.imageWrapper.querySelectorAll(`.${paramId}-${optionId}`);

        /* if option selected add class active to image */
        if (optionSelected) {
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;

          for (let image of images) {
            image.classList.add(classNames.menuProduct.imageVisible);
          }
        }

        /* else remove class active from image */
        else {
          for (let image of images) {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

        /* END LOOP for every option */
      }

      /* END LOOP for every param*/
    }

    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;

    // console.log(thisProduct.params);
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    // app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      }
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
