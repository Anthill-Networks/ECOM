import { Edit } from "lucide-react";
import EditDetailsForm from "../components/profile/EditDetailsForm";
import Header from "../components/navbar/header";
import Nav from "../components/navbar/nav";
import ProductDetailsHeader from "../components/product/ProductDetailsHeader";
import Footer from "../components/footer/footer";

export default function Profile() { 
    return (
        <>
      <Header />
      <Nav />
      <ProductDetailsHeader 
        title="Profile"
        breadcrumbs={[
          { text: 'Home' , link: '/' },
          { text: 'Profile' , link: '/profile' }
        ]}
      />
      <EditDetailsForm />
      <Footer />
        </>
    );
}