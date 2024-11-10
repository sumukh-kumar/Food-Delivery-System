// import Card from '../components/Card';
import jig from './jig.jpeg'


export default function About() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                src={jig}
                alt="Profile picture of John Doe"
                className="h-48 w-full object-cover md:h-full md:w-80"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Among Us</div>
              <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900">
                Jigga
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                    Jigalli Puff
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }