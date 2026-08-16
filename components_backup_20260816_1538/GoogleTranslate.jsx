"use client";

import { useEffect } from "react";

export default function GoogleTranslate() {

useEffect(() => {
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,hi,bn,ta,te,mr",
        layout:
        window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.src =
  "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);

}, []);

return (
  <div id="google_translate_element"></div>
);
}
