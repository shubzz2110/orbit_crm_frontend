import { useNavigate } from "react-router";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { getDashboardRoute } from "@/lib/auth-utils";

export default function NotFound() {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold">404</CardTitle>
            <CardDescription className="text-lg">
              Page Not Found
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Please check the URL or return to the dashboard.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate(getDashboardRoute(role))} className="w-full sm:w-auto">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

