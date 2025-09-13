<script setup lang="ts">
import { use__PascalName__Form } from "@composables/__routeName__/use__PascalName__Form";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";

const { t, state, form, save, loading, cancel, error } =
  use__PascalName__Form();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("__plural__.view")
          : state.isEditMode
          ? t("__plural__.edit")
          : t("__plural__.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <NameField
            id="name"
            v-model="form.name"
            :label="t('__plural__.name')"
            :error="state.validationErrors.name"
            :readonly="state.isShowMode"
          />

          <Description
            v-model="form.description"
            :label="t('__plural__.description')"
            :readonly="state.isShowMode"
          />

          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="state.saving"
            :readonly="state.isShowMode"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
