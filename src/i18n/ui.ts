export type Lang = "es" | "en";

export const LOCALES: Record<Lang, { label: string; hrefLang: string }> = {
  es: { label: "ES", hrefLang: "es-419" },
  en: { label: "EN", hrefLang: "en" },
};

export const LOCALE_TO_PATH: Record<Exclude<Lang, "es">, string> = {
  en: "/en",
};

export type Translations = typeof import("./index").es;
