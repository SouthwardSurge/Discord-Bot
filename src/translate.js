import axios from "axios";
import { config } from "./config.js";

export const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post(
      "https://google-translate1.p.rapidapi.com/language/translate/v2",
      new URLSearchParams({
        q: text,
        target: targetLang,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-rapidapi-host": "google-translate1.p.rapidapi.com",
          "x-rapidapi-key": config.rapidApiKey,
        },
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
};
