// Gemini API implementation
import fetch from 'node-fetch';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text?: string;
      }[];
    };
  }[];
}

/**
 * Analyze an image using Google Gemini API to extract text
 * @param imageBase64 The base64-encoded image data
 * @returns Extracted text from the image
 */
export async function analyzeImage(imageBase64: string): Promise<string | null> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    
    if (!apiKey) {
      console.error("No Gemini API key provided");
      return null;
    }
    
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    
    const promptText = `
      Extract all partner names and their work hours from this schedule image. 
      Look for patterns like "Name: X hours" or similar formats.
      Return each partner's name followed by their hours, one per line.
      Example output format:
      John Smith: 32
      Maria Garcia: 24
    `;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
      }
    };
    
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return null;
    }
    
    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates in Gemini response");
      return null;
    }
    
    const extractedText = data.candidates[0].content.parts
      .map(part => part.text)
      .filter(Boolean)
      .join("\n");
    
    return extractedText || null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}
