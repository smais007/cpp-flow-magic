
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'No code provided' });
    }

    // Step 1: Get PlantUML code from OpenAI
    const plantUmlCode = await generatePlantUmlFromCode(code);
    
    // Step 2: Generate image URL from PlantUML
    const imageUrl = await getPlantUmlImageUrl(plantUmlCode);

    return res.status(200).json({
      imageUrl,
      plantUmlCode,
    });
  } catch (error) {
    console.error('Error generating flowchart:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to generate flowchart',
    });
  }
}

async function generatePlantUmlFromCode(cppCode: string): Promise<string> {
  // For now, we'll just mock this response 
  // In a real implementation, you would call OpenAI API here
  const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
  
  const prompt = `
Convert the following C++ code into PlantUML flowchart syntax. 
Only output the PlantUML code with @startuml and @enduml tags.
Make sure to include proper flow control, decision points, and loops in the diagram.

C++ code:
${cppCode}
`;

  const openaiResponse = await fetch(openaiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert programmer that converts C++ code to PlantUML flowcharts. You only respond with valid PlantUML code that visualizes the given code logic.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!openaiResponse.ok) {
    const errorData = await openaiResponse.json();
    throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await openaiResponse.json();
  const plantUmlCode = data.choices[0].message.content.trim();
  
  // Extract the PlantUML code between @startuml and @enduml tags
  const umlPattern = /@startuml([\s\S]*?)@enduml/;
  const match = umlPattern.exec(plantUmlCode);
  
  if (!match) {
    throw new Error('Failed to extract PlantUML code from AI response');
  }
  
  return `@startuml${match[1]}@enduml`;
}

async function getPlantUmlImageUrl(plantUmlCode: string): Promise<string> {
  // PlantUML server expects a compressed and encoded version of the UML code
  const encoded = encodePlantUml(plantUmlCode);
  
  // Use the public PlantUML server
  return `https://www.plantuml.com/plantuml/png/${encoded}`;
}

// This function handles the special encoding required by PlantUML server
function encodePlantUml(plantUmlCode: string): string {
  // In a real implementation, you'd use a proper PlantUML encoder
  // For now, we'll just mock this with a simplified version
  // This is a placeholder - in production you should use proper encoding
  const encoder = new TextEncoder();
  const bytes = encoder.encode(plantUmlCode);
  return Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}
