const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProductsFromFile();
  }

  async loadProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error guardando productos en el archivo:', error);
    }
  }

  generateID() {
    return this.products.length + 1;
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some(p => p.code === product.code)) {
      console.error("El código del producto ya existe.");
      return;
    }

    product.id = this.generateID();
    this.products.push(product);
    this.saveProductsToFile();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado.");
    }
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProductsToFile();
    } else {
      console.error("Producto no encontrado.");
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProductsToFile();
    } else {
      console.error("Producto no encontrado.");
    }
  }
}

module.exports = ProductManager;