"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { motion, AnimatePresence, px } from "motion/react";
import { siteConfig } from "@/config";
import { LogoAvatar } from "@/components/brand/logo-avatar";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const from = params.get("from") ?? "/dashboard";

    const res = await fetch(`/api/auth/login?from=${from}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setIsLoading(false);
      return;
    }

    router.push(data.redirectTo);
  };

  return (
    <Inset className="flex min-h-screen ">
      <h1 className="sr-only">{siteConfig.name} Admin Login</h1>

      <Card
        size="lg"
        variant="panel"
        className="@container w-full  aspect-square flex flex-col items-center justify-center space-y-6 max-w-md m-auto shadow-sm"
      >
        {/*=========== Header ===========*/}
        <CardHeader>
          <Container spacing="block" className="items-center">
            <LogoAvatar className="size-16!" />
            <Container spacing="item" className="text-center">
              <CardTitle className="text-2xl @sm:text-3xl font-semibold">
                {siteConfig.name}
              </CardTitle>
              <CardDescription className="text-subtle-foreground">
                Log in to access the lead dashboard
              </CardDescription>
            </Container>
          </Container>
        </CardHeader>

        {/*=========== Content ===========*/}
        <CardContent className="w-full">
          <Container as="form" onSubmit={handleSubmit} spacing="group">
            {/* motion.div with layout here is what smoothly pushes the
                  password field down/up as the alert mounts and unmounts */}
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
                      id="login-error"
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
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  if (error) setError("");
                  setPassword(e.target.value);
                }}
                aria-describedby={error ? "login-error" : undefined}
                aria-invalid={!!error}
                disabled={isLoading}
                required
                autoFocus
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
              {isLoading ? "Logging in…" : "Continue"}
            </Button>
          </Container>
        </CardContent>
      </Card>
    </Inset>
  );
}
