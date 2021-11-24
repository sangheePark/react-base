import { history } from "@store/history";
import {
  API_URL,
  ESetAuthResultType,
  LocalStorageKeys,
  YN,
} from "@model/enum/Common";
import { LoginResult } from "@model/Auth";
import { LoginResultCode, LoginType, ProcsDvcd } from "@model/enum/LoginEnum";
import { PluginAuthList } from "@model/enum/Common";
import StringUtils from "./StringUtils";
import { MKeyPadResult, MPromiseResult } from "@root/model/Common";
import {
  EBusinessType,
  FINGER_LINK_ERR_MSG,
  FINGER_ERR_CODE,
} from "@model/enum/MyData";
import { LinkedCompanyItem } from "@model/MyData";
import { G_CONFIRM_PROPS } from "@component/UI";
import { String } from "aws-sdk/clients/cloudsearchdomain";
import purify from "dompurify";
import moment from "moment";
import { isEmpty, uniqueId, find } from "lodash";

const stringUtils = StringUtils.getInstance();

declare const window: any;
declare const IRoot: any;
const REACT_APP_ENV_MODE: string = process.env.REACT_APP_ENV_MODE as string;

export  CommonUtil = {
  isMobile(): boolean {
    try {
      //return stringUtils.isNotEmpty(window["exposedapi"]);
      return typeof window["exposedapi"] === "object";
    } catch (e) {
      return false;
    }
  },

  isAndroid(): boolean {
    return window._ENV.deviceInfo.osPlatform === "Android";
  },

  isIOS(): boolean {
    return window._ENV.deviceInfo.osPlatform !== "Android";
  },

  isRootWebView(): boolean {
    try {
      // console.log(`isRootWebView:isMobile:${this.isMobile()}`);
      if (this.isMobile()) {
        let isRootWebView: boolean | undefined = window._ENV.isRootWebView;
        isRootWebView = !(
          typeof isRootWebView === "boolean" &&
          JSON.stringify(isRootWebView) === "false"
        );
        return isRootWebView;
      } else {
        return !window.opener;
      }
    } catch (e) {
      console.log(`isRootWebView:error`);
      return false;
    }
  },

  isAllowServer(srvList: string[]): boolean {
    try {
      if (stringUtils.isNotEmpty(srvList)) {
        return srvList.includes(REACT_APP_ENV_MODE);
      } else {
        throw "";
      }
    } catch {
      return false;
    }
  },

  goBack() {
    if (!this.isRootWebView()) {
      window.exposedApiUtils.pluginSubmitMultiWebview({
        callback: "multiWebViewPopCallback",
      });
    } else {
      const path = history.location.pathname;
      console.log(`history.length:${history.length}`);
      if (path.startsWith("/main") || path.startsWith("/login")) {
        const timer: number | undefined = window.destoryTimer;
        if (typeof timer === "number" && timer > 0) {
          window.exposedApiUtils.pluginExitApp();
        } else {
          window.exposedApiUtils.pluginShowToast({
            message: "뒤로가기 키를 한번 더 누르면 앱이 종료 됩니다.",
          });
          window.destoryTimer = setTimeout(() => {
            try {
              clearTimeout(window.destoryTimer);
              delete window.destoryTimer;
            } catch {}
          }, 2000);
        }
      } else {
        history.goBack();
      }
    }
  },


  openNewPop(
    url: string,
    title: string,
    callback: (params?: any) => void = () => {},
    datas: any = {},
    w: number = 500,
    h: number = 768,
    exception?: () => void,
    isOurPage: boolean = true,
  ) {
    // const validSesstion = (data: any) => {};
    const afterCloseCallback = "multiWebViewPopCallback";
    // if (callback) {
    this.addCallBackWindowFn(
      afterCloseCallback,
      (data: any) => {
        //서브웹뷰 세션처리
        // if (data?.isSessionOut) {
        // } else {
        callback(data);
        // }
      },
      true,
      true,
    );
    // }

    //멀티웹뷰에서 page-not-found-page 화면 호출 후, 멀티웹뷰를 닫은 후 화면이동시 사용
    const routingCallback = "multiWebviewPopRoutingCallback";
    this.addCallBackWindowFn(
      routingCallback,
      (data: { path: string } | { isSessionOut: YN }) => {
        // if ("isSessionOut" in data && data?.isSessionOut) {
        //   //isSessionOut에 대한 처리 추가
        // } else
        if ("path" in data && data?.path) {
          if (history.location.pathname.startsWith(data.path)) {
            history.replace("/gateWay");
            setTimeout(() => {
              history.replace(data.path);
            }, 10);
          } else {
            history.push(data.path);
          }
        }
      },
      true,
      true,
    );

    if (isOurPage && url.indexOf("#") == -1) {
      url = "/#" + url;
    }
    if (this.isMobile()) {
      const mwurl = isOurPage ? window.location.origin + url : url;
      console.log(datas);
      window.exposedApiUtils.pluginOpenMultiWebview({
        url: mwurl,
        datas: { multiWebViewDatas: datas },
      });
    } else {
      if (this.validateURL(url)) {
        const resources = JSON.parse(JSON.stringify(window._ENV));
        resources.isRootWebView = false;
        // console.log(`openNewPop:isRootWebView:${resources.isRootWebView}`);
        const sendDatas = this.mergeJson(
          { multiWebViewDatas: datas },
          { resources: resources },
        );
        localStorage.setItem(
          LocalStorageKeys.MULTIWEBVIEW_SEND_DATA,
          JSON.stringify({ value: sendDatas }),
        );
        const PopOpt =
          "top=0, left=0, height=" +
          h +
          ", width=" +
          w +
          ", status=no, menubar=no, toolbar=no, resizable=no";

        const newPopObj = window.open(url, title, PopOpt);

        let chkPop = setInterval(() => {
          try {
            let chk = undefined;
            try {
              chk = newPopObj["opener"];
            } catch {
              throw "";
            }
            if (!chk) {
              localStorage.removeItem(LocalStorageKeys.MULTIWEBVIEW_SEND_DATA);

              // if (callback) {
              if (typeof window[afterCloseCallback] === "function") {
                delete window[afterCloseCallback];
              }
              // }
              clearInterval(chkPop);
            }
          } catch {
            console.log("어케되니111");
            if (exception) {
              console.log("어케되니222");
              exception();
            }
            if (chkPop) {
              clearInterval(chkPop);
            }
          }
        }, 100);
      }
    }
  },
  isLogin(): boolean {
    const userInfo = window._ENV[LocalStorageKeys.USER_INFO];
    try {
      return stringUtils.isNotEmpty(userInfo.mbrNo);
    } catch {
      return false;
    }
  },

  addCallBackWindowFn(
    callbackName: string,
    callback: (params?: any) => void,
    remove: boolean = true,
    init: boolean = false,
  ) {
    try {
      if (init) {
        this.removeCallbackWindowFn(callbackName);
      }
    } catch {}
    // console.log(`if (!window[callbackName]) {`);
    if (!window[callbackName]) {
      // console.log(`if (stringUtils.isNotEmpty(callbackName) && callback) {`);
      window[callbackName] = (data: any) => {
        // 서브웹뷰에서의 타임아웃 처리
        // console.log(`addCallBackWindowFn:${data.data}`);
        if (data?.isSessionOut === YN.Y) {
          console.log("[ㅇ ㅑㅇ ㅑㅇ ㅑ]");
          console.log(data);
          history.replace({
            pathname: "/login",
            state: { error: "expired" },
          });
        } else {
          if (stringUtils.isNotEmpty(callbackName) && callback) {
            try {
              callback(data);
              if (remove) {
                this.removeCallbackWindowFn(callbackName);
              }
            } catch (error) {
              this.removeCallbackWindowFn(callbackName);
            }
          }
        }
      };
    }
  },

  removeCallbackWindowFn(callbackName: string) {
    try {
      delete window[callbackName];
    } catch {}
  }
,
  makeRandomNumber(min?: number, max?: number) {
    min = min ? min : 0;
    max = max ? max : 1000;

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },

  makeRandomString(length?: number) {
    let text = "";

    length = length ? length : 10;
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  /**
   * 개행문자가 있는 문자열에 JSX br 태그를 추가해서 리턴한다
   *
   * @param  {[String]} lines [description]
   * @return {[JSX]}       [description]
   */
  textLineBreak(lines: string, replaceChar: string = "<br />") {
    try {
      const replace = lines.split(/\r\n/).join(replaceChar);
      return replace.split(/\r|\n/).join(replaceChar);
    } catch {
      return lines;
    }
  },

  makeDangerouslyPurifyHtml(html: string): string {
    let purifyHtml = html || "";
    try {
      purifyHtml = purify.sanitize(this.unEscapeHtml(this.textLineBreak(html)));
    } catch {}
    return purifyHtml;
  },

  unEscapeHtml(html: string): String {
    let convert = html;
    try {
      convert = html
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&amp;/gi, "&");
    } catch {}

    return convert;
  },

  getRegexPattern(patternType: string) {
    let pattern = /\S/gi;
    switch (patternType) {
      case "email":
        pattern =
          /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        break;
      case "number":
        pattern = /^[0-9]*$/;
        break;
      case "phone":
        pattern = /^01(?:0|1|[6-9]) - (?:\d{3}|\d{4}) - \d{4}$/;
        break;
      case "filePassword":
        pattern = /^[a-zA-Z0-9]{4,10}$/;
        break;
    }
    return pattern;
  },

  validateURL = (url: string): boolean => {
    try {
      if (stringUtils.isNotEmpty(url)) {
        const parsed = new URL(url);
        return ["https:", "http:"].includes(parsed.protocol);
      } else {
        return false;
      }
    } catch (e) {
      return true;
    }
  },

  priceToString = (price: number) => {
    if (price === 0) return price;
    return price
      ? Math.floor(price)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "";
  },

  calculatePeriod = (startStr: string, endStr: string) => {
    let period = "";
    if (startStr && endStr && endStr !== "99991231" && startStr !== endStr) {
      let startMo = moment(startStr);
      let endMo = moment(endStr);
      //같은 년도이면
      if (startMo.format("YYYY") === endMo.format("YYYY")) {
        period = endMo.diff(startMo, "month") + "개월";
      } else {
        period = endMo.diff(startMo, "year") + "년";
      }
    }
    return period;
  },
}
