"use server";

import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";
import { getPrompt } from "./prompt";
import { TConfig } from "./types";

export async function generate(config: TConfig) {
  const {
    apiKey,
    businessTheme,
    frontend,
    backend,
    database,
    uiFramework,
    formLibrary,
  } = config;
  const stream = createStreamableValue("");

  const google = createGoogleGenerativeAI({ apiKey });

  (async () => {
    const { textStream } = streamText({
      model: google("gemini-1.5-flash"),
      temperature: 1,
      prompt: getPrompt(
        businessTheme,
        frontend,
        backend,
        database,
        uiFramework,
        formLibrary
      ),
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
