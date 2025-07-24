import { ref, onMounted, watch, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { User } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateUserForm } from "./validateUserForm";

export function useUserForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const saving:Ref<boolean> = ref(false);

  const itemId = route.params.id ? Number(route.params.id) : null;
  const isEditMode = ref(!!itemId);

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<User>({ apiPath: "api/web/users" });

  const form = ref<User>({
    name: "",
    description: "",
    // other fields
  });

  const validationErrors = ref<Record<string, string>>({});

  onMounted(async () => {
    if (isEditMode.value && itemId) {
      await fetchOne(itemId);
      if (item.value) {
        form.value = { ...item.value };
      }
    }
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    validationErrors.value = validateUserForm(form.value, t);
    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    saving.value = true;
    try {
      if (isEditMode.value && itemId) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("users.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("users.created"));
      }
      router.push({ name: "users" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(t("common.error"), err.message || "An unexpected error occurred");
    } finally {
      saving.value = false;
    }
  };

  const cancel = () => {
    router.push({ name: "user" });
  };

  return {
    t,
    isEditMode,
    form,
    validationErrors,
    save,
    cancel,
    loading,
    error,
    saving,
  };
}
