import React from "react";
import testimonial from "./../../images/home/testimonial.png";
import { useSettings } from "../../context/SettingsContext";

const Testimonial = ({ quote, name, designation, imageSrc }) => (
  <div className="bg-sky-100 josefin-sans-heading rounded-xl shadow-xl">
    <div className="p-6">
      <blockquote className="text-gray-700 mb-4">"{quote}"</blockquote>
      <div className="flex items-center">
        <img
          src={imageSrc || testimonial}
          alt={name}
          width={60}
          className="rounded-xl mr-4"
        />
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{designation}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function TestimonialSection() {
  const { settings, loading } = useSettings();

  const defaultTestimonials = [
    {
      quote: "Lorem ipsum dolor sit amet...",
      name: "John Doe",
      designation: "CEO, Tech Corp",
      imageSrc: testimonial
    },
    // ... your existing default testimonials
  ];

  const testimonials = settings?.testimonials?.length > 0 
    ? settings.testimonials 
    : defaultTestimonials;

  if (loading) return null;

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 josefin-sans-heading text-[#2c6343]">
        What Our Customers are Saying?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
