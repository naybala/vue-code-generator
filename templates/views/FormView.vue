<script setup lang="ts">
import { use__PascalName__Form } from "@composables/__plural__/use__PascalName__Form";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";

const {
  t,
  isShowMode,
  isEditMode,
  form,
  save,
  validationErrors,
  cancel,
  error,
  saving,
} = use__PascalName__Form();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        isShowMode
          ? t("__plural__.view")
          : isEditMode
          ? t("__plural__.edit")
          : t("__plural__.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <form @submit.prevent="save">
          <NameField
            v-model="form.name"
            :label="t('__plural__.name')"
            :error="validationErrors.name"
            :readonly="isShowMode"
          />

          <Description
            v-model="form.description"
            :label="t('__plural__.description')"
            :readonly="isShowMode"
          />

          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="saving"
            :readonly="isShowMode"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
