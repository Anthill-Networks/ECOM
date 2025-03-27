const { v4: uuidv4 } = require('uuid');

class CartRepository {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection('carts');
    this.productCollection = this.db.collection('ecom_products');
  }

  static getCurrentISODate() {
    return new Date().toISOString();
  }

  async createCart(data) {
    data.created_at = CartRepository.getCurrentISODate();
    data.updated_at = CartRepository.getCurrentISODate();
    data.cart_items = data.cart_items || [];
    
    const batch = this.db.batch();
    const cartRef = this.collection.doc(data.id || uuidv4());
    batch.set(cartRef, data);
    await batch.commit();
    
    return { id: cartRef.id, ...data };
  }

  async getCartByUserId(userId) {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    if (snapshot.empty) {
      return null;
    }

    const cart = snapshot.docs[0].data();
    cart.id = snapshot.docs[0].id;
    
    const updatedCartItems = await this.populateCartItems(cart.cart_items);
    return { ...cart, cart_items: updatedCartItems };
  }

  async populateCartItems(cartItems) {
    const productIds = cartItems.map(item => item.product_id);
    const products = await this.getProductsByIds(productIds);

    return cartItems.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return { ...item, product };
    });
  }

  async getProductsByIds(ids) {
    const productPromises = ids.map(id => this.getProductById(id));
    return Promise.all(productPromises);
  }

  async getProductById(id) {
    const docRef = this.productCollection.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Product not found: ${id}`);
    }
    return { id: doc.id, ...doc.data() };
  }

  async addItemToCart(userId, item) {
    const updated_at = CartRepository.getCurrentISODate();
    let cart = await this.getCartByUserId(userId);
  
    if (!cart) {
      // If no cart exists, create a new one
      const data = { id: uuidv4(), userId, cart_items: [item] };
      cart = await this.createCart(data);
    } else {
      // Find the existing item in the cart based on product_id and variant_id
      const existingItemIndex = cart.cart_items.findIndex(i => 
        i.product_id === item.product_id && i.variant_id === item.variant_id
      );
  
      if (existingItemIndex > -1) {
        // If item exists, increase quantity
        cart.cart_items[existingItemIndex].quantity += item.quantity; // Assuming item has a quantity
      } else {
        // If item does not exist, add it to the cart
        cart.cart_items.push(item);
      }
  
      // Update the cart in the database
      await this.collection.doc(cart.id).update({ cart_items: cart.cart_items, updated_at });
    }
  
    return cart;
  }
  

  async removeItemFromCart(userId, itemId) {
    const updated_at = CartRepository.getCurrentISODate();
    const cart = await this.getCartByUserId(userId);

    if (!cart) {
      throw new Error('Cart not found for this user');
    }

    const updatedItems = cart.cart_items.filter(item => item.id !== itemId);
    await this.collection.doc(cart.id).update({ cart_items: updatedItems, updated_at });
    return { ...cart, cart_items: updatedItems };
  }

  async getItemCount(userId) {
    const cart = await this.getCartByUserId(userId);
    return cart.cart_items.length;
  }

  async updateCart(userId, updatedItems) {
    const updated_at = CartRepository.getCurrentISODate();
    await this.collection.doc(userId).update({ cart_items: updatedItems, updated_at });
    return { userId, cart_items: updatedItems };
  }
}

module.exports = CartRepository;
