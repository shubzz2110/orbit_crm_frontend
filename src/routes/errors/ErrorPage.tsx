import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router";
import { AlertCircle, Home, ArrowLeft, RefreshCw } from "lucide-react";
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

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  const { role } = useAuthStore();

  let errorMessage = "An unexpected error occurred";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const getErrorDetails = () => {
    switch (errorStatus) {
      case 400:
        return {
          title: "400",
          subtitle: "Bad Request",
          description: "The request you made is invalid or malformed. Please check your input and try again.",
          icon: AlertCircle,
          iconColor: "text-blue-600 dark:text-blue-500",
          bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
        };
      case 401:
        return {
          title: "401",
          subtitle: "Unauthorized",
          description: "You need to be authenticated to access this page. Please log in to continue.",
          icon: AlertCircle,
          iconColor: "text-yellow-600 dark:text-yellow-500",
          bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",
        };
      case 403:
        return {
          title: "403",
          subtitle: "Forbidden",
          description: "You don't have permission to access this resource. Please contact your administrator if you believe this is an error.",
          icon: AlertCircle,
          iconColor: "text-orange-600 dark:text-orange-500",
          bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
        };
      case 404:
        return {
          title: "404",
          subtitle: "Not Found",
          description: "The page you're looking for doesn't exist or has been moved. Please check the URL or return to the dashboard.",
          icon: AlertCircle,
          iconColor: "text-destructive",
          bgColor: "bg-destructive/10",
        };
      default:
        return {
          title: errorStatus.toString(),
          subtitle: "Something went wrong",
          description: errorMessage,
          icon: AlertCircle,
          iconColor: "text-destructive",
          bgColor: "bg-destructive/10",
        };
    }
  };

  const errorDetails = getErrorDetails();
  const Icon = errorDetails.icon;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className={`mx-auto h-20 w-20 rounded-full ${errorDetails.bgColor} flex items-center justify-center`}>
            <Icon className={`h-10 w-10 ${errorDetails.iconColor}`} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold">{errorDetails.title}</CardTitle>
            <CardDescription className="text-lg">
              {errorDetails.subtitle}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {errorDetails.description}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          {errorStatus === 401 ? (
            <Button onClick={() => navigate("/auth/login")} className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Log In
            </Button>
          ) : (
            <Button onClick={() => navigate(getDashboardRoute(role))} className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

