"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubIcon, Loader, Loader2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
export function LoginForm() {
  const [isPendingSignup, startTransitionSignup] = useTransition();
  const [isPendingLogin, startTransitionLogin] = useTransition();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function signInWithGithub() {
    startTransitionSignup(async () => {
      await authClient.signUp.email({
        email: email,
        password: password,
        name: "Test",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed up successfully"); // redirect to login page
          },
          onError: (e) => {
            console.log({ e });

            toast.error("Internal server Error");
          },
        },
      });
    });
  }

  function signInWithEmailPassword() {
    startTransitionLogin(async () => {
      await authClient.signIn.email({
        email: email, // required
        password: password,
        fetchOptions: {
          onSuccess: () => {
            toast.success(`Signed in as ${email}`);
            router.push(`/`);
          },
          onError: (err) => {
            toast.error(`Please check email`);
            console.log(err.error);
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-6">
        <Button
          disabled={isPendingSignup}
          onClick={signInWithGithub}
          className="w-full"
          variant="outline"
        >
          {isPendingSignup ? (
            <>
              <Loader className="size-4 animate-spin" /> <span>Signing up</span>
            </>
          ) : (
            <>
              <Plus className="size-4" />
              <span>Sign up</span>
            </>
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className=" grid gap-2">
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input
              placeholder="xyz@example.com"
              type="email"
              name="email"
              id="email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className=" grid gap-2">
            <Label htmlFor="email" className="">
              Password
            </Label>
            <Input
              placeholder="*******"
              type="password"
              name="password"
              id="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <Button disabled={isPendingLogin} onClick={signInWithEmailPassword}>
            {isPendingLogin ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <>Continue with Email</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
