
// This is a client-side mock implementation that would normally be a server endpoint
// In a real application, this would be implemented on the server side

// For encoding PlantUML diagrams
function encodePlantUml(plantUmlCode: string): string {
  // PlantUML online server accepts simple Base64 encoding for basic diagrams
  // This is the most reliable approach for browser environments
  return btoa(unescape(encodeURIComponent(plantUmlCode)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

interface FlowchartResult {
  plantUmlCode: string;
  imageUrl: string;
}

export async function generateFlowchartMock(cppCode: string): Promise<FlowchartResult> {
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
  const encoded = encodePlantUml(plantUmlCode);
  // Use the standard PlantUML server format
  const imageUrl = `https://www.plantuml.com/plantuml/png/${encoded}`;
  
  console.log('Generated PlantUML URL:', imageUrl);
  
  return {
    plantUmlCode,
    imageUrl
  };
}

// This would be a server-side handler in a real application
// For this demo, we'll expose this as a global function that our fetch call can use
if (typeof window !== 'undefined') {
  (window as any).mockGenerateFlowchart = async (request: Request) => {
    const body = await request.json();
    const result = await generateFlowchartMock(body.code);
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  };
  
  // Mock fetch for local development
  const originalFetch = window.fetch;
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    if (input === '/api/generate-flowchart' && init?.method === 'POST') {
      console.log('Intercepting API call to /api/generate-flowchart');
      return (window as any).mockGenerateFlowchart(new Request(input, init));
    }
    return originalFetch.apply(this, arguments as any);
  };
}
