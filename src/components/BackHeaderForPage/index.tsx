import TitleWrapper, { TitleWrapperProps } from "../TitleWrapper";
import "./index.css";

export default function BackHeaderForPage({
  title,
  leftCallBack,
  rightElement,
  ...props
}: TitleWrapperProps) {
  return (
    <TitleWrapper
      className="back-header-page-wrapper"
      title={title}
      leftCallBack={leftCallBack}
      rightElement={rightElement}
      {...props}
    />
  );
}
