import type { User } from "@customTypes/index";

export function validateUserForm(
  form: User,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.name || form.name.trim() === "") {
    errors.name = t("users.nameRequired");
  }

  return errors;
}
