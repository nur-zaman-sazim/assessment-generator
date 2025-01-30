"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

export async function generate(input: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = streamText({
      model: google("gemini-1.5-flash"), //TODO: change model
      prompt: input,
    });

    for await (const delta of textStream) {
      console.log(delta);
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
