/**
 * Moondream API integration for OCR and vision processing
 */

interface MoondreamResponse {
  answer?: string;
  error?: string;
}

/**
 * Analyzes an image using Moondream API to extract partner hours data
 * @param imageBase64 The base64-encoded image data
 * @returns An object with extracted text or error details
 */
export async function analyzeImageWithMoondream(imageBase64: string): Promise<{text: string | null; error?: string}> {
  try {
    const apiKey = process.env.MOONDREAM_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlfaWQiOiIxOGViZDU0OC00NmQ5LTQwODUtOTUxYy0zZGQxZWJjNWI5ZDgiLCJvcmdfaWQiOiJXTVU2Q0NmQlJkclpDVXQyY1pobldFVnFHUXNhV1JBNSIsImlhdCI6MTc0OTIwNzAzNSwidmVyIjoxfQ.ZpzygljyiO0JiHsYjl5gAxnqpM3FbtlbuUKgKc88-9s";
    
    if (!apiKey) {
      console.error("No Moondream API key provided");
      return { 
        text: null,
        error: "API key missing. Please configure the Moondream API key." 
      };
    }
    
    // Moondream API endpoint
    const apiUrl = "https://api.moondream.ai/v1/query";
    
    // Construct the prompt for extracting partner hours data
    const promptText = `
      Analyze this image and extract ALL partner names and their corresponding hours worked.
      
      Look for any text that shows:
      - Employee/partner names followed by hours
      - Time entries, schedules, or work logs
      - Any numeric values that could represent hours worked
      
      Return the data in this exact format, one partner per line:
      Name: Hours
      
      For example:
      John Smith: 32.5
      Maria Garcia: 24
      Alex Johnson: 18.75
      
      Extract ALL partners you can find in the image. If hours are decimal, include the decimal.
      If you cannot find clear partner hour data, return "NO_DATA_FOUND".
    `;
    
    const requestBody = {
      image: `data:image/jpeg;base64,${imageBase64}`,
      question: promptText
    };
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to call Moondream API";
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If error parsing fails, use the generic message
      }
      
      console.error("Moondream API error:", response.status, errorText);
      return { 
        text: null, 
        error: `API Error (${response.status}): ${errorMessage}`
      };
    }
    
    const data = await response.json() as MoondreamResponse;
    
    if (!data.answer) {
      console.error("No answer in Moondream response");
      return { 
        text: null,
        error: "No text extracted from the image. Try a clearer image or manual entry."
      };
    }
    
    // Check if Moondream couldn't find data
    if (data.answer.includes("NO_DATA_FOUND")) {
      return { 
        text: null,
        error: "No partner hours data found in the image. Please try a different image or use manual entry."
      };
    }
    
    return { text: data.answer };
  } catch (error) {
    console.error("Error calling Moondream API:", error);
    return { 
      text: null,
      error: "An unexpected error occurred while processing the image."
    };
  }
}