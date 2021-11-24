import React, { ReactElement, useEffect } from "react";
import "@styles/PageStyle.css";
import { EEventType } from "@model/enum/Common";
import cx from "classnames";
import { setGlobalBackFunction } from "@root/pages/common/AppProvider";
import useUtils from "@root/hooks/Utils";
import { useHistory } from "react-router";

type IProps = {
  onClick?: () => void;
  onBeforeClose?: () => Promise<boolean>; //닫기 전 검증
  onClose?: (eventType: EEventType) => void; //닫기 1순위 함수
  onPhysicalClose?: () => void; //back 물리 버튼 함수
  isRouting?: boolean; //라우팅 이동 = true, 팝업 이동 = false
  onScroll?: () => void; //스크롤 엔드 이벤트
  title?: string;
  button?: ReactElement<HTMLButtonElement>;
  contentClass?: string | "gray-bg";
  className?: string;
};
declare const window: any;
const Page: React.FC<IProps> = ({
  onBeforeClose = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  },
  onClose,
  onPhysicalClose = () => {
    window.exposedApiUtils.pluginSubmitMultiWebview({
      callback: "multiWebViewPopCallback",
    });
  },
  isRouting = false,
  onScroll,
  title = "",
  children,
  button,
  contentClass,
  className,
  onClick = () => {},
}) => {
  const { commonUtils } = useUtils();
  const history = useHistory();
  const handleScroll = () => {
    const scrollHeight =
      document.getElementsByClassName("content-area")[0].scrollHeight;
    const clientHeight =
      document.getElementsByClassName("content-area")[0].clientHeight;
    const scrollTop = Math.ceil(
      document.getElementsByClassName("content-area")[0].scrollTop,
    );
    const scrollLeft = Math.ceil(
      document.getElementsByClassName("content-area")[0].scrollLeft,
    );
    console.log(
      `onScroll:sHeight:${scrollHeight}, cHeight:${clientHeight}, scrollTop:${scrollTop}, scrollLeft:${scrollLeft}`,
    );
    if (scrollHeight - clientHeight - scrollTop <= 0) {
      onScroll && onScroll();
    }
  };
  useEffect(() => {
    if (onClose) {
      onClose(EEventType.CANCEL);
    } else {
      setGlobalBackFunction(() => {
        goBack();
      });
    }

    return () => {
      if (onClose) {
        setGlobalBackFunction();
      }
    };
  }, []);

  const goBack = () => {
    console.log(`Page:goBack`);
    if (isRouting) {
      history.goBack();
    } else {
      onPhysicalClose();
    }
  };
  return (
    <div
      className={cx("block full-width relative detail", className)}
      onClick={onClick}
    >
      <header className={"header hbox center between"}>
        <button
          className={"back"}
          onClick={async () => {
            const result = await onBeforeClose();
            if (result) {
              if (onClose) {
                //onClose 사용시 물리 버튼 이벤트 각 화면에서 구현해야함.
                onClose(EEventType.CANCEL);
              } else {
                //기본 설정값
                // 라우팅 여부에 따라서 history.goBack 또는 pluginSubmitMultiWebview
                goBack();
              }
            }
          }}
        ></button>
        <h2 className={"page-title"}>{title}</h2>
        {button}
      </header>
      <div className={cx("content-area", contentClass)} onScroll={handleScroll}>
        {children}
      </div>
    </div>
  );
};

export default Page;
