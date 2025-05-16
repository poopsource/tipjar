/**
 * Service for interacting with Puter.js API
 * This provides OCR and AI functionality without requiring API keys
 */

/**
 * Process an image using Puter.js AI vision capabilities to extract text
 * @param imageDataUrl Base64 encoded image data URL
 * @returns The extracted text from the image
 */
export const extractTextFromImage = async (imageDataUrl: string): Promise<string> => {
  // Ensure Puter.js is loaded
  if (typeof (window as any).puter === 'undefined') {
    throw new Error('Puter.js is not loaded. Please check your internet connection.');
  }

  try {
    // Use Puter.js vision capabilities to extract text from the image
    // We're asking the AI to specifically focus on extracting partner names and hours
    const prompt = `Extract all the partner names and hours from this schedule image. 
    Format the result as a clean list with each partner on a new line in the format: "Name: X hours"
    Only include partners and their hours, no other information.`;

    // Request text extraction from the image
    const response = await (window as any).puter.ai.vision(imageDataUrl, prompt);
    
    // Return the extracted text
    return response;
  } catch (error) {
    console.error('Error using Puter.js for OCR:', error);
    throw new Error('Failed to extract text from image. Please try manual entry instead.');
  }
};

/**
 * Alternative implementation using Puter.js chat for processing text extraction results
 * @param rawText Raw text extracted from an image
 * @returns Formatted and processed text
 */
export const processExtractedText = async (rawText: string): Promise<string> => {
  try {
    const prompt = `The following text was extracted from a work schedule. 
    Extract and format just the partner names and their hours in a clean, consistent format.
    Present each partner on a new line using the format "Name: X hours".
    
    Raw text:
    ${rawText}`;

    const response = await (window as any).puter.ai.chat(prompt);
    return response;
  } catch (error) {
    console.error('Error processing extracted text with Puter.js:', error);
    // Return original text if processing fails
    return rawText;
  }
};