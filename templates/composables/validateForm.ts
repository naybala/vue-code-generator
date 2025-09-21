import type { __PascalName__ } from "@customTypes/index";
import { nextTick } from "vue";

export function validate__PascalName__Form(
  form: __PascalName__,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof __PascalName__; errorKey: string }[] = [
    { field: "id", errorKey: "idRequired" },
    __extraRequiredFields__,
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`__localizedName__.${errorKey}`);
    }
  }
  scrollToFirstErrorField(errors);

  return errors;
}

async function scrollToFirstErrorField(errors: Record<string, string>) {
  const firstErrorKey = Object.keys(errors)[0];
  if (!firstErrorKey) return;
  const baseField = firstErrorKey.replace(/Required$/, "");
  await nextTick();
  const el = document.getElementById(baseField);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus?.();
  }
}
