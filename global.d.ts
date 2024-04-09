interface Window {
  portkey?: {
    request: (options: any) => void;
  };
  Portkey?: Window["portkey"];
  FB?: any;
  MSStream?: any;
}
