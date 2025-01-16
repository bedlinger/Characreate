import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

export default defineNuxtPlugin(() => {
  return {
    provide: {
        htmlToImage: {
            toPng,
            toJpeg,
            toBlob,
            toPixelData,
            toSvg,
        }
    },
  };
});