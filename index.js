#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import pluralize from "pluralize";
import ora from "ora";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();
const waitingTime = 2000;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowerFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function processTemplate(content, replacements) {
  return content
    .replace(/__PascalName__/g, replacements.pascalName)
    .replace(/__camelName__/g, replacements.camelName)
    .replace(/__plural__/g, replacements.pluralName)
    .replace(/__routeName__/g, replacements.routeName)
    .replace(/__kebabName__/g, replacements.kebabName)
    .replace(/__localizedName__/g, replacements.localizedName);
}

async function generateFromTemplate(
  templateFile,
  destinationFile,
  replacements
) {
  const template = await fs.readFile(templateFile, "utf-8");
  const output = processTemplate(template, replacements);
  await fs.outputFile(destinationFile, output);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Name of the feature to generate (e.g. User):",
    },
  ]);

  const pascalName = capitalize(name);
  const camelName = lowerFirst(name);
  const pluralName = pluralize(name);
  const routeName = camelName;
  const kebabName = toKebabCase(pluralName);
  const localizedName = pluralize(camelName);

  // console.log(`Pascal name: "${pascalName}"`);
  // console.log(`Camel name: "${camelName}"`);
  // console.log(`Plural name: "${pluralName}"`);
  // console.log(`Route name: "${routeName}"`);
  // console.log(`Kebab name: "${kebabName}"`);
  // console.log(`Localized name: "${localizedName}"`);

  const replacements = {
    pascalName,
    camelName,
    pluralName,
    routeName,
    kebabName,
    localizedName,
  };

  const composablesDir = path.join(
    projectRoot,
    "src",
    "composables",
    localizedName
  );
  const viewsDir = path.join(projectRoot, "src", "views", localizedName);
  const templatesDir = path.join(__dirname, "templates");
  const routesDir = path.join(projectRoot, "src", "router");
  const localeDir = path.join(projectRoot, "src", "locales");
  const typesDir = path.join(projectRoot, "src", "types");

  // Check if feature already exists
  const alreadyExists =
    (await fs.pathExists(composablesDir)) || (await fs.pathExists(viewsDir));

  if (alreadyExists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `The feature "${pascalName}" already exists. Do you want to overwrite it?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log("Generation cancelled.");
      return;
    }

    // Remove existing folders
    await fs.remove(composablesDir);
    await fs.remove(viewsDir);
  }

  const spinner = ora(`Generating feature "${pascalName}"...`).start();

  try {
    // Artificial 2 seconds loading simulation
    await sleep(waitingTime);

    // Recreate folders
    await fs.ensureDir(composablesDir);
    await fs.ensureDir(viewsDir);

    // Files to generate
    const filesToGenerate = [
      {
        template: path.join(templatesDir, "composables", "apiPath.ts"),
        destination: path.join(composablesDir, `apiPaths.ts`),
      },
      {
        template: path.join(templatesDir, "composables", "useForm.ts"),
        destination: path.join(composablesDir, `use${pascalName}Form.ts`),
      },
      {
        template: path.join(templatesDir, "composables", "useTable.ts"),
        destination: path.join(composablesDir, `use${pascalName}Table.ts`),
      },
      {
        template: path.join(templatesDir, "composables", "validateForm.ts"),
        destination: path.join(composablesDir, `validate${pascalName}Form.ts`),
      },
      {
        template: path.join(templatesDir, "views", "FormView.vue"),
        destination: path.join(viewsDir, `${pascalName}FormView.vue`),
      },
      {
        template: path.join(templatesDir, "views", "ListView.vue"),
        destination: path.join(viewsDir, `${pascalName}ListView.vue`),
      },
      {
        template: path.join(templatesDir, "routes", "route.js"),
        destination: path.join(routesDir, `${routeName}Routes.ts`),
      },
      {
        template: path.join(templatesDir, "locale", "mm.js"),
        destination: path.join(localeDir, `mm/${localizedName}.js`),
      },
      {
        template: path.join(templatesDir, "locale", "en.js"),
        destination: path.join(localeDir, `en/${localizedName}.js`),
      },
      {
        template: path.join(templatesDir, "types", "type.ts"),
        destination: path.join(typesDir, `${camelName}.ts`),
      },
    ];

    for (const file of filesToGenerate) {
      await generateFromTemplate(file.template, file.destination, replacements);
      spinner.stop();
      console.log(chalk.green(`✓ Created: ${file.destination}`));
      spinner.start();
    }

    spinner.succeed(`Feature "${pascalName}" generated successfully.`);
  } catch (error) {
    spinner.fail("Failed to generate feature.");
    console.error(error);
  }
}

main().catch((err) => console.error("Error:", err));
