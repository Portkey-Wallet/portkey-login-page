export type ReCaptchaType = "success" | "error" | "cancel" | "expire";

export interface BaseReCaptcha {
  siteKey?: string;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
  customReCaptchaHandler?: () => Promise<{
    type: ReCaptchaType;
    message?: any;
  }>;
}
