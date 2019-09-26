import chalk from "chalk";

export function toCamelCase(s = "") {
  return s
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
export function toTitleCase(s = "") {
  return s.replace(/\w+/g, function(w) {
    return w[0].toUpperCase() + w.slice(1).toLowerCase();
  });
}
export function extractPathParams(path) {
  const paramsArr = path.match(/{\w+}/g);
  return (paramsArr || []).map(param => param.replace(/{|}/g, "")) || [];
}
export const notEmptyObj = obj => Object.keys(obj).length;

export const printManPage = () => {
  console.log(
    `
    
    ${chalk.gray.bold("Flags")}             ${chalk.gray.bold("Usage")}
    `
  );
  const manPage = `  --json-file:         String, --jsonFile filename.json or --jsonFile=filename.json or --jsonFile ../Downloads/filename.json

  --js-file:           String   
  
  --version:          String
  
  --name:             String
  
  --baseUrl:          String
  
  --requiredHeaders: [String] --requiredHeaders token,key,account or --requiredHeaders=token,key,account
  
  --optionalHeaders: [String]
  
  --help: Boolean

 ${chalk.gray.bold("or you can you use the following aliases")}

  -f: --json-file
  -j: --js-file
  -v: --version
  -b: --baseUrl
  -o: --optionalHeaders
  -r: --requiredHeaders
  -h: --help
  `;
  console.log(manPage);
};
export const getDefinitionKey = a =>
  (a["$ref"] && a["$ref"] && a["$ref"].split("#/definitions/")[1]) ||
  (a &&
    a.items &&
    a.items["$ref"] &&
    a.items["$ref"].split("#/definitions/")[1]);

export const removeKeys = (obj, ...a) => {
  let abc = {};
  Object.keys(obj).forEach(key =>
    (a || []).includes(key) ? undefined : (abc[key] = obj[key])
  );
  return abc;
};
export const isGoJson = json => {
  const api = json && json[0];
  return api && api.type && api.url && api.name && api.parameter.fields;
};
export const isSwaggerJson = json => {
  return json && json.swagger;
};
export const stringifyObj = obj =>
  Object.keys(obj)
    .map(key => {
      return `${key}:${
        typeof obj[key] !== "object" ? obj[key] : JSON.stringify(obj[key])
      }`;
    })
    .join()
    .replace(/:/g, "-");
