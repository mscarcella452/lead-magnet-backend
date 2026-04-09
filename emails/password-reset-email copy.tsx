import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailLogoHeader } from "./ui/layout";

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export default function PasswordResetEmail({
  name,
  resetLink,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="max-w-[600px] mx-auto p-5">
            <EmailLogoHeader />

            <Heading className="text-[#333] mb-5">
              Reset your password, <span className="capitalize">{name}</span>
            </Heading>

            <Text className="text-[#666] leading-relaxed mb-5">
              We received a request to reset your password. Click the button
              below to choose a new one.
              <br />
              If you did not request a password reset, you can safely ignore
              this email.
            </Text>

            <Section className="my-8">
              <Button
                className="inline-block bg-[#0066cc] text-white px-6 py-3 rounded-md no-underline font-medium"
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-[#999] text-sm mb-2 break-all">
              Or copy this link: {resetLink}
            </Text>

            <Text className="text-[#999] text-xs mt-8 pt-5 border-t border-[#eee]">
              This link expires in 24 hours. If you didn&#39;t request a
              password reset, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
