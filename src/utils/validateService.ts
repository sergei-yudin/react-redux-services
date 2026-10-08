import type { FormErrors } from "../store/types";

export function validateService(name: string, price: string): FormErrors {
  const errors: FormErrors = {};
  if (name.trim().length < 2) errors.name = "Введите минимум 2 символа";
  if (!price || Number(price) <= 0) errors.price = "Цена должна быть больше 0";
  return errors;
}
