import arcjet, { shield, detectBot, tokenBucket , slidingWindow} from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";


if(!process.env.ARCJET_KEY && process.env.NODE_ENV !=='test'){
    throw new Error("ARCJET_KEY is not defined");
}

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR", 
        "CATEGORY:PREVIEW", 
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: '2s', 
      max: 3, 
    }),
  ],
});

export default aj;