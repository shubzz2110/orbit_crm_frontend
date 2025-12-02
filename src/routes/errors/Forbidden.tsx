import { useNavigate } from "react-router";
import { ShieldX, Home, ArrowLeft, AlertTriangle } from "lucide-react";
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

export default function Forbidden() {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-orange-600 dark:text-orange-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold">403</CardTitle>
            <CardDescription className="text-lg">
              Access Forbidden
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
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

