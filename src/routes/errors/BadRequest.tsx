import { useNavigate } from "react-router";
import { AlertTriangle, Home, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BadRequest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-blue-600 dark:text-blue-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold">400</CardTitle>
            <CardDescription className="text-lg">
              Bad Request
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The request you made is invalid or malformed. Please check your input and try again.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

