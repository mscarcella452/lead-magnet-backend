import { Tailwind, pixelBasedPreset } from "@react-email/components";
import { lightTheme } from "./styles";

export const TailwindWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
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
      {children}
    </Tailwind>
  );
};
