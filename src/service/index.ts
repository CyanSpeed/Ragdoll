import axios from "axios";
import { window } from "vscode";
import * as vscode from "vscode";
const baseURL = "https://yapi.baidu.com";

let contextReference: vscode.ExtensionContext | null = null;

export const setContext = (context: vscode.ExtensionContext) => {
  contextReference = context;
};

export const instance = axios.create({
  headers: {
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    Connection: "keep-alive",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
  },
  withCredentials: true,
  timeout: 10000, // request timeout
  baseURL,
});

axios.defaults.withCredentials = true;

instance.interceptors.request.use((value) => {
  //let testCookie = "";
  //value.headers.cookie = testCookie;
  value.headers.cookie = contextReference?.globalState.get("loginCookie");
  console.log("请求参数", value);
  return value;
});

instance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      const setCookie = response.headers["set-cookie"];
      if (setCookie) {
        console.log("response", setCookie);
        contextReference?.globalState.update("loginCookie", setCookie);
      }

      return response.data ? response.data : {};
    }
    console.log(response.status);
    return {};
  },
  (err) => {
    console.log("报错", err);
    window.showErrorMessage(err);
  }
);

interface IRes<T> {
  data: T;
}

interface IListQuery {
  current?: number;
  pageSize?: number;
}

export interface ListItem {
  name: string;
  day_id: number;
  publish_date: string;
  content: string;
  type: "md" | "js";
}

type IListRes = IRes<ListItem[]>;

export const getProblemList = (
  params: IListQuery = {
    current: 1,
    pageSize: 9999,
  }
): Promise<IListRes> => {
  return instance.get("/api/questions", { params });
};

export interface ICreateAnswerRes {
  success: boolean;
  errorMsg?: string;
}

export const createAnswer = (
  dayId: string,
  content: string,
  gitId: number
): Promise<ICreateAnswerRes> => {
  return instance.post(`/api/answer/${dayId}`, { content, gitId });
};

export interface Answer {
  answer_id: number;
  answer_content: string;
  answer_date: Date | string;
}

export interface IGetAnswersRes {
  success: boolean;
  subject_name: string;
  subject_content: string;
  refer_answer: string;
  errorMsg?: string;
  data: Answer[];
}
