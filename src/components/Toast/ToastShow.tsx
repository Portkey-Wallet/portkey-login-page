import { eventBus } from "src/utils";
export const TOAST_EVENT = "TOAST_EVENT";

export interface TToastProps {
  message: string;
  timeout?: number;
}

export const Toast = {
  show: (message = "", timeout = 3000) => {
    eventBus.emit(TOAST_EVENT, {
      message,
      timeout,
    });
  },
};
