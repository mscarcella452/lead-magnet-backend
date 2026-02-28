import { cva } from "class-variance-authority";

const containerVariants = cva("flex flex-col", {
  variants: {
    spacing: {
      none: "",
      item: "gap-2", // Inline / micro
      group: "gap-4", // Tight clusters
      block: "gap-6", // Heading → content
      content: "gap-8 @5xl:gap-12", // Main content group
      stack: "gap-12 @5xl:gap-16", // Large internal separation
      section: "gap-16 @5xl:gap-20", // Page sections
    },

    width: {
      fit: "w-fit",
      full: "w-full max-w-full",
      constrained: "",
    },

    position: {
      center: "mx-auto",
      start: "mr-auto",
      end: "ml-auto",
    },
  },
  compoundVariants: [
    {
      width: "constrained",
      spacing: "section",
      className: "w-full max-w-4xl @5xl:max-w-7xl",
    },
  ],

  defaultVariants: {
    spacing: "section",
    position: "start",
    width: "full",
  },
});

export { containerVariants };
