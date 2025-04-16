
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Define a custom FlowChart icon since it doesn't exist in lucide-react
const FlowChart = function FlowChart(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="9" y="15" width="6" height="6" rx="1" />
      <path d="M6 9v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
      <path d="M12 12v3" />
    </svg>
  );
};

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto">
        <FlowChart className="h-16 w-16 mx-auto text-cppblue-600 mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-cppblue-800">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! We couldn't find that page</p>
        <Button asChild>
          <a href="/" className="inline-flex items-center">
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
