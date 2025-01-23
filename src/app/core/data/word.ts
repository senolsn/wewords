export const defaultWordsEN = [
  "run",
  "have",
  "do",
  "say",
  "go",
  "swim",
  "get",
  "make",
  "know",
  "think",
];

export const defaultWordsTR = [
  "koşmak",
  "sahip olmak",
  "yapmak",
  "söylemek",
  "gitmek",
  "yüzmek",
  "almak",
  "yapmak",
  "bilmek",
  "düşünmek",
];

interface LevelWord {
  EN: string;
  TR: string;
}

export const A1_WORDS: LevelWord[] = [
  { EN: "hello", TR: "merhaba" },
  { EN: "goodbye", TR: "hoşçakal" },
  { EN: "please", TR: "lütfen" },
  { EN: "thank you", TR: "teşekkür ederim" },
  { EN: "yes", TR: "evet" },
  { EN: "no", TR: "hayır" },
  { EN: "water", TR: "su" },
  { EN: "food", TR: "yemek" },
  { EN: "house", TR: "ev" },
  { EN: "car", TR: "araba" }
];

export const A2_WORDS: LevelWord[] = [
  { EN: "weather", TR: "hava durumu" },
  { EN: "family", TR: "aile" },
  { EN: "work", TR: "çalışmak" },
  { EN: "school", TR: "okul" },
  { EN: "friend", TR: "arkadaş" },
  { EN: "time", TR: "zaman" },
  { EN: "money", TR: "para" },
  { EN: "shopping", TR: "alışveriş" },
  { EN: "holiday", TR: "tatil" },
  { EN: "travel", TR: "seyahat" }
];

export const B1_WORDS: LevelWord[] = [
  { EN: "experience", TR: "deneyim" },
  { EN: "opportunity", TR: "fırsat" },
  { EN: "decision", TR: "karar" },
  { EN: "environment", TR: "çevre" },
  { EN: "relationship", TR: "ilişki" },
  { EN: "culture", TR: "kültür" },
  { EN: "technology", TR: "teknoloji" },
  { EN: "development", TR: "gelişim" },
  { EN: "society", TR: "toplum" },
  { EN: "education", TR: "eğitim" }
];

export const B2_WORDS: LevelWord[] = [
  { EN: "consequence", TR: "sonuç" },
  { EN: "perspective", TR: "bakış açısı" },
  { EN: "significant", TR: "önemli" },
  { EN: "approach", TR: "yaklaşım" },
  { EN: "research", TR: "araştırma" },
  { EN: "analysis", TR: "analiz" },
  { EN: "influence", TR: "etki" },
  { EN: "strategy", TR: "strateji" },
  { EN: "achievement", TR: "başarı" },
  { EN: "innovation", TR: "yenilik" }
];

export const C1_WORDS: LevelWord[] = [
  { EN: "comprehensive", TR: "kapsamlı" },
  { EN: "fundamental", TR: "temel" },
  { EN: "subsequent", TR: "sonraki" },
  { EN: "initiative", TR: "girişim" },
  { EN: "implementation", TR: "uygulama" },
  { EN: "hypothesis", TR: "hipotez" },
  { EN: "phenomenon", TR: "fenomen" },
  { EN: "controversy", TR: "tartışma" },
  { EN: "perception", TR: "algı" },
  { EN: "methodology", TR: "metodoloji" }
];

export const C2_WORDS: LevelWord[] = [
  { EN: "epitome", TR: "örnek" },
  { EN: "ubiquitous", TR: "her yerde olan" },
  { EN: "paradigm", TR: "örnek model" },
  { EN: "pragmatic", TR: "pragmatik" },
  { EN: "ambiguous", TR: "belirsiz" },
  { EN: "empirical", TR: "deneysel" },
  { EN: "cognition", TR: "biliş" },
  { EN: "arbitrary", TR: "keyfi" },
  { EN: "implicit", TR: "örtülü" },
  { EN: "explicit", TR: "açık" }
];
