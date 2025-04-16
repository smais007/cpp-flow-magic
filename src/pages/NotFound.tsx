
import { FlowChart } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
