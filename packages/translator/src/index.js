import i18next from "i18next";
import en from "./en";
import es from "./es";

i18next.init(
  {
    fallbackLng: "en",
    lng: "en",
    debug: true,
    resources: {
      en: en,
      es: es
    }
  }
);

export default {
  ...i18next,
  t: (key, options) => {
    const { lng } = options;

    switch (lng) {
      // these keys don't work with plurals, don't know why, so I added a workaround to convert them to the correct lng
      case "en_US":
      case "en-US":
        options.lng = "en";
        break;
      case "es_ES":
      case "es-ES":
      case "es_MX":
      case "es-MX":
        options.lng = "es";
        break;
      default:
        break;
    }
    return i18next.t(key, { lng, ...options });
  }
};
