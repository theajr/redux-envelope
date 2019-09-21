import chalk from "chalk";
import fs from "fs";
import Listr from "listr";
import path from "path";
import { promisify } from "util";
import { docGenerator } from "./docGen.js";
import { reducerGenerator } from "./reducerGen";
const access = promisify(fs.access);
const { generateSDK } = require("./sdkgen.js");

export async function createProject(options) {
  options = {
    ...options
  };

  const jsonFile = options.jsonFile;
  const jsonFileDir = path.resolve(process.cwd(), jsonFile);
  options.jsonFile = jsonFileDir;

  const jsFile = options.jsFile;
  if (jsFile) {
    const jsFileDir = path.resolve(process.cwd(), jsFile);
    options.jsFile = jsFileDir;
  }
  try {
    await access(jsonFileDir, fs.constants.R_OK);
    if (jsFile) {
      await access(jsFile, fs.constants.R_OK);
    }
  } catch (err) {
    console.error(
      "%s does not exist or invalid or no permission to read",
      chalk.red.bold("ERROR")
    );
    process.exit(1);
  }
  let initialStateString = "";
  const tasks = new Listr(
    [
      {
        title: "SDK generated successfully.",
        task: () => generateSDK(options).then(res => (initialStateString = res))
      },
      {
        title: "Reducer generated successfully.",
        task: () => reducerGenerator(options.name, initialStateString)
      },
      {
        title: "Docs generated successfully.",
        task: () => docGenerator(options)
      }
    ],
    {
      exitOnError: false
    }
  );

  await tasks.run();
  console.log(
    `
    %s sdk folder generated successfully with required files
    `,
    chalk.green.bold("DONE")
  );
  return true;
}
