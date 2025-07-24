# Vue Code Generator

A simple CLI tool to quickly generate Vue core features including composables(useForm.ts , useTable.ts , validateForm.ts) and views(FormView.vue , ListView.vue) based on your input.
This tool is designed to streamline the development process by scaffolding out common patterns and structures in Vue applications, allowing developers to focus on building features rather than boilerplate code.

---

## Features

- Generate composables files (useForm.ts , useTable.ts , validateForm.ts)
- Generate views files (FormView.vue , ListView.vue)
- Scaffold routes with authentication and validation middleware

---

## Installation

Install via npm:

```bash
npm install vue-code-generator

add in your package.json

"scripts": {
    ...,
    ... other scripts,
    ...,
    "make-core-ui-feature": "node ./node_modules/vue-code-generator/index.js"
  }

```

## Usage

```bash
npm run make-core-ui-feature
```

## Folder directory

```bash
templates/
│   ├── composables/
│   │   ├── useForm.ts
│   │   ├── useTable.ts
│   │   └── validateForm.ts
│   └── views/
│       ├── FormView.vue
│       ├── ListView.vue
│_______________________

```
