import { API, APIGroup, YAPI } from "../types/types";
import { JSONSchema4 } from "json-schema";

const folderArray: { name: any; apis: any[] }[] = [];
const apiArray = [];

const processData = (apiData: any[]) => {
  apiData.forEach((folder: { list: any[]; name: any }) => {
    const apis: {
      title: any;
      req_query: any;
      req_body_other: any;
      res_body: any;
    }[] = [];

    folder.list.forEach(
      (api: {
        title: any;
        req_query: any;
        req_body_other: any;
        res_body: any;
      }) => {
        apis.push({
          title: api.title,
          req_query: api.req_query,
          req_body_other: api.req_body_other
            ? transformJsonString(api.req_body_other)
            : null,
          res_body: api.res_body ? transformJsonString(api.res_body) : null,
        });
      }
    );

    folderArray.push({
      name: folder.name,
      apis,
    });

    apiArray.push(apis);
  });
};

const transformJsonString = (str: string) => {
  const newStr = str.replace(/\n/g, "");
  const obj = eval("(" + newStr + ")");
  return obj;
};

//const output = processData(data);
console.log("folderArray", folderArray);
// console.log("apiArray", apiArray);

export async function generateJsCode(api: {
  req_query: any[];
  res_body: any;
  resBody: any;
}) {
  console.log("generateJsCode", api);

  let searchItems = "export const SEARCH_ITEMS = () => [\n";
  api.req_query.forEach((item: { desc: any; name: any }) => {
    searchItems += `{ title: '${item.desc}', key: '${item.name}'},\n`;
  });
  searchItems += "];";

  console.log("generateJsCode_columns", api.resBody.properties);
  let columns = "export const COLUMNS = (languagePak, modalHandle) => [\n";
  const res_body_properties = api.resBody.properties;

  for (let [key, value] of Object.entries<any>(res_body_properties)) {
    console.log(key + ":" + value);
    columns += `{ title: '${value.description}', key: '${key}', dataIndex:'${key}'},\n`;
  }

  columns +=
    "{\n key: 'operation',\n dataIndex: 'operation',\n title: languagePak.operation,\n fixed: 'right'\n},\n";
  columns += "];";

  console.log("search", searchItems);
  console.log("columns", columns);
  return { searchItems, columns };
}

export function transformYapi(data: YAPI.YAPIGroup[]): APIGroup[] {
  // TODO: 参数类型JSON: yapi取req_body_other, 后续支持form类型
  const groups: APIGroup[] = [];

  data.forEach((item) => {
    const group: APIGroup = {
      name: item.name,
      desc: item.desc,
      list: [],
    };

    item.list.forEach((i) => {
      const pathParams = i.req_params ? i.req_params.map((p) => p.name) : [];
      const queryParams = i.req_query ? i.req_query.map((p) => p.name) : [];

      let resBodySchema: JSONSchema4 | null = null;
      let reqBodySchema: JSONSchema4 | null = null;

      if (i.res_body) {
        try {
          resBodySchema = JSON.parse(i.res_body);
        } catch (e) {
          console.log("Invalid res_body");
        }
      }

      if (i.req_body_other) {
        try {
          reqBodySchema = JSON.parse(i.req_body_other);
        } catch (e) {
          console.log("Invalid req_body_other");
        }
      }

      const api: API = {
        path: i.path,
        title: i.title,
        desc: i.desc,
        method: i.method,
        pathParams,
        queryParams,
        req_query: i.req_query,
        resBody: resBodySchema,
        res_body: i.res_body,
        reqBody: reqBodySchema,
        yapi: {
          id: i._id,
        },
      };
      group.list.push(api);
    });

    groups.push(group);
  });
  return groups;
}
