// This is a client-side mock implementation that would normally be a server endpoint
// In a real application, this would be implemented on the server side

// For encoding PlantUML diagrams
function encodePlantUml(plantUmlCode) {
  // This is a simplified encoder - in production, use proper encoding
  return btoa(plantUmlCode).replace(/\+/g, "-").replace(/\//g, "_");
}

export async function generateFlowchartMock(cppCode) {
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

  // Create PlantUML image URL
  const encoded = encodePlantUml(plantUmlCode);
  const imageUrl = `//www.plantuml.com/plantuml/png/${encoded}`;

  return {
    plantUmlCode,
    imageUrl,
  };
}

// This would be a server-side handler in a real application
// For this demo, we'll expose this as a global function that our fetch call can use
if (typeof window !== "undefined") {
  window.mockGenerateFlowchart = async (request) => {
    const body = await request.json();
    const result = await generateFlowchartMock(body.code);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  };

  // Mock fetch for local development
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    if (input === "/api/generate-flowchart" && init?.method === "POST") {
      console.log("Intercepting API call to /api/generate-flowchart");
      return window.mockGenerateFlowchart(new Request(input, init));
    }
    return originalFetch.apply(this, arguments);
  };
}
