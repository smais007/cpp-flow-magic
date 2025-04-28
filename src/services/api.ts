export interface FlowchartResponse {
  imageUrl: string;
  plantUmlCode: string;
}

export const generateFlowchart = async (
  cppCode: string
): Promise<FlowchartResponse> => {
  try {
    const response = await fetch("/api/generate-flowchart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ code: cppCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate flowchart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating flowchart:", error);
    throw error;
  }
};
