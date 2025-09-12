import { ref, onMounted, watch, Ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { __PascalName__ } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validate__PascalName__Form } from "./validate__PascalName__Form";
import { __PascalName___CREATE_API_PATHS } from "./apiPaths";

export function use__PascalName__Form() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const state = reactive({
    saving: false,
    isEditMode: route.name === "__routeName__-edit",
    isShowMode: route.name === "__routeName__-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: __PascalName___CREATE_API_PATHS.__plural__ });

  const form = ref<__PascalName__>({
    name: "",
    description: "",
    // other fields
  });

  onMounted(async () => {
    try {
      if (
        (state.isEditMode.value || state.isShowMode.value) &&
        route.params.id
      ) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
        setTimeout(() => {
          loading.value = false;
        }, 300);
      }
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validate__PascalName__Form(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      if (state.isEditMode && route.params.id) {
        await updateItem(form);
        showSuccess(t("common.success"), t("__plural__.updated"));
      } else {
        await createItem(form);
        showSuccess(t("common.success"), t("__plural__.created"));
      }
      router.push({ name: "__plural__" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      state.saving = false;
    }
  };

  const cancel = () => {
    router.push({ name: "__plural__" });
  };

  return {
    t,
    state,
    form,
    save,
    cancel,
    loading,
    error,
  };
}
