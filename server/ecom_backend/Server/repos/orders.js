class OrderRepository {
  constructor(db) {
    this.db = db;
    this.ordersCollection = this.db.collection('orders');
    this.orderItemsCollection = this.db.collection('order_items');
  }

  static getCurrentISODate() {
    return new Date().toISOString();
  }

  async createOrder(data) {
    data.createdAt = OrderRepository.getCurrentISODate();
    data.updatedAt = OrderRepository.getCurrentISODate();
    const { id } = data;

    // Use a batch write to improve performance
    const batch = this.db.batch();
    const orderRef = this.ordersCollection.doc(id);
    batch.set(orderRef, data);
    await batch.commit();
    return { id, ...data };
  }
  async createOrderItem(data) {
    data.createdAt = OrderRepository.getCurrentISODate();
    data.updatedAt = OrderRepository.getCurrentISODate();
    const { id } = data;

    // Use a batch write to improve performance
    const batch = this.db.batch();
    const orderRef = this.orderItemsCollection.doc(id);
    batch.set(orderRef, data);
    await batch.commit();
    return { id, ...data };
  }

  async getOrderById(id) {
    const docRef = this.ordersCollection.doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      const order = { id: doc.id, ...doc.data() };
      // Fetch order items for the current order
      const orderItemsSnapshot = await this.orderItemsCollection.where('order_id', '==', order.id).get();
      const orderItems = [];
      orderItemsSnapshot.forEach(itemDoc => {
        orderItems.push({ id: itemDoc.id, ...itemDoc.data() });
      });
      order.items = orderItems;
      return order;
    } else {
      throw new Error('Order not found');
    }
  }

  async getAllOrders(query) {
    const limit = query.limit ? parseInt(query.limit) : 10;
    const page = query.page ? parseInt(query.page) : 1;

    let ref = this.ordersCollection;

    // Apply filters based on query parameters
    if (query.userId) {
      ref = ref.where('userId', '==', query.userId);
    }
    if (query.status) {
      ref = ref.where('status', '==', query.status);
    }
    if (query.startDate && query.endDate) {
      ref = ref.where('createdAt', '>=', new Date(query.startDate))
               .where('createdAt', '<=', new Date(query.endDate));
    }
    if (query.company_id) {
      ref = ref.where('company_id', '==', query.company_id);
    }

    // Fetch the first page
    if (page === 1) {
      ref = ref.limit(limit);
    } else {
      // Fetch the last document of the previous page
      const previousPageQuery = this.ordersCollection;
      if (query.userId) {
        previousPageQuery = previousPageQuery.where('userId', '==', query.userId);
      }
      if (query.status) {
        previousPageQuery = previousPageQuery.where('status', '==', query.status);
      }
      if (query.startDate && query.endDate) {
        previousPageQuery = previousPageQuery.where('createdAt', '>=', new Date(query.startDate))
                                             .where('createdAt', '<=', new Date(query.endDate));
      }
      if (query.company_id) {
        previousPageQuery = previousPageQuery.where('company_id', '==', query.company_id);
      }
      const previousPageSnapshot = await previousPageQuery.limit((page - 1) * limit).get();
      const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
      ref = ref.startAfter(lastVisible).limit(limit);
    }

    const snapshot = await ref.get();
    const orders = [];
    for (const doc of snapshot.docs) {
      const order = { id: doc.id, ...doc.data() };
      // Fetch order items for the current order
      const orderItemsSnapshot = await this.orderItemsCollection.where('order_id', '==', order.id).get();
      const orderItems = [];
      orderItemsSnapshot.forEach(itemDoc => {
        orderItems.push({ id: itemDoc.id, ...itemDoc.data() });
      });
      order.items = orderItems;
      orders.push(order);
    }

    return orders;
  }

  async updateOrder(id, data) {
    data.updatedAt = new Date().toISOString();
    const docRef = this.ordersCollection.doc(id);
    await docRef.update(data);
    const updatedOrder = await docRef.get();
    if (updatedOrder.exists) {
      return { id: updatedOrder.id, ...updatedOrder.data() };
    } else {
      throw new Error('Order not found');
    }
  }

  async deleteOrder(id) {
    const docRef = this.ordersCollection.doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      await docRef.delete();
      return { id, message: 'Order deleted successfully' };
    } else {
      throw new Error('Order not found');
    }
  }
}

module.exports = OrderRepository;