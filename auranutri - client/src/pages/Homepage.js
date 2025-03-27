import React, { useEffect, useState } from "react";
import { Mail, Phone, User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../components/home/hero";
import Header from "../components/navbar/header";
import Nav from "../components/navbar/nav";
import Whatweoffer from "../components/home/whatweoffer";
import TestimonialSection from "../components/home/testimonials";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Welcome from "../components/home/welcome";
import NewsletterSubscription from "../components/home/newsletter";
import BlogCarousel from "../components/home/blog";
import Footer from "../components/footer/footer";
import { useSettings } from "../context/SettingsContext";

export default function HomePage() {
  const { settings, loading } = useSettings();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Nav />
      <Hero banners={settings?.homepageBanners} />
      <FeaturedProducts />
      <Welcome />
    
      <Whatweoffer />
      <TestimonialSection />
      {/* <NewsletterSubscription /> */}
      <BlogCarousel />
      <Footer />
    </div>
  );
}
