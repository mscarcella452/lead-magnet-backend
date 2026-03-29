"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input, Button } from "@/components/ui/controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import { Alert, AlertDescription } from "@/components/ui/feedback/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Container, Inset } from "@/components/ui/layout/containers";
import { motion, AnimatePresence } from "motion/react";
import { SITE_CONFIG } from "@/config";
import { LogoAvatar } from "@/components/brand/logo-avatar";

export function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  // Validate token on mount
  if (!token) {
    return (
      <Inset className="flex min-h-screen">
        <Card
          size="lg"
          variant="panel"
          className="@container w-full aspect-square flex flex-col items-center justify-center space-y-6 max-w-md m-auto shadow-sm"
        >
          <CardHeader>
            <Container spacing="block" className="items-center">
              <LogoAvatar className="size-16!" />
              <Container spacing="item" className="text-center">
                <CardTitle className="text-2xl @sm:text-3xl font-semibold">
                  {SITE_CONFIG.business_name}
                </CardTitle>
                <CardDescription className="text-subtle-foreground">
                  Invalid invite link
                </CardDescription>
              </Container>
            </Container>
          </CardHeader>
          <CardContent className="w-full text-center">
            <p className="text-sm text-muted-foreground mb-4">
              This invite link is invalid or has expired.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </Inset>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set password");
        setIsLoading(false);
        return;
      }

      // Auto-login after password set
      const loginResult = await signIn("credentials", {
        username: data.username,
        password,
        redirect: false,
      });

      if (!loginResult?.ok) {
        setError(
          "Password set successfully, but login failed. Please try logging in.",
        );
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Inset className="flex min-h-screen">
      <h1 className="sr-only">Set Your Password</h1>

      <Card
        size="lg"
        variant="panel"
        className="@container w-full aspect-square flex flex-col items-center justify-center space-y-6 max-w-md m-auto shadow-sm"
      >
        {/*=========== Header ===========*/}
        <CardHeader>
          <Container spacing="block" className="items-center">
            <LogoAvatar className="size-16!" />
            <Container spacing="item" className="text-center">
              <CardTitle className="text-2xl @sm:text-3xl font-semibold">
                {SITE_CONFIG.business_name}
              </CardTitle>
              <CardDescription className="text-subtle-foreground">
                Set your password to get started
              </CardDescription>
            </Container>
          </Container>
        </CardHeader>

        {/*=========== Content ===========*/}
        <CardContent className="w-full">
          <Container as="form" onSubmit={handleSubmit} spacing="group">
            <motion.div layout>
              {/*------------- Error Alert -------------*/}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error-alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Alert
                      variant="destructive"
                      id="set-password-error"
                      aria-live="polite"
                      className="mb-3"
                    >
                      <Container
                        spacing="item"
                        className="flex-row items-center"
                      >
                        <AlertCircle className="size-4" aria-hidden="true" />
                        <AlertDescription>{error}</AlertDescription>
                      </Container>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/*------------- Password Field -------------*/}
              <label htmlFor="password" className="text-sm font-medium sr-only">
                Password
              </label>
              <Input
                size="responsive-lg"
                id="password"
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => {
                  if (error) setError("");
                  setPassword(e.target.value);
                }}
                aria-describedby={error ? "set-password-error" : undefined}
                aria-invalid={!!error}
                disabled={isLoading}
                required
                autoFocus
              />

              {/*------------- Confirm Password Field -------------*/}
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium sr-only"
              >
                Confirm Password
              </label>
              <Input
                size="responsive-lg"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  if (error) setError("");
                  setConfirmPassword(e.target.value);
                }}
                aria-describedby={error ? "set-password-error" : undefined}
                aria-invalid={!!error}
                disabled={isLoading}
                required
              />

              {/*------------- Password Requirements -------------*/}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Password must be:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li className={password.length >= 8 ? "text-green-600" : ""}>
                    At least 8 characters
                  </li>
                  <li
                    className={
                      password === confirmPassword && password
                        ? "text-green-600"
                        : ""
                    }
                  >
                    Passwords must match
                  </li>
                </ul>
              </div>
            </motion.div>

            {/*------------- Submit Button -------------*/}
            <Button
              size="responsive-lg"
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Setting password…" : "Set Password"}
            </Button>
          </Container>
        </CardContent>
      </Card>
    </Inset>
  );
}
