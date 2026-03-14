"use client";

import { useState } from "react";
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
import { siteConfig } from "@/config";
import { LogoAvatar } from "@/components/brand/logo-avatar";

export function ForgotPasswordForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // TODO: Implement password reset request
    // This should:
    // 1. Validate username and email exist together
    // 2. Generate a reset token
    // 3. Send password reset email
    // 4. Show success message

    console.log("TODO: Implement password reset for:", { username, email });
    setMessage("Password reset feature coming soon");
    setIsLoading(false);
  };

  return (
    <Inset className="flex min-h-screen">
      <h1 className="sr-only">Forgot Password</h1>

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
                {siteConfig.name}
              </CardTitle>
              <CardDescription className="text-subtle-foreground">
                Reset your password
              </CardDescription>
            </Container>
          </Container>
        </CardHeader>

        {/*=========== Content ===========*/}
        <CardContent className="w-full">
          <Container as="form" onSubmit={handleSubmit} spacing="group">
            <motion.div layout>
              {/*------------- Message Alert -------------*/}
              <AnimatePresence>
                {message && (
                  <motion.div
                    key="message-alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Alert variant="default" className="mb-3">
                      <Container spacing="item" className="flex-row items-center">
                        <CheckCircle className="size-4" aria-hidden="true" />
                        <AlertDescription>{message}</AlertDescription>
                      </Container>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/*------------- Username Field -------------*/}
              <label htmlFor="username" className="text-sm font-medium sr-only">
                Username
              </label>
              <Input
                size="responsive-lg"
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
              />

              {/*------------- Email Field -------------*/}
              <label htmlFor="email" className="text-sm font-medium sr-only">
                Email
              </label>
              <Input
                size="responsive-lg"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? "Sending…" : "Send Reset Link"}
            </Button>
          </Container>
        </CardContent>
      </Card>
    </Inset>
  );
}
