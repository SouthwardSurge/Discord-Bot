import axios from "axios";
import { config } from "./config.js";

export const detectLanguage = async (text) => {
  try {
    const response = await axios.post(
      "https://google-translate1.p.rapidapi.com/language/translate/v2/detect",
      new URLSearchParams({ q: text }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-rapidapi-host": "google-translate1.p.rapidapi.com",
          "x-rapidapi-key": config.rapidApiKey,
        },
      }
    );
    return response.data.data.detections[0][0].language; 
  } catch (error) {
    console.error("Error detecting language:", error);
    return null;
  }
};
