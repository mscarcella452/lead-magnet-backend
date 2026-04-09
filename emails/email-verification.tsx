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

import { EmailWrapper } from "./ui/layout/email-wrapper";

interface EmailVerificationProps {
  name: string;
  newEmail: string;
  verificationLink: string;
  expiryDuration: string;
}

export default function EmailVerification({
  name,
  newEmail,
  verificationLink,
  expiryDuration,
}: EmailVerificationProps) {
  return (
    <EmailWrapper preview="Verify your new email address">
      <Container className="max-w-[600px] mx-auto p-5">
        <EmailLogoHeader />

        <Heading className="text-[#333] mb-5">
          Verify your new email, {name}
        </Heading>

        <Text className="text-[#666] leading-relaxed mb-5">
          You requested to change your email address to{" "}
          <strong>{newEmail}</strong>. Click the button below to confirm this
          change.
        </Text>

        <Section className="my-8">
          <Button
            className="inline-block bg-[#0066cc] text-white px-6 py-3 rounded-md no-underline font-medium"
            href={verificationLink}
          >
            Verify Email Address
          </Button>
        </Section>

        <Text className="text-[#999] text-sm mb-2 break-all">
          Or copy this link: {verificationLink}
        </Text>

        <Text className="text-[#999] text-xs mt-8 pt-5 border-t border-[#eee]">
          This link expires in {expiryDuration}. If you didn&#39;t request this
          change, please ignore this email and your email address will remain
          unchanged.
        </Text>
      </Container>
    </EmailWrapper>
  );
}
