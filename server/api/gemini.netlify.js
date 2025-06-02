/**
 * Gemini API integration for Netlify functions
 */

// Import libraries needed for Gemini API
import fetch from 'node-fetch';

/**
 * Analyzes an image using Google's Gemini API
 * @param {string} imageBase64 - Base64 encoded image data
 * @returns {Promise<{text: string|null, error: string|null}>} - Extracted text or error
 */
export async function analyzeImage(imageBase64) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("No Gemini API key provided");
      return { text: null, error: "API key missing. Please configure the Gemini API key in environment variables." };
    }
    
    // Google Gemini API endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;
    
    // Construct the request body with the image and prompt
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Extract and format all text from this image. Focus on any tabular data listing names and hours. Format as plain text."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ]
    };
    
    // Make the API call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Parse the response
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", responseData);
      return { 
        text: null, 
        error: responseData.error?.message || "Error processing image with Gemini API"
      };
    }
    
    // Extract text from Gemini response
    const extractedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!extractedText) {
      return { text: null, error: "No text extracted from image" };
    }
    
    return { text: extractedText, error: null };
    
  } catch (error) {
    console.error("Gemini API error:", error);
    return { 
      text: null, 
      error: error.message || "Failed to process image with Gemini API"
    };
  }
} 