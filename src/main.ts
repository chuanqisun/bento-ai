import OpenAI from "openai";
import { type CardElement, defineCardElement } from "./lib/card-element";
import "./style.css";

defineCardElement();

async function main() {
  document.querySelector<HTMLButtonElement>("#new-card")!.addEventListener("click", (e) => {
    const newCard = document.createElement("card-element")!;
    (e.target as HTMLElement).insertAdjacentElement("beforebegin", newCard);
  });

  document.addEventListener("keydown", (e) => {
    const targetCard = (e.target as HTMLElement)?.closest("card-element");
    if (targetCard && e.key === "Enter" && !e.shiftKey && (e.ctrlKey || e.metaKey) && !e.altKey) {
      // summarize ui state
      const tree = [...document.querySelectorAll<CardElement>("card-element")].map((card) => card.innerData);
    }
  });

  const openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: localStorage.getItem("knoll-ai:openai-api-key")!,
  });

  const output = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "hello",
  });

  console.log(output.output_text);
}

function normalizeTextToXMLTagName(text: string) {
  return text
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

main();
