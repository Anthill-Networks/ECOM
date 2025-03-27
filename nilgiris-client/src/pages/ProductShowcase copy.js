// import React, { useState } from 'react'
// import { Minus, Plus, Heart, Star, ThumbsUp, ThumbsDown, Play } from 'lucide-react'
// import hero1 from "./../images/home/hero1.png";
// import Footer from '../components/footer/footer';
// import Header from '../components/navbar/header';
// import Nav from '../components/navbar/nav';
// import ProductDetailsHeader from '../components/product/ProductDetailsHeader';
// import FeaturedProducts from '../components/home/FeaturedProducts';
// export default function ProductShowcase() {
//   const [quantity, setQuantity] = useState(1)
//   const [variant, setVariant] = useState("raw")
//   const [reviews, setReviews] = useState([
//     { id: 1, author: "Alice", rating: 5, content: "Excellent honey, love the taste!", helpful: 12, notHelpful: 1 },
//     { id: 2, author: "Bob", rating: 4, content: "Good quality, but a bit pricey.", helpful: 8, notHelpful: 2 },
//     { id: 3, author: "Charlie", rating: 5, content: "Best honey I've ever tasted!", helpful: 15, notHelpful: 0 },
//   ])
//   const [newReview, setNewReview] = useState({ author: "", rating: 5, content: "" })
//   const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
//   const [selectedImage, setSelectedImage] = useState(0)
//   const [activeTab, setActiveTab] = useState("description")

//   const variants = [
//     { value: "raw", label: "Raw", color: "bg-amber-300" },
//     { value: "manuka", label: "Manuka", color: "bg-amber-600" },
//     { value: "acacia", label: "Acacia", color: "bg-amber-100" },
//   ]

//   const productImages = [
//    hero1, hero1, hero1
//   ]

//   const handleReviewSubmit = (e) => {
//     e.preventDefault()
//     const reviewToAdd = {
//       id: reviews.length + 1,
//       ...newReview,
//       helpful: 0,
//       notHelpful: 0,
//     }
//     setReviews([reviewToAdd, ...reviews])
//     setNewReview({ author: "", rating: 5, content: "" })
//     setIsReviewDialogOpen(false)
//   }

//   const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

//   return (
//     <>
//       <Header />
//       <Nav />
//       <ProductDetailsHeader />
    
//     <div id="head" className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-semibold mb-6">Product Details</h1>
//       <div className="grid md:grid-cols-2 mx-10  gap-8">
//         <div className="space-y-4">
//           <div className="relative  ">
//             <img
//               src={productImages[selectedImage]}
//               alt={`Honey product image ${selectedImage + 1}`}
//               className="w-full object-contain rounded-lg"
//             />
//           </div>
//           <div className="flex space-x-2 overflow-x-auto">
//             {productImages.map((image, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedImage(index)}
//                 className={`relative w-20 h-20 rounded-md overflow-hidden ${
//                   selectedImage === index ? 'ring-2 ring-primary' : ''
//                 }`}
//               >
//                 <img
//                   src={image}
//                   alt={`Honey product thumbnail ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div className="flex justify-between items-start">
//             <h2 className="text-3xl font-bold">Honey</h2>
//             <button className="p-2 border rounded-full">
//               <Heart className="h-4 w-4" />
//             </button>
//           </div>
//           <p className="text-2xl font-semibold">$7.00</p>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="variant-options" className="block text-sm font-medium text-gray-700 mb-2">
//                 Variant
//               </label>
//               <div id="variant-options" className="flex flex-wrap gap-4">
//                 {variants.map((v) => (
//                   <div key={v.value}>
//                     <input
//                       type="radio"
//                       id={v.value}
//                       name="variant"
//                       value={v.value}
//                       checked={variant === v.value}
//                       onChange={() => setVariant(v.value)}
//                       className="sr-only peer"
//                     />
//                     <label
//                       htmlFor={v.value}
//                       className={`flex flex-col items-center justify-center w-16 h-16 border-2 rounded-md cursor-pointer peer-checked:border-primary ${v.color} hover:bg-opacity-80 transition-colors`}
//                     >
//                       <span className="text-xs font-semibold">{v.label}</span>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
//                 Quantity:
//               </label>
//               <div className="flex items-center border rounded-md">
//                 <button
//                   className="p-2"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </button>
//                 <span className="w-8 text-center">{quantity}</span>
//                 <button
//                   className="p-2"
//                   onClick={() => setQuantity(quantity + 1)}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add to Cart</button>
//             <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">Buy Now</button>
//           </div>
//         </div>
//       </div>
//       <div className="mt-12 bg-[#F1F8E9] p-10 min-h-screen ">
//         <div className="border-b">
//           <nav className="-mb-px flex space-x-8" aria-label="Tabs">
//             {['description', 'reviews', 'video'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`${
//                   activeTab === tab
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="mt-4">
//           {activeTab === 'description' && (
//             <div className="text-sm text-gray-600">
//               Our premium {variants.find(v => v.value === variant)?.label} honey is sourced from local beekeepers, ensuring the highest quality and supporting sustainable practices. This golden nectar is perfect for sweetening your tea, spreading on toast, or using in your favorite recipes. Rich in antioxidants and natural enzymes, our honey not only tastes delicious but also offers numerous health benefits.
//               asdfasdfadsfasdfasdfasdfasdfsadf
//               sadf
//               asdfasdfadsfasdfasdfasdfasdfsadfasdf
//               asdfasdfadsfasdfasdfasdfasdfsadfasdfasdf
//               async function async function asdfasdfadsfasdfasdfasdfasdfsadfasdfasdffasd
//               falsefad
//               falsefad
//             </div>
//           )}
//           {activeTab === 'reviews' && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold">Customer Reviews</h3>
//                   <div className="flex items-center mt-1">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
//                     ))}
//                     <span className="ml-2 text-sm text-gray-600">{averageRating.toFixed(1)} out of 5</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setIsReviewDialogOpen(true)}
//                   className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Write a review
//                 </button>
//               </div>
//               <div className="space-y-2">
//                 {[5, 4, 3, 2, 1].map((rating) => (
//                   <div key={rating} className="flex items-center">
//                     <span className="w-20 text-sm text-gray-600">{rating} star</span>
//                     <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
//                       <div
//                         className="bg-yellow-400 h-2.5 rounded-full"
//                         style={{ width: `${reviews.filter(r => r.rating === rating).length / reviews.length * 100}%` }}
//                       ></div>
//                     </div>
//                     <span className="w-16 text-sm text-gray-600 text-right">
//                       {Math.round(reviews.filter(r => r.rating === rating).length / reviews.length * 100)}%
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <div className="space-y-4">
//                 {reviews.map((review) => (
//                   <div key={review.id} className="border-t pt-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
//                           <span className="text-xl font-semibold">{review.author[0]}</span>
//                         </div>
//                         <div className="ml-4">
//                           <p className="text-sm font-semibold">{review.author}</p>
//                           <div className="flex items-center">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                       <span className="text-sm text-gray-500">1 week ago</span>
//                     </div>
//                     <p className="mt-2 text-sm text-gray-600">{review.content}</p>
//                     <div className="mt-2 flex items-center space-x-4">
//                       <button className="flex items-center text-sm text-gray-500">
//                         <ThumbsUp className="w-4 h-4 mr-2" />
//                         Helpful ({review.helpful})
//                       </button>
//                       <button className="flex items-center text-sm text-gray-500">
//                         <ThumbsDown className="w-4 h-4 mr-2" />
//                         Not Helpful ({review.notHelpful})
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {activeTab === 'video' && (
//             <div>
//               <div className="aspect-video relative">
//                 <img
//                   src="/placeholder.svg?height=400&width=600"
//                   alt="Video thumbnail"
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <button className="py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center">
//                     <Play className="w-6 h-6 mr-2" />
//                     Play Video
//                   </button>
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold mt-4">Product Video</h3>
//               <p className="text-sm text-gray-600 mt-2">
//                 Watch our video to learn more about our honey production process and the benefits of our premium honey varieties.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//       {isReviewDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
//             <p className="text-sm text-gray-600 mb-4">Share your thoughts about this product with other customers.</p>
//             <form onSubmit={handleReviewSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="author" className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   id="author"
//                   value={newReview.author}
//                   onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
//                   required
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
//                 <div className="flex items-center space-x-1 mt-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setNewReview({ ...newReview, rating: star })}
//                       className="p-0 bg-transparent border-none"
//                     >
//                       <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label htmlFor="content" className="block text-sm font-medium text-gray-700">Review</label>
//                 <textarea
//                   id="content"
//                   value={newReview.content}
//                   onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
//                   required
//                   rows={4}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                 ></textarea>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsReviewDialogOpen(false)}
//                   className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Submit Review
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//     <FeaturedProducts />
//     <Footer />
//     </>
//   )
// }