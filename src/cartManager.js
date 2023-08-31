const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.loadCartsFromFile();
  }

  async loadCartsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCartsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error guardando carritos en el archivo:', error);
    }
  }

  generateID() {
    return Date.now().toString();
  }

  createCart() {
    const newCart = {
      id: this.generateID(),
      products: []
    };
    this.carts.push(newCart);
    this.saveCartsToFile();
    return newCart;
  }

  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  addProductToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);
    if (cart) {
      const existingProduct = cart.products.find(product => product.id === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }
      this.saveCartsToFile();
    }
  }
}

module.exports = CartManager;