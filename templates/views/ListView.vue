<script setup lang="ts">
import { watch, onMounted, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { use__PascalName__Table } from "@composables/__plural__/use__PascalName__Table";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";

const {
  items,
  loading,
  searchTerm,
  page,
  limit,
  total,
  fetchData,
  openNewForm,
  editItem,
  viewItem,
  confirmDeleteItem,
} = use__PascalName__Table();

const first = computed(() => (page.value - 1) * limit.value);
const onPageChange = (event: any) => fetchData(event.page + 1, event.rows);
const { t } = useI18n();

watch(searchTerm, () => fetchData(1));
onMounted(() => fetchData());

const permissionStore = usePermissionStore();
const createPermission = computed(() =>
  permissionStore.hasPermission("__plural__.store")
);
const editPermission = computed(() =>
  permissionStore.hasPermission("__plural__.edit")
);
const deletePermission = computed(() =>
  permissionStore.hasPermission("__plural__.delete")
);

const tableColumns = [
  { label: "Name", field: "name" },
  { label: "Description", field: "description" },
];

const tableActions = [
  {
    icon: "pi pi-eye",
    permission: editPermission.value,
    handler: (item: any) => viewItem(item),
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-pencil",
    permission: editPermission.value,
    handler: (item: any) => editItem(item),
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-trash",
    permission: deletePermission.value,
    handler: (item: any, event: Event) => confirmDeleteItem(event, item),
    class: "p-button-text p-button-danger",
  },
];
</script>

<template>
  <div class="p-0 md:p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("__plural__.__plural__") }}</h1>

    <div v-if="loading" class="text-center text-gray-500">
      <Loader />
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md"
        />
        <Button
          v-if="createPermission"
          label="Add"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 p-2 shadow-md"
          @click="openNewForm"
        />
      </div>

      <div>
        <div v-if="items.length === 0" class="text-gray-300">
          No Data Found...
        </div>
        <div v-else class="shadow-md">
          <BaseTable
            :columns="tableColumns"
            :items="items"
            :actions="tableActions"
          />
          <div
            class="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4 pb-2"
          >
            <p class="text-sm text-gray-500 mb-2 ms-0 md:ms-2 text-start">
              Total - {{ total }} items
            </p>
            <Paginator
              :rows="limit"
              :first="first"
              :totalRecords="total"
              :page="page - 1"
              :rowsPerPageOptions="[10, 20, 50]"
              @page="onPageChange"
              class="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
