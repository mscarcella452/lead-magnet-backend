// import React from "react";

// export const validateResponsiveIcon = (
//   children: React.ReactNode,
//   labelClassName: string,
// ) => {
//   const childrenArray = React.Children.toArray(children);
//   const hasLabel = childrenArray.some(
//     (child) =>
//       React.isValidElement(child) &&
//       child.props.className?.includes(labelClassName),
//   );

//   if (!hasLabel) {
//     return `mode="responsiveIcon" requires a <span className="${labelClassName}"> child for the label text.`;
//   }

//   return null;
// };

import React from "react";

export const validateResponsiveIcon = (children: React.ReactNode) => {
  const hasControlLabel = (nodes: React.ReactNode): boolean => {
    const childrenArray = React.Children.toArray(nodes);

    return childrenArray.some((child) => {
      if (!React.isValidElement(child)) return false;

      // Check if it's a span with control-label class
      if (
        child.type === "span" &&
        child.props.className?.includes("control-label")
      ) {
        return true;
      }

      // Check if it's the ControlLabel component (function component check)
      if (
        typeof child.type === "function" &&
        child.type.name === "ControlLabel"
      ) {
        return true;
      }

      // Check nested children (handles Fragments, etc.)
      if (child.props.children) {
        return hasControlLabel(child.props.children);
      }

      return false;
    });
  };

  if (!hasControlLabel(children)) {
    return `mode="responsiveIcon" requires a <ControlLabel> child for the label text.`;
  }

  return null;
};
