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
  pixelBasedPreset,
  Text,
  Hr,
} from "@react-email/components";
import { lightTheme } from "../styles";
import { cn } from "@/lib/utils";

export const EmailWrapper = ({
  children,
  preview,
  className,
}: {
  children: React.ReactNode;
  preview: string;
  className?: string;
}) => {
  return (
    <Html>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                ...lightTheme,
              },
            },
          },
        }}
      >
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="x-apple-disable-message-reformatting" />
          <meta
            name="format-detection"
            content="telephone=no,address=no,email=no,date=no,url=no"
          />
          <style>{`* { margin: 0; padding: 0; }`}</style>
        </Head>

        <Preview>{preview}</Preview>

        <Body className="text-foreground font-sans">
          <Container className="px-6 py-8 mx-auto">{children}</Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
