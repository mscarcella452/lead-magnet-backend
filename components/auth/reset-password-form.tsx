"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Button } from "@/components/ui/controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import { Alert, AlertDescription } from "@/components/ui/feedback/alert";
import { AlertCircle } from "lucide-react";
import { Container, Inset } from "@/components/ui/layout/containers";
import { motion, AnimatePresence } from "motion/react";
import { SITE_CONFIG } from "@/config";
import { LogoAvatar } from "@/components/brand/logo-avatar";

export function ResetPasswordForm() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || !password || !confirmPassword) {
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

    // TODO: Implement password reset with code
    // This should:
    // 1. Validate the reset code
    // 2. Hash the new password
    // 3. Update user password
    // 4. Delete the reset code from database
    // 5. Log user in automatically

    console.log("TODO: Implement password reset with code:", {
      code,
      password,
    });
    setError("Password reset feature coming soon");
    setIsLoading(false);
  };

  return (
    <Inset className="flex min-h-screen">
      <h1 className="sr-only">Reset Password</h1>

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
                Enter your reset code and new password
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
                      id="reset-password-error"
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

              {/*------------- Reset Code Field -------------*/}
              <label htmlFor="code" className="text-sm font-medium sr-only">
                Reset Code
              </label>
              <Input
                size="responsive-lg"
                id="code"
                type="text"
                placeholder="Enter your reset code"
                value={code}
                onChange={(e) => {
                  if (error) setError("");
                  setCode(e.target.value);
                }}
                aria-describedby={error ? "reset-password-error" : undefined}
                aria-invalid={!!error}
                disabled={isLoading}
                required
                autoFocus
              />

              {/*------------- Password Field -------------*/}
              <label htmlFor="password" className="text-sm font-medium sr-only">
                New Password
              </label>
              <Input
                size="responsive-lg"
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => {
                  if (error) setError("");
                  setPassword(e.target.value);
                }}
                aria-describedby={error ? "reset-password-error" : undefined}
                aria-invalid={!!error}
                disabled={isLoading}
                required
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
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => {
                  if (error) setError("");
                  setConfirmPassword(e.target.value);
                }}
                aria-describedby={error ? "reset-password-error" : undefined}
                aria-invalid={!!error}
                disabled={isLoading}
                required
              />
            </motion.div>

            {/*------------- Submit Button -------------*/}
            <Button
              size="responsive-lg"
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Resetting password…" : "Reset Password"}
            </Button>
          </Container>
        </CardContent>
      </Card>
    </Inset>
  );
}
