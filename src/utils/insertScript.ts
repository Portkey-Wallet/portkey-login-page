export const insertScript = async (
  d: Document,
  s = "script",
  id: string,
  jsSrc: string
) =>
  new Promise((resolve, reject) => {
    try {
      const scriptTag: any = d.createElement(s);
      scriptTag.id = id;
      scriptTag.src = jsSrc;
      scriptTag.async = true;
      scriptTag.defer = true;
      const scriptNode = document.getElementsByTagName("script")?.[0];
      scriptNode &&
        scriptNode.parentNode &&
        scriptNode.parentNode.insertBefore(scriptTag, scriptNode);
      scriptTag.onload = resolve;
    } catch (error) {
      reject(error);
    }
  });
