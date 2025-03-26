import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <section className="bg-gray-100 min-h-screen grow">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <div className="flex justify-center">
            <FaExclamationTriangle className="fas fa-exclamation-triangle fa-5x text-8xl text-yellow-400"></FaExclamationTriangle>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
            <p className="text-gray-500 text-xl mb-10">
              FORE! You hit one out of bounds.
            </p>
            <Link
              href="/"
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-6 rounded-sm"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
      <div className="grow"></div>
    </section>
  );
};
export default NotFoundPage;
