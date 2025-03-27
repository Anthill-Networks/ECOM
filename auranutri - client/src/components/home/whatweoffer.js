import { ArrowRight } from "lucide-react";
import honeyimg from "./../../images/home/honey.png";
import freeShippingImg from "./../../images/whatweoffer/truck.png";
import rewardsImg from "./../../images/whatweoffer/reward.png";
import naturalImg from "./../../images/whatweoffer/natural.png";
import supportImg from "./../../images/whatweoffer/support.png";
import { useState } from "react";
import prod1 from "./../../images/products/Prod1.png";

export default function Whatweoffer() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = [
    {
      title: "Natural Glow",
      image: prod1,
      description: [
        "Hydrates and Nourishes: Deeply moisturizes the skin, making it soft and supple.",
        "Enhances Natural Radiance: Boosts your skin's natural glow with pure Ayurvedic ingredients.",
        "Reduces Wrinkles and Fine Lines: Contains antioxidants that slow down signs of aging.",
        "Repairs Damaged Skin: Helps in rejuvenating dull and damaged skin caused by pollution and stress.",
        "100% Natural Ingredients: Free from harmful chemicals, making it safe for all skin types."
      ]
    },
    // {
    //   title: "ABC",
    //   image: honeyimg,
    //   description: ["A healthier alternative to refined sugars, honey adds a touch of natural sweetness to your beverages and desserts."]
    // },
    // {
    //   title: "CDE",
    //   image: honeyimg,
    //   description: ["Our honey is sourced from the best flowers, ensuring quality and taste in every jar."]
    // },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold josefin-sans-heading text-[#2c6343] text-center mb-8 text-gray-700">What we Offer!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <img src={freeShippingImg} alt="Free Shipping" className="h-12 w-12 object-contain" />, title: "Free Shipping", content: "Experience hassle-free shopping with complimentary shipping on all your Aura Nutri orders."},
            { icon: <img src={rewardsImg} alt="Rewards" className="h-12 w-12 object-contain" />, title: "Rewards & Benefits", content: " Enjoy discounts, and unlock special benefits tailored to your wellness goals."},
            { icon: <img src={naturalImg} alt="100% Natural" className="h-12 w-12 object-contain" />, title: "100% Natural", content:"Each Aura Nutri product is crafted with care, using 100% natural Ayurvedic ingredients for your holistic health." },
            { icon: <img src={supportImg} alt="24/7 Support" className="h-12 w-12 object-contain" />, title: "24/7 Support" , content: "Our dedicated customer support team is here to assist you with any questions or concerns you may have."},
          ].map((item, index) => (
            <div key={index} className="text-center border-md bg-white  p-4 rounded-lg shadow-xl">
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-lg josefin-sans-heading font-semibold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-sm josefin-sans-heading text-gray-600">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5de] rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold josefin-sans-heading text-center mb-8 text-gray-700">Benefits of Our Products</h2>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <button className="absolute left-0 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition-colors" onClick={handlePrev}>←</button>
          <img
            src={items[currentIndex].image}
            alt="Honey products"
            width={300}
            height={300}
            className="rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4 josefin-sans-heading text-gray-800">{items[currentIndex].title}</h3>
            <ul className="space-y-4">
              {Array.isArray(items[currentIndex].description) ? (
                items[currentIndex].description.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p className="josefin-sans-heading text-gray-600">{point}</p>
                  </li>
                ))
              ) : (
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <p className="josefin-sans-heading text-gray-600">
                    <span className="font-semibold">Description:</span> {items[currentIndex].description}
                  </p>
                </li>
              )}
            </ul>
            <button className="mt-6 flex items-center text-[#0d2946] hover:text-green-700 transition-colors">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
          <button className="absolute right-0 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition-colors" onClick={handleNext}>→</button>
        </div>
      </section>
    </div>
  );
}
