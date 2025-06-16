import { useRouter } from 'next/router' // Keep for potential future use, though Clerk might handle redirects
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { MessageCircle } from 'lucide-react' // SignInButton will provide its own UI/icon
import { SignInButton, useUser } from "@clerk/nextjs";
import { useEffect } from 'react'; // For redirecting if user is already signed in

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    // Optional: return a loading indicator, though Clerk's SignInButton might handle this if visible
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is signed in, useEffect will redirect. If not, show login.
  // This check prevents rendering the login card momentarily before redirecting.
  if (isSignedIn) {
    return null; // Or a loading indicator
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-gradient">Welcome to TG Auto Responder</CardTitle>
          <CardDescription>Sign in to manage your auto-response settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Automate your Telegram responses with ease.
          </p>
        </CardContent>
        <CardFooter>
          {/* Using SignInButton to open Clerk's sign-in modal.
              It will show configured OAuth providers (Telegram).
              Redirects to /dashboard after successful sign-in.
           */}
          <div className="w-full"> {/* Wrapper to help with styling if needed */}
            <SignInButton mode="modal" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
              {/* You can optionally style this button or use a child component
                  for custom appearance, but Clerk's default button is often sufficient.
                  For now, letting Clerk render its default button.
                  If we want the old "Sign In with Telegram" text and icon, we'd do:
                  <Button className="w-full btn-primary">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Sign In with Telegram
                  </Button>
              */}
            </SignInButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
