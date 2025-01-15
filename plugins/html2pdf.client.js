import html2pdf from "html2pdf.js";

export default defineNuxtPlugin(() => {
  // had to make a plugin because directly importing html2pdf.js in the component
  // where I need to use it was causing an error as the import would run on the server
  // side and html2pdf.js is a client-side-only library. This plugin runs on the
  // client side only (due to the .client extension) so it works fine.
  return {
    provide: {
      html2pdf: (element, options) => {
        return html2pdf(element, options);
      },
    },
  };
});
