import React, { FC } from "react";
import { loadImage } from "../../utils/resource";

type SuspenseImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const SuspenseImage: FC<SuspenseImageProps> = (props: SuspenseImageProps) => {
  loadImage(props.src!).read();
  return <img {...props} alt="card" />;
};

export default SuspenseImage;