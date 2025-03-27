import { ArrowRight, Truck, Search, Award, Clock } from "lucide-react";
import honeyimg from "./../../images/home/honey.png";


export default function Whatweoffer() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold josefin-sans-heading text-[#2c6343] text-center mb-8 text-gray-700">What we Offer!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Truck className="h-12 w-12 text-orange-500" />, title: "Shipping" },
            { icon: <Search className="h-12 w-12 text-blue-500" />, title: "Easy Search" },
            { icon: <Award className="h-12 w-12 text-yellow-500" />, title: "Quality Products" },
            { icon: <Clock className="h-12 w-12 text-green-500" />, title: "On-time Delivery" },
          ].map((item, index) => (
            <div key={index} className="text-center border-md bg-white  p-4 rounded-lg shadow-xl">
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-lg josefin-sans-heading font-semibold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-sm josefin-sans-heading text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5de] rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold josefin-sans-heading text-center mb-8 text-gray-700">Benefits of Our Products</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={honeyimg}
            alt="Honey products"
            width={400}
            height={300}
            className="rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4 josefin-sans-heading text-gray-800">Honey</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-2 mt-1">•</div>
                <p className="josefin-sans-heading text-gray-600">
                  <span className="font-semibold">Boosts Immunity:</span> Our organic honey is rich in antioxidants
                  and natural enzymes that help strengthen your immune system.
                </p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1">•</div>
                <p className="text-gray-600">
                  <span className="font-semibold">Natural Sweetener:</span> A healthier alternative to refined sugars,
                  honey adds a touch of natural sweetness to your beverages and desserts.
                </p>
              </li>
            </ul>
            <button className="mt-6 flex items-center text-green-600 hover:text-green-700 transition-colors">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
