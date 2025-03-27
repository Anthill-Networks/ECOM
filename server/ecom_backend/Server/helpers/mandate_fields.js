const validateMandatoryFields = (fields, body) => {
    const missingFields = fields.filter(field => !body[field]);
  
    if (missingFields.length > 0) {
      throw new Error(`Missing mandatory fields: ${missingFields.join(', ')}`);
    }
  };
  

const mandatoryFields = {
    cart: ['userId', 'items'], 
    product: ['name', 'price', 'categoryId'], 
    order: ['userId', 'cartId', 'totalAmount'], 
  };
  

export default {mandatoryFields, validateMandatoryFields};

