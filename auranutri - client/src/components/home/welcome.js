import img from './../../images/image.png'
export default function Welcome() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-left">
          <h1 className="text-3xl lg:text-4xl lg:mt-20 josefin-sans-heading font-bold text-[#2c6343] mb-4">Why Choose Us</h1>
          <p className="text-gray-600 text-xl lg:text-2xl josefin-sans-body mb-4">
            At Aura nutri, our mission is to foster healthier and happier lives through the power of organic
            plants. By cultivating strong, mutually beneficial relationships with our farmers, sourcing
            partners, and team members, we are dedicated to creating a sustainable future for everyone. We
            invite you to explore more about yourself and the wonderful world we share as you embark on
            this journey with us.
          </p>
          <p className="text-gray-700 josefin-sans-body lg:text-2xl font-medium">
            Enjoy the journey with Aura nutri
          </p>
        </div>
        <div className="order-first lg:order-last">
          <img 
            src={img}
            alt="Aura nutri Store Welcome"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}