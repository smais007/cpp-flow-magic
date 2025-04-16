/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */

import plantumlEncoder from "plantuml-encoder";
// For encoding PlantUML diagrams
function encodePlantUml(plantUmlCode: string): string {
  // PlantUML online server accepts simple Base64 encoding for basic diagrams
  // return btoa(unescape(encodeURIComponent(plantUmlCode)))
  //   .replace(/\+/g, "-")
  //   .replace(/\//g, "_")
  //   .replace(/=/g, "");
  return plantumlEncoder.encode(plantUmlCode);
}

interface FlowchartResult {
  plantUmlCode: string;
  imageUrl: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generateFlowchartWithOpenAI(
  cppCode: string,
  apiKey: string
): Promise<FlowchartResult> {
  try {
    // Create prompt for OpenAI
    const prompt = `
Convert the following C++ code into a PlantUML flowchart representation.
Return ONLY the PlantUML code without any explanations or markdown formatting.
The flowchart should accurately represent the control flow of the program.
Start your response with @startuml and end with @enduml.

Here is the C++ code to convert:

${cppCode}`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert programmer who converts C++ code to PlantUML flowcharts. Return ONLY the PlantUML code.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(
        errorData.error?.message || "Failed to generate flowchart with OpenAI"
      );
    }

    const data: OpenAIResponse = await response.json();

    // Extract PlantUML code from response
    const plantUmlCode = data.choices[0].message.content.trim();

    // Create PlantUML image URL using the public PlantUML server
    const encoded = plantumlEncoder.encode(plantUmlCode);
    const imageUrl = `https://www.plantuml.com/plantuml/png/${encoded}`;

    console.log("Generated PlantUML URL:", imageUrl);
    console.log("PlantUML code:", plantUmlCode);

    return {
      plantUmlCode,
      imageUrl,
    };
  } catch (error) {
    console.error("Error generating flowchart:", error);
    throw error;
  }
}

// Fallback to mock implementation if API key is missing or empty
export async function generateFlowchartMock(
  cppCode: string
): Promise<FlowchartResult> {
  // Mock OpenAI response
  const plantUmlCode = `@startuml
start
if (n > 0) then (yes)
  :Output "Positive number";
else if (n < 0) then (yes)
  :Output "Negative number";
else (no)
  :Output "Zero";
endif
stop
@enduml`;

  // Create PlantUML image URL using the public PlantUML server
  const encoded = plantumlEncoder.encode(plantUmlCode);
  // Use the standard PlantUML server format

  const imageUrl = `https://www.plantuml.com/plantuml/png/${encoded}`;

  console.log("Generated PlantUML URL:", imageUrl);

  return {
    plantUmlCode,
    imageUrl,
  };
}

// This would be a server-side handler in a real application
// For this demo, we'll expose this as a global function that our fetch call can use
if (typeof window !== "undefined") {
  (window as any).mockGenerateFlowchart = async (request: Request) => {
    const body = await request.json();

    try {
      // Check localStorage for API key
      const apiKey = localStorage.getItem("openai_api_key");

      let result;
      if (apiKey) {
        // Use OpenAI API if key is available
        result = await generateFlowchartWithOpenAI(body.code, apiKey);
      } else {
        // Fall back to mock if no API key
        result = await generateFlowchartMock(body.code);
      }

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error generating flowchart:", error);
      return new Response(
        JSON.stringify({
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  };

  // Mock fetch for local development
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    if (input === "/api/generate-flowchart" && init?.method === "POST") {
      console.log("Intercepting API call to /api/generate-flowchart");
      return (window as any).mockGenerateFlowchart(new Request(input, init));
    }
    return originalFetch.apply(this, arguments as any);
  };
}
