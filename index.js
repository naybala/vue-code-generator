#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowerFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function pluralize(name) {
  return name.toLowerCase().endsWith("s")
    ? name.toLowerCase()
    : name.toLowerCase() + "s";
}

function processTemplate(content, replacements) {
  return content
    .replace(/__PascalName__/g, replacements.pascalName)
    .replace(/__camelName__/g, replacements.camelName)
    .replace(/__plural__/g, replacements.pluralName)
    .replace(/__routeName__/g, replacements.routeName);
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

async function main() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Name of the feature to generate:",
    },
  ]);

  const pascalName = capitalize(name);
  const camelName = lowerFirst(name);
  const pluralName = pluralize(name);
  const routeName = camelName;

  const replacements = { pascalName, camelName, pluralName, routeName };

  const composablesDir = path.join(
    projectRoot,
    "src",
    "composables",
    pluralName
  );
  const viewsDir = path.join(projectRoot, "views", pluralName);
  const templatesDir = path.join(__dirname, "templates");

  await fs.ensureDir(composablesDir);
  await fs.ensureDir(viewsDir);

  // Composables
  await generateFromTemplate(
    path.join(templatesDir, "composables", "useForm.ts"),
    path.join(composablesDir, `use${pascalName}Form.ts`),
    replacements
  );

  await generateFromTemplate(
    path.join(templatesDir, "composables", "useTable.ts"),
    path.join(composablesDir, `use${pascalName}Table.ts`),
    replacements
  );

  await generateFromTemplate(
    path.join(templatesDir, "composables", "validateForm.ts"),
    path.join(composablesDir, `validate${pascalName}Form.ts`),
    replacements
  );

  // Views
  await generateFromTemplate(
    path.join(templatesDir, "views", "FormView.vue"),
    path.join(viewsDir, `${pascalName}FormView.vue`),
    replacements
  );

  await generateFromTemplate(
    path.join(templatesDir, "views", "ListView.vue"),
    path.join(viewsDir, `${pascalName}ListView.vue`),
    replacements
  );

  console.log(`Feature "${pascalName}" generated successfully.`);
}

main().catch((err) => console.error("Error:", err));
