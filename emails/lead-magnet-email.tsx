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

interface LeadMagnetEmailProps {
  pdfUrl: string;
}

export default function LeadMagnetEmail({ pdfUrl }: LeadMagnetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your free resource is ready!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="max-w-[600px] mx-auto p-5">
            <EmailLogoHeader />

            <Heading className="text-[#333] mb-5">
              Thank you for your interest!
            </Heading>

            <Text className="text-[#666] leading-relaxed mb-5">
              Please find your requested resource attached or available at the
              link below.
            </Text>

            <Section className="my-8">
              <Button
                className="inline-block bg-[#0066cc] text-white px-6 py-3 rounded-md no-underline font-medium"
                href={pdfUrl}
              >
                Download Your Resource
              </Button>
            </Section>

            <Text className="text-[#999] text-xs mt-8 pt-5 border-t border-[#eee]">
              If you have any questions, feel free to reach out.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
