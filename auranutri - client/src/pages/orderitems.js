import OrderItems from "../components/order/orderitems";
import Header from "../components/navbar/header";
import Nav from "../components/navbar/nav";
import ProductDetailsHeader from "../components/product/ProductDetailsHeader";
import Footer from "../components/footer/footer";

export default function OrderItemsScreen() { 
    return (
        <>
      <Header />
      <Nav />
      <ProductDetailsHeader 
        title="Order Items"
        breadcrumbs={[
          { text: 'Home' , link: '/' },
          { text: 'Order Items' , link: '/orderitems' }
        ]}
      />
      <div className="container ">
      <OrderItems />
      </div>
      <Footer />
        </>
    );
}