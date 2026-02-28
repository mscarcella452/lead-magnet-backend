// ============================================================================
// Dialog Modal Layout Presets
// ============================================================================
const modal = {
  default: "relative self-center mx-auto max-h-[95vh] w-[min(90vw,40rem)]",
  drawerModal:
    //   ***** make sure DialogContent component has @container for contianer queries to work *****
    "@max-lg:self-end @max-lg:w-screen @max-lg:rounded-b-none @max-lg:rounded-x-none",
};

// ============================================================================
// Dialog Drawer Presets
// ============================================================================
const drawer = {
  enterY: "w-screen max-h-[95vh]",
  enterX: "h-screen max-w-xl",
  bottom: "self-end rounded-b-none rounded-x-none",
  top: "self-start rounded-t-none rounded-x-none ",
  left: "self-stretch mr-auto rounded-l-none rounded-y-none",
  right: "self-stretch ml-auto rounded-r-none rounded-y-none",
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
