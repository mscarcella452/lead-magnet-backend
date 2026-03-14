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
import { AlertCircle } from "lucide-react";
import { Container, Inset } from "@/components/ui/layout/containers";
import { motion, AnimatePresence } from "motion/react";
import { siteConfig } from "@/config";
import { LogoAvatar } from "@/components/brand/logo-avatar";
import { ERROR_MESSAGES, type AuthErrorCode } from "@/lib/auth-errors";

type FormStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string };

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const router = useRouter();
  const params = useSearchParams();

  const hasError = status.state === "error";

  const handleInputChange = (valueUpdate: () => void) => {
    valueUpdate();
    if (hasError) setStatus({ state: "idle" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ state: "loading" });

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      const code = (result.code as AuthErrorCode) ?? "default";
      setStatus({
        state: "error",
        message: ERROR_MESSAGES[code] ?? ERROR_MESSAGES.default,
      });
      return;
    }

    const from = params.get("from") ?? "/dashboard";
    router.push(from);
  };

  return (
    <Inset className="flex min-h-screen @container">
      <h1 className="sr-only">{siteConfig.name} Admin Login</h1>
      <Card
        size="lg"
        variant="panel"
        className="w-full aspect-square flex flex-col items-center justify-center space-y-6 max-w-md m-auto shadow-sm"
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
                Sign in to your account
              </CardDescription>
            </Container>
          </Container>
        </CardHeader>

        {/*=========== Content ===========*/}
        <CardContent className="w-full">
          <Container as="form" onSubmit={handleSubmit} spacing="block">
            <motion.div layout>
              {/*------------- Error Alert -------------*/}
              <AnimatePresence>
                {hasError && (
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
                        <AlertDescription>{status.message}</AlertDescription>
                      </Container>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Container spacing="group">
                {/*------------- Username Field -------------*/}
                <label
                  htmlFor="username"
                  className="text-sm font-medium sr-only"
                >
                  Username
                </label>
                <Input
                  size="md"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    handleInputChange(() => setUsername(e.target.value))
                  }
                  aria-describedby={hasError ? "login-error" : undefined}
                  aria-invalid={hasError}
                  required
                  autoFocus
                />

                {/*------------- Password Field -------------*/}
                <label
                  htmlFor="password"
                  className="text-sm font-medium sr-only"
                >
                  Password
                </label>
                <Input
                  size="md"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    handleInputChange(() => setPassword(e.target.value))
                  }
                  aria-describedby={hasError ? "login-error" : undefined}
                  aria-invalid={hasError}
                  required
                />
              </Container>
            </motion.div>

            {/*------------- Submit Button -------------*/}
            <Button
              size="md"
              type="submit"
              className="w-full"
              disabled={status.state === "loading"}
              aria-busy={status.state === "loading"}
            >
              {status.state === "loading" ? "Logging in…" : "Log In"}
            </Button>
          </Container>
        </CardContent>
      </Card>
    </Inset>
  );
}
