import OrderItems from "../components/order/orderitems";
import Header from "../components/navbar/header";
import Nav from "../components/navbar/nav";
import ProductDetailsHeader from "../components/product/ProductDetailsHeader";
import Footer from "../components/footer/footer";
import Orders from "../components/order/orders";

export default function OrdersScreen() { 
    return (
        <>
          <Header />
          <Nav />
          <ProductDetailsHeader 
            title="Orders"
            breadcrumbs={[
              { text: 'Home' , link: '/' },
              { text: 'Orders' , link: '/orders' }
            ]}
          />
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Orders />
          </div>
          <Footer />
        </>
    );
}