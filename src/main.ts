import OpenAI from "openai";
import { type CardElement, defineCardElement } from "./lib/card-element";
import "./style.css";

defineCardElement();

async function main() {
  document.querySelector<HTMLButtonElement>("#new-card")!.addEventListener("click", () => {
    const newCard = document.createElement("card-element")! as CardElement;
    document.querySelector("#canvas")!.appendChild(newCard);
    newCard.focusHead();
  });

  document.querySelector<HTMLButtonElement>("#play")!.addEventListener("click", (e) => {
    // toggle between triangle and square
    const playButton = e.target as HTMLButtonElement;
    playButton.textContent = playButton.textContent === "▶" ? "■" : "▶";
  });

  document.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      document.querySelector<HTMLButtonElement>("#new-card")!.click();
    }

    const targetCard = (e.target as HTMLElement)?.closest("card-element") as CardElement;

    if (targetCard && e.key === "Enter" && !e.shiftKey && (e.ctrlKey || e.metaKey) && !e.altKey) {
      // summarize ui state
      const tree = [...document.querySelectorAll<CardElement>("card-element")].map((card) => card.innerData);

      const focusedData = tree.find((card) => card.id === targetCard.id);

      const prompt = `
User is working with the following sticky notes
${tree
  .map((card) =>
    `
- id: ${card.id}
  key: ${card.head.content}
  value: ${card.body.content}
  `.trim()
  )
  .join("\n")}

User is currently focused on card id: ${targetCard.id}
Please suggest ${focusedData?.head.isfocused ? "the key" : "the value"} of the card with id: ${targetCard.id}.
${focusedData?.head.isfocused ? "Key should be very short" : "Value must be concise so it can fit into a sticky"}

Respond in valid JSON format in this structure

type Response = {
  suggestion: string;
}
    `;

      const result = await openai.responses.create({
        model: "gpt-4o",
        input: prompt,
        text: {
          format: {
            type: "json_object",
          },
        },
      });

      console.log(result.output_text);
      let output = "Error";
      try {
        const { suggestion } = JSON.parse(result.output_text) as { suggestion: string };
        output = suggestion;
      } catch {}
      if (focusedData?.head.isfocused) {
        targetCard.head = output;
      } else {
        targetCard.body = output;
      }
    }
  });

  const openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: localStorage.getItem("knoll-ai:openai-api-key")!,
  });
}

main();
