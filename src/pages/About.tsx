import summi from './Summi.jpeg';
import siri from './Siri.jpeg'

export default function About() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-6">
            <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:flex-shrink-0">
                        <img
                            src={summi}
                            alt="Profile picture of John Doe"
                            className="h-48 w-full object-cover md:h-full md:w-80"
                        />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">About Me</div>
                        <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900">
                            Sumukh Kumar Santhosh
                        </h1>
                        <p className="mt-4 text-xl text-gray-500">
                            Student of PES University
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:flex-shrink-0">
                        <img
                            src={siri}
                            alt="Profile picture of John Doe"
                            className="h-48 w-full object-cover md:h-full md:w-80"
                        />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">About Me</div>
                        <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900">
                            Sripriya Addanki
                        </h1>
                        <p className="mt-4 text-xl text-gray-500">
                            Student of PES University
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
