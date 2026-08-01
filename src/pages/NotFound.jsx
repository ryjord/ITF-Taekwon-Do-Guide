import { jsxDEV } from "react/jsx-dev-runtime";

export const NotFound = () => {
  return (
    <div className="min-h-screen theme-colours bg-colour-background text-colour-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline mt-4 inline-block">
          Return to Home
        </a>
      </div>
    </div>
  );
};