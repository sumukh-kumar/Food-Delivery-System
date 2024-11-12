// import { ArrowRight, UtensilsCrossed, Clock, Star } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <div className="flex flex-col">
//       {/* Hero Section */}
//       <div 
//         className="relative h-[600px] bg-cover bg-center"
//         style={{
//           backgroundImage: 'url("https://wallpapers.com/images/hd/navy-blue-iphone-yzjsghc6werkxnrj.jpg")'
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
//           <div className="text-white">
//             <h1 className="text-5xl font-bold mb-4">
//               Delicious Food,<br />Delivered To Your Door
//             </h1>
//             <p className="text-xl mb-8 max-w-2xl">
//               Order from your favorite restaurants and get food delivered straight to your doorstep.
//             </p>
//             <Link
//               to="/restaurants"
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
//             >
//               Order Now
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Features Section
//       <div className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
//             <p className="mt-4 text-xl text-gray-600">
//               We make food ordering and delivery simple and delightful
//             </p>
//           </div>

//           <div className="mt-16">
//             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//               <div className="text-center">
//                 <div className="flex justify-center">
//                   <UtensilsCrossed className="h-12 w-12 text-orange-500" />
//                 </div>
//                 <h3 className="mt-4 text-xl font-semibold text-gray-900">Wide Selection</h3>
//                 <p className="mt-2 text-gray-600">
//                   Choose from hundreds of restaurants and thousands of dishes
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="flex justify-center">
//                   <Clock className="h-12 w-12 text-orange-500" />
//                 </div>
//                 <h3 className="mt-4 text-xl font-semibold text-gray-900">Fast Delivery</h3>
//                 <p className="mt-2 text-gray-600">
//                   Get your food delivered in 30 minutes or less
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="flex justify-center">
//                   <Star className="h-12 w-12 text-orange-500" />
//                 </div>
//                 <h3 className="mt-4 text-xl font-semibold text-gray-900">Best Quality</h3>
//                 <p className="mt-2 text-gray-600">
//                   We partner with only the best restaurants in your area
//                 </p>
//               </div>
//             </div>
//           </div> */}
//         </div> 
      
    
//   );
// };

// export default Home;


import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://wallpapers.com/images/hd/navy-blue-iphone-yzjsghc6werkxnrj.jpg")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold mb-4">
              Delicious Food,<br />Delivered To Your Door
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Order from your favorite restaurants and get food delivered straight to your doorstep.
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
            >
              Order Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
