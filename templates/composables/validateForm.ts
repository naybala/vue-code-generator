import type { __PascalName__ } from "@customTypes/index";

export function validate__PascalName__Form(
  form: __PascalName__,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.name || form.name.trim() === "") {
    errors.name = t("__plural__.nameRequired");
  }

  return errors;
}
