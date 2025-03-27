class OrderItemsRepository {
    constructor(db) {
      this.db = db;
      this.collection = this.db.collection('orders_items');
    }

    static getCurrentISODate() {
      return new Date().toISOString();
    }
  
    async createOrder(data) {
      data.createdAt = OrderItemsRepository.getCurrentISODate();
      data.updatedAt = OrderItemsRepository.getCurrentISODate();
      const { id } = data;
  
      // Use a batch write to improve performance
      const batch = this.db.batch();
      const companyRef = this.collection.doc(id);
      batch.set(companyRef, data);
      await batch.commit();
      return { id, ...data };
    }
  
    async getOrderById(id) {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('Order not found');
      }
    }
  
    async getAllOrders(query) {
      //no paginaton
      let ref = this.collection;
      if (query.order_id) {
        ref = ref.where('order_id', '==', query.order_id);
      }
      if (query.product_id) {
        ref = ref.where('product_id', '==', query.product_id);
      }

      const snapshot = await ref.get();
      const orders = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;

    }
  
    async updateOrder(id, data) {
      data.updatedAt = new Date();
      const docRef = this.collection.doc(id);
      await docRef.update(data);
      const updatedOrder = await docRef.get();
      return { id: updatedOrder.id, ...updatedOrder.data() };
    }
  
    async deleteOrder(id) {
      const docRef = this.collection.doc(id);
      await docRef.delete();
      return { id, message: 'Order deleted successfully' };
    }
  }
  
  module.exports = OrderItemsRepository;
  