
// This is a client-side mock implementation that would normally be a server endpoint
// In a real application, this would be implemented on the server side

// For encoding PlantUML diagrams
function encodePlantUml(plantUmlCode: string): string {
  // Use a proper encoding method - this is a more reliable approach than simple btoa
  // PlantUML expects a deflate compression followed by base64 encoding
  // Since we're limited in browser environment without zlib, we'll use a simplified approach
  // that works for basic diagrams
  
  // For production, you would use a proper deflate+base64 encoding
  // This is a simplified version that works for basic PlantUML diagrams
  return btoa(unescape(encodeURIComponent(plantUmlCode)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
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
  
  // Create PlantUML image URL with the proper prefix for HUFFMAN encoding
  const encoded = encodePlantUml(plantUmlCode);
  // Add the ~h prefix for proper deflate compression format that PlantUML expects
  const imageUrl = `https://www.plantuml.com/plantuml/png/~h${encoded}`;
  
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
