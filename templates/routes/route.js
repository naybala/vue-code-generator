import __PascalName__ListView from "@views/__localizedName__/__PascalName__ListView.vue";
import __PascalName__FormView from "@views/__localizedName__/__PascalName__FormView.vue";

export const __camelName__Routes = [
  {
    path: "/__kebabName__",
    name: "__routeName__",
    component: __PascalName__ListView,
    meta: {
      requiresAuth: true,
      permission: "__camelName__.index",
      sidebar: true,
      label: "sidebar.__localizedName__",
      icon: "pi pi-prime",
    },
  },
  {
    path: "/__kebabName__/new",
    name: "__routeName__-new",
    component: __PascalName__FormView,
    meta: {
      requiresAuth: true,
      permission: "__camelName__.store",
    },
  },
  {
    path: "/__kebabName__/edit/:id",
    name: "__routeName__-edit",
    component: __PascalName__FormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "__camelName__.edit",
    },
  },
  {
    path: "/__kebabName__/view/:id",
    name: "__routeName__-view",
    component: __PascalName__FormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "__camelName__.show",
    },
  },
];
