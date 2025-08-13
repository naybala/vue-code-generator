import { ref, onMounted, watch, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { __PascalName__ } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validate__PascalName__Form } from "./validate__PascalName__Form";

export function use__PascalName__Form() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const saving:Ref<boolean> = ref(false);

  const itemId = route.params.id ? Number(route.params.id) : null;
  const isEditMode = ref(route.name === "__routeName__-edit");
  const isShowMode = ref(route.name === "__routeName__-view"); 

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<__PascalName__>({ apiPath: "api/web/__plural__" });

  const form = ref<__PascalName__>({
    name: "",
    description: "",
    // other fields
  });

  const validationErrors = ref<Record<string, string>>({});

  onMounted(async () => {
    if ((isEditMode.value || isShowMode.value) && itemId) {
      await fetchOne(itemId);
      if (item.value) {
        form.value = { ...item.value };
      }
      setTimeout(() => {
        loading.value = false;          
      }, 300);  
    }
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (isShowMode.value) return;  

    validationErrors.value = validate__PascalName__Form(form.value, t);

    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    saving.value = true;
    try {
      if (isEditMode.value && itemId) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("__plural__.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("__plural__.created"));
      }
      router.push({ name: "__plural__" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(t("common.error"), err.message || "An unexpected error occurred");
    } finally {
      saving.value = false;
    }
  };

  const cancel = () => {
    router.push({ name: "__plural__" });
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
