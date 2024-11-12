import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
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
              Are you hungry?!
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              
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
