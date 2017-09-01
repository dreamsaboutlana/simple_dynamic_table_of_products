'use strict';

class Shop {

  createTable(param) {
    let product;

    if (param) {
      product = param;
    } else {
      product = this.products;
    }

    let table = document.getElementById('product_table');
    let str = product.map(elem => {
      return `<div class="product_table__card">
                <div class="product_img"> 
                  <img src="${elem.image_id}" alt="photo">
                </div>
                <div class="product_title">${elem.title}</div>
                <div class="product_price">
                 <span>${elem.price}<span class="product_price__cur">$</span></span>
                </div>
              </div>`;
    }).join('');

    return table.innerHTML = str;
  }

  createModalBlock(obj) {

    let body = document.body;
    let div = document.querySelector('.product_table__card_full_info');
    let overlay = document.createElement('div');

    body.insertAdjacentElement('afterbegin', overlay);
    overlay.classList.add('overlay');
    obj = obj[0];
    div.classList.add('active');
    div.innerHTML = `<div class="product_img">
                      <img src="${obj.image_id}" alt="photo"> 
                     </div>
                     <div class="product_info">
                       <div class="product_title">${obj.title}</div>
                       <div class="product_price">
                         <span>${obj.price}<span class="product_price__cur">$</span></span>
                       </div>
                     <p>${obj.full_information}</p> </div>`;
    return div;
  }
  closeModal() {

    let div = document.querySelector('.product_table__card_full_info');
    let overlay = document.querySelector('.overlay');

    overlay.classList.remove('overlay');
    div.classList.remove('active');

    return div.innerHTML = '';
  }

  findProductByTypeParam(param) {

    let findProduct = [];

    this.products.forEach(elem => {
      if (elem.title.includes([param]) === true || elem.title.toLowerCase().includes([param]) === true) {
        findProduct.push(elem);
      }
    });
    return findProduct;
  }

  events() {
    this.elem = document.querySelectorAll('.product_table__card');
    this.table = document.getElementById('product_table');
    this.search = document.getElementById('search');
    this.modal = document.querySelector('.product_table__card_full_info');

    this.search.addEventListener('keyup', e => {
      this.newProduct = this.findProductByTypeParam(this.search.value);
      this.table.innerHTML = this.createTable(this.newProduct);
    });

    this.table.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.className == 'product_table__card') {
        this.card = e.target;
      } else {
        this.card = e.target.parentElement;
        if (this.card.className !== 'product_table__card') {
          this.card = e.target.parentElement.parentElement;
        }
      }
      this.title = this.card.querySelector('.product_title').textContent;
      this.product = this.findProductByTypeParam(this.title);
      this.createModalBlock(this.product);
    });

    this.modal.addEventListener('click', e => {
      this.closeModal();
    });
  }

  request() {
    fetch('product.json')
      .then(data => data.json())
      .then(data => {
        this.products = data[0].products;
        this.render();
      })
  }

  render() {
    this.productTable = document.getElementById('product_table');

    if (this.productTable) {
      this.productTable.innerHTML = this.createTable();
      this.events();
    } else {
      this.productTable = document.createElement('div');
      document.body.prepend(this.productTable);
      this.productTable.id = 'product_table';
      this.productTable.innerHTML = this.createTable();
      this.events();
    }
  }
}

let shop = new Shop();

shop.request();