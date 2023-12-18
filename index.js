#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const chokidar = require("chokidar");
const inquirer = require("inquirer");
const chalk = require("chalk");

const configPath = "./config.json";
const svgFolder = "./public/svgs";
const outputFolder = "./public/icons";
const svgoConfig = require("./svgo.config");

let config = { autoStart: true };
if (fs.existsSync(configPath)) {
  const configFileContent = fs.readFileSync(configPath, "utf-8");
  config = JSON.parse(configFileContent);
}

const processAnswers = (answers) => {
  svgoConfig.plugins[1].params.attrs = answers.deleteList;
  if (answers.currentColor) {
    svgoConfig.plugins[1].params.attrs = answers.deleteList.concat("fill");
    svgoConfig.plugins[2].params.attributes = answers.currentColor ? [{ fill: "currentColor" }] : [];
  }

  startSvgWatcher();
};

const startSvgWatcher = () => {
  const watcher = chokidar.watch(svgFolder, {
    ignoreInitial: true,
  });

  const handleSvgFile = (filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const optimizedSvg = optimize(fileContent, { path: filePath, ...svgoConfig });

    const componentName = path.basename(
      "_Icon" +
        path
          .basename(filePath)
          .replace(/[\s()]+/g, "")
          .replaceAll("-", ""),
      ".svg"
    );

    const reactComponent = `
// Packages
import React from "react";

const ${componentName} = () => (
  ${optimizedSvg.data}
);

export default ${componentName};`;

    const reactOutputFilePath = path.join(outputFolder, `${componentName}.js`);
    fs.writeFileSync(reactOutputFilePath, reactComponent, "utf-8");

    console.log(`${chalk.blue(`File ${filePath} has been successfully optimized and minified.`)}`);
  };

  watcher.on("add", handleSvgFile);
  watcher.on("change", handleSvgFile);

  console.log(`${chalk.red("Watcher starting...")}`);

  watcher.on("ready", () => {
    console.log(`${chalk.green("Watcher is started. It will process automatically as the file is added.")} `);
  });
};

inquirer
  .prompt([
    {
      type: "checkbox",
      name: "deleteList",
      message: `${chalk.yellow("Select the attributes you want to delete?")}`,
      choices: ["width", "height", "style", "color", "fill", "viewBox"],
      default: true,
    },
    {
      type: "confirm",
      name: "currentColor",
      message: `${chalk.yellow("Set fill attribute to CurrentColor?")}`,
      default: true,
    },
  ])
  .then(processAnswers);
