import { Inset } from "@/components/ui/layout/containers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Inset as="main" className="flex min-h-screen @container">
      {children}
    </Inset>
  );
}
