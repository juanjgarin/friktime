/* eslint-disable @next/next/no-img-element */
// Las imágenes las cargan los dueños (Blob o URL externa): se sirven tal cual.
export function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img loading="lazy" decoding="async" alt="" {...props} />;
}
