// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';

// export default function ProductDetailsHeader({ title = "Product Details", breadcrumbs = [] }) {
//   return (
//     <header className="bg-[#F1F8E9] py-[5%] px-[5%]">
//       <div className="container mx-auto px-4">
//         <h1 className="text-2xl font-bold text-[#1A237E] mb-2">{title}</h1>
//         <nav className="text-sm text-[#1A237E]" aria-label="Breadcrumb">
//           <ol className="flex items-center space-x-2">
//             {breadcrumbs.map((crumb, index) => (
//               <React.Fragment key={index}>
//                 <li>
//                   {crumb.link ? (
//                     <Link to={crumb.link} className="hover:underline">
//                       {crumb.text}
//                     </Link>
//                   ) : (
//                     <span aria-current="page" className="font-medium">
//                       {crumb.text}
//                     </span>
//                   )}
//                 </li>
//                 {index < breadcrumbs.length - 1 && (
//                   <li>
//                     <ChevronRight className="w-4 h-4" />
//                   </li>
//                 )}
//               </React.Fragment>
//             ))}
//           </ol>
//         </nav>
//       </div>
//     </header>
//   );
// }

export default function ProductDetailsHeader({ title = "Product Details", breadcrumbs = [] }) {
  return null;
}
