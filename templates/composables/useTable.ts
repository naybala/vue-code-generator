import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { __PascalName__Index } from "@customTypes/index";
import type { __PascalName__ } from "@customTypes/index";

export function use__PascalName__Table() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo } = useAppToast();

  const searchTerm = ref("");

  const {
    items: items,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<__PascalName__Index>({
    apiPath: "api/web/__plural__",
  });

  let debounceTimer: ReturnType<typeof setTimeout>;

  const fetchData = async (newPage?: number, newLimit?: number) => {
    clearTimeout(debounceTimer);

    return new Promise<void>((resolve) => {
      debounceTimer = setTimeout(async () => {
        try {
          await fetchAll({
            page: newPage || page.value,
            limit: newLimit || limit.value,
            search: searchTerm.value,
          });
          resolve();
        } catch (e) {
          console.error("Fetch error:", e);
        }
      }, 300);
    });
  };

  onMounted(async () => {
    await fetchData();
  });

  watch(searchTerm, () => {
    fetchData(1);
  });

  const openNewForm = () => {
    router.push({ name: "__routeName__-new" });
  };

  const editItem = (item: __PascalName__) => {
    router.push({ name: "__routeName__-edit", params: { id: item.id } });
  };

  const confirmDeleteItem = (event: Event, item: __PascalName__) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("__plural__.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("__plural__.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("__plural__.notDeleted"));
      },
    });
  };

  return {
    t,
    items,
    loading,
    error,
    searchTerm,
    page,
    limit,
    total,
    fetchData,
    openNewForm,
    editItem,
    confirmDeleteItem,
  };
}
