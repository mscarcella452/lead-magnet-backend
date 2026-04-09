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

interface InviteEmailProps {
  name: string;
  magicLink: string;
}

export default function InviteEmail({ name, magicLink }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome! Set your password to get started</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="max-w-[600px] mx-auto p-5">
            <EmailLogoHeader />

            <Heading className="text-[#333] mb-5">Welcome, {name}!</Heading>

            <Text className="text-[#666] leading-relaxed mb-5">
              You&#39;ve been invited to join our lead dashboard. Click the
              button below to set your password and get started.
            </Text>

            <Section className="my-8">
              <Button
                className="inline-block bg-[#0066cc] text-white px-6 py-3 rounded-md no-underline font-medium"
                href={magicLink}
              >
                Set Your Password
              </Button>
            </Section>

            <Text className="text-[#999] text-sm mb-2 break-all">
              Or copy this link: {magicLink}
            </Text>

            <Text className="text-[#999] text-xs mt-8 pt-5 border-t border-[#eee]">
              This link expires in 24 hours. If you didn&#39;t request this
              invite, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
