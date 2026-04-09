interface EmailHeadingProps {
  heading: string | React.ReactNode;
  subHeading: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const EmailHeading = ({
  className,
  heading,
  subHeading,
  children,
}: EmailHeadingProps) => {
  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold mb-2">{heading}</h2>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {subHeading}
      </p>
      {children}
    </div>
  );
};
