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
import { Container, Inset } from "@/components/ui/layout/containers";
import { SITE_CONFIG } from "@/config";
import { LogoAvatar } from "@/components/brand/logo-avatar";
import { ERROR_MESSAGES, type AuthErrorCode } from "@/lib/auth-errors";
import { FormMotionAlertContainer } from "@/components/ui/controls/form";

type FormStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; error: string };

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

    if (!username.trim()) {
      setStatus({ state: "error", error: "Username is required." });
      return;
    }
    if (!password) {
      setStatus({ state: "error", error: "Password is required." });
      return;
    }

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
        error: ERROR_MESSAGES[code] ?? ERROR_MESSAGES.default,
      });
      return;
    }

    const from = params.get("from") ?? "/dashboard";
    router.push(from);
  };

  return (
    <Inset className="flex min-h-screen @container">
      <h1 className="sr-only">{SITE_CONFIG.business_name} Admin Login</h1>
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
                {SITE_CONFIG.business_name}
              </CardTitle>
              <CardDescription className="text-subtle-foreground">
                Sign in to your account
              </CardDescription>
            </Container>
          </Container>
        </CardHeader>

        {/*=========== Content ===========*/}
        <CardContent className="w-full">
          {/*------------- Form Container -------------*/}
          <Container
            as="form"
            onSubmit={handleSubmit}
            spacing="block"
            noValidate
          >
            <FormMotionAlertContainer
              error={status.state === "error" ? status.error : undefined}
              spacing="group"
              alertProps={{
                id: "invite-form-error",
                spacing: "block",
              }}
            >
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
                  aria-describedby={hasError ? "login-form-error" : undefined}
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
            </FormMotionAlertContainer>

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
