/**
 * Moondream API integration for Netlify functions
 */

// Import libraries needed for Moondream API
import fetch from 'node-fetch';

/**
 * Analyzes an image using Moondream API
 * @param {string} imageBase64 - Base64 encoded image data
 * @returns {Promise<{text: string|null, error: string|null}>} - Extracted text or error
 */
export async function analyzeImage(imageBase64) {
  try {
    const apiKey = process.env.MOONDREAM_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlfaWQiOiIxOGViZDU0OC00NmQ5LTQwODUtOTUxYy0zZGQxZWJjNWI5ZDgiLCJvcmdfaWQiOiJXTVU2Q0NmQlJkclpDVXQyY1pobldFVnFHUXNhV1JBNSIsImlhdCI6MTc0OTIwNzAzNSwidmVyIjoxfQ.ZpzygljyiO0JiHsYjl5gAxnqpM3FbtlbuUKgKc88-9s";
    
    if (!apiKey) {
      console.error("No Moondream API key provided");
      return { text: null, error: "API key missing. Please configure the Moondream API key in environment variables." };
    }
    
    // Moondream API endpoint
    const endpoint = "https://api.moondream.ai/v1/query";
    
    // Construct the request body with the image and prompt
    const requestBody = {
      image: `data:image/jpeg;base64,${imageBase64}`,
      question: `
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
      `
    };
    
    // Make the API call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Parse the response
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Moondream API error:", responseData);
      return { 
        text: null, 
        error: responseData.error || "Error processing image with Moondream API"
      };
    }
    
    // Extract text from Moondream response
    const extractedText = responseData.answer;
    
    if (!extractedText) {
      return { text: null, error: "No text extracted from image" };
    }
    
    // Check if Moondream couldn't find data
    if (extractedText.includes("NO_DATA_FOUND")) {
      return { 
        text: null,
        error: "No partner hours data found in the image. Please try a different image or use manual entry."
      };
    }
    
    return { text: extractedText, error: null };
    
  } catch (error) {
    console.error("Moondream API error:", error);
    return { 
      text: null, 
      error: error.message || "Failed to process image with Moondream API"
    };
  }
}