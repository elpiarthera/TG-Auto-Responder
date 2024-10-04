import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "react" {
  export = React;
}

declare module "next/router" {
  export const useRouter: any;
}

declare module "lucide-react" {
  export const MessageCircle: any;
}

declare module "react-toastify" {
  export const toast: any;
  export const ToastContainer: any;
}
