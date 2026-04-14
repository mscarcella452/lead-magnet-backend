import { Row, Column, Img, Section } from "@react-email/components";
import { EmailSeperator } from "./email-seperator";
import { SITE_CONFIG } from "@/config";

export const EmailLogoHeader = () => {
  return (
    <Section className="mb-8">
      <Row>
        <Column align="left">
          <Row className="w-auto table-fixed border-collapse border-spacing-0">
            <Column className="overflow-hidden rounded-full p-0 text-center align-middle ">
              <Img
                src="http://localhost:3000/logo.jpeg"
                alt="Logo"
                className="size-6 rounded-full"
              />
            </Column>
            <Column className="pl-2">
              <h1 className="text-base font-semibold">
                {SITE_CONFIG.business_name}
              </h1>
            </Column>
          </Row>
        </Column>
      </Row>
      <EmailSeperator className="mt-2" />
    </Section>
  );
};
