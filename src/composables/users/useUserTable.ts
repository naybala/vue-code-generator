import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { UserIndex } from "@customTypes/index";
import type { User } from "@customTypes/index";

export function useUserTable() {
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
  } = useCrud<UserIndex>({
    apiPath: "api/web/users",
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
    router.push({ name: "user-new" });
  };

  const editItem = (item: User) => {
    router.push({ name: "user-edit", params: { id: item.id } });
  };

  const confirmDeleteItem = (event: Event, item: User) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("users.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("users.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("users.notDeleted"));
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
