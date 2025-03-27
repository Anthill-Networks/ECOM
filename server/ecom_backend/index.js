// app.js
const express = require('express');
const categoryRouter = require('./Server/Apis/product_categories/route');
const productRouter = require('./Server/Apis/product/route');
const productVarientRouter = require('./Server/Apis/product_varient/route');
const cors = require('cors');

const userRouter = require('./Server/Apis/user/route');
const orderRouter = require('./Server/Apis/order/route');
const orderItemsRouter = require('./Server/Apis/orderItems/route');
const cartRouter = require('./Server/Apis/cart/route');
const companyRouter = require('./Server/Apis/company/route');
const { authorize } = require('./Server/helpers/jwt');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: true, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); 


app.use('/api/ecom/v1', userRouter);
app.use('/api/ecom/v1', cartRouter);
app.use('/api/ecom/v1', authorize , companyRouter);
app.use('/api/ecom/v1', authorize, categoryRouter);
app.use('/api/ecom/v1', authorize, productRouter);
app.use('/api/ecom/v1', authorize, productVarientRouter);
app.use('/api/ecom/v1', authorize, orderRouter);
// app.use('/api/ecom/v1', authorize, orderItemsRouter);

app.use((err, req, res, next) => {
  //error format
  res.status(err.status || 500);
  res.json({
    message: err.message,
    toast : err.toast,
    error: err.error,
  });

  next();

}
);

module.exports = app;



const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});