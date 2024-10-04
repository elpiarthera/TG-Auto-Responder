import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient, Provider } from "@supabase/supabase-js";
import { MessageCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setIsAuthenticated(true);
      router.push("/dashboard");
    }
  }

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "telegram" as Provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to login. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Telegram Auto-Responder</CardTitle>
          <CardDescription className="text-center">
            Login to manage your auto-responder
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            <Button
              className="w-full bg-[#0088cc] hover:bg-[#0077b5]"
              onClick={handleLogin}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Login with Telegram
            </Button>
          ) : (
            <Button className="w-full" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
