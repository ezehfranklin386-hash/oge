import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-neutral-900">404</h1>
      <p className="mt-4 text-lg text-neutral-500">Page not found</p>
      <p className="mt-2 text-sm text-neutral-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-primary/90 px-6 py-3 text-sm font-medium text-white hover:bg-primary"
      >
        Back to Home
      </Link>
    </div>
  );
}
