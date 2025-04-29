/**
 * Formats a string of partners and hours from the OCR result into a clean format
 * @param text The raw OCR text
 * @returns Formatted text with each partner on a new line
 */
export function formatOCRResult(text: string): string {
  // First, clean up any weird spacing
  let cleaned = text.replace(/\s+/g, ' ').trim();
  
  // Try to identify name and hour patterns
  const partnerPattern = /([A-Za-z\s]+)[\s\-:]+(\d+(?:\.\d+)?)\s*(?:hours|hrs?|h)/gi;
  
  let matches;
  let formattedText = '';
  
  // Handle matched patterns
  while ((matches = partnerPattern.exec(cleaned)) !== null) {
    const name = matches[1].trim();
    const hours = matches[2].trim();
    formattedText += `${name}: ${hours}\n`;
  }
  
  return formattedText.trim();
}

/**
 * Attempts to extract partner names and hours from the OCR text
 * @param text The OCR text to parse
 * @returns Array of {name, hours} objects
 */
export function extractPartnerHours(text: string): Array<{name: string, hours: number}> {
  const result: Array<{name: string, hours: number}> = [];
  
  // Clean up text
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  
  // Different patterns that might appear in schedule images
  const patterns = [
    // Pattern: Name: 32 hours
    /([A-Za-z\s]+)[\s\-:]+(\d+(?:\.\d+)?)\s*(?:hours|hrs?|h)/gi,
    // Pattern: Name (32 hours)
    /([A-Za-z\s]+)\s*\((\d+(?:\.\d+)?)\s*(?:hours|hrs?|h)\)/gi,
    // Pattern: Name - 32 hours
    /([A-Za-z\s]+)\s*-\s*(\d+(?:\.\d+)?)\s*(?:hours|hrs?|h)/gi,
    // Pattern: Name 32h 
    /([A-Za-z\s]+)\s+(\d+(?:\.\d+)?)\s*h(?:\b|ours|rs)/gi,
    // Last resort - lines with name and a number
    /([A-Za-z\s]+)[\s\-:]*(\d+(?:\.\d+)?)/gi
  ];
  
  // Try each pattern until we get some results
  for (const pattern of patterns) {
    let matches;
    const tempResults: Array<{name: string, hours: number}> = [];
    
    // Reset regex state
    pattern.lastIndex = 0;
    
    while ((matches = pattern.exec(cleanedText)) !== null) {
      const name = matches[1].trim();
      const hours = parseFloat(matches[2]);
      
      if (name && !isNaN(hours)) {
        tempResults.push({ name, hours });
      }
    }
    
    // If we found any valid matches, use this pattern
    if (tempResults.length > 0) {
      return tempResults;
    }
  }
  
  return result;
}
