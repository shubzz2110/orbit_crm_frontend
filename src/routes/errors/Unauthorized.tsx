import { useNavigate } from "react-router";
import { ShieldAlert, Home, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold">401</CardTitle>
            <CardDescription className="text-lg">
              Unauthorized Access
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You need to be authenticated to access this page. Please log in to continue.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate("/auth/login")} className="w-full sm:w-auto">
            <Lock className="h-4 w-4 mr-2" />
            Log In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

