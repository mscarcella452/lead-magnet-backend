// ============================================================================
// Dialog Modal Layout Presets
// ============================================================================
const modal = {
  default: "relative my-auto mx-auto max-h-[95vh] w-[min(90vw,40rem)]",
  drawerModal:
    //   ***** make sure DialogContent fixed wrapper motion.div component has @container for contianer queries to work *****
    "@max-lg:mt-auto @max-lg:mb-0 @max-lg:w-screen @max-lg:rounded-b-none @max-lg:rounded-x-none  ",
};

// ============================================================================
// Dialog Drawer Presets
// ============================================================================
const drawer = {
  enterY: "w-screen max-h-[95vh]",
  enterX: "h-screen max-w-xl",
  bottom: "mt-auto rounded-b-none rounded-x-none",
  top: "mb-auto rounded-t-none rounded-x-none ",
  left: "mr-auto rounded-l-none rounded-y-none",
  right: "ml-auto rounded-r-none rounded-y-none",
};

// ============================================================================
// Dialog Layout Variants
// ============================================================================
export const DIALOG_LAYOUT_VARIANTS = {
  modal: modal.default,
  responsiveModal: [modal.default, modal.drawerModal],
  drawer: {
    bottom: [drawer.enterY, drawer.bottom],
    top: [drawer.enterY, drawer.top],
    left: [drawer.enterX, drawer.left],
    right: [drawer.enterX, drawer.right],
  },
  screen: "w-screen h-screen",
};
