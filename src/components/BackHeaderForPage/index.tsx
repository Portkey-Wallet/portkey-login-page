import TitleWrapper, { TitleWrapperProps } from "../TitleWrapper";
import "./index.css";

export default function BackHeaderForPage({
  className,
  title,
  leftCallBack,
  rightElement,
  ...props
}: TitleWrapperProps) {
  return (
    <TitleWrapper
      className={"common-back-header-page-wrapper " + (className || "")}
      title={title}
      leftCallBack={leftCallBack}
      rightElement={rightElement}
      {...props}
    />
  );
}
