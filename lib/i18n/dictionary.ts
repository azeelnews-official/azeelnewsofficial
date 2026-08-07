export const uiStrings = {
  en: {
    signIn: "Sign In",
    search: "Search",
    trendingNow: "Trending Now",
    viewAll: "View all",
    topStories: "Top Stories",
    breaking: "Breaking",
    liveTv: "Live TV",
    videos: "Videos",
    photos: "Photos",
    trending: "Trending",
    ePaper: "E-Paper",
    factCheck: "Fact Check",
    advertiseWithUs: "Advertise With Us",
    readMoreIn: "reported and verified by AZEEL NEWS",
  },
  hi: {
    signIn: "साइन इन करें",
    search: "खोजें",
    trendingNow: "अभी ट्रेंडिंग",
    viewAll: "सभी देखें",
    topStories: "मुख्य समाचार",
    breaking: "ब्रेकिंग",
    liveTv: "लाइव टीवी",
    videos: "वीडियो",
    photos: "फ़ोटो",
    trending: "ट्रेंडिंग",
    ePaper: "ई-पेपर",
    factCheck: "फ़ैक्ट चेक",
    advertiseWithUs: "हमारे साथ विज्ञापन दें",
    readMoreIn: "AZEEL NEWS द्वारा रिपोर्ट और सत्यापित",
  },
} as const;

export type Locale = keyof typeof uiStrings;
export type UiStringKey = keyof typeof uiStrings.en;
