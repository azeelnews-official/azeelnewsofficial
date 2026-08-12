"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

export function useTranslatedText(text:string):string{

  const { locale } = useLanguage();

  return text;

}
