import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiRecyclingService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('Unable to access service.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }

  async getRecyclingGuidance(itemDescription) {
    try {
      const prompt = this.createRecyclingPrompt(itemDescription);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseResponse(text);
    } catch (error) {
      console.error('Error getting recycling guidance:', error);
      return this.getErrorResponse(error);
    }
  }

  createRecyclingPrompt(itemDescription) {
    return `You are an expert recycling advisor with extensive knowledge of materials, recycling processes, and waste management. Analyze the following detailed item information and provide comprehensive recycling guidance.

ITEM DETAILS:
${itemDescription}

Based on this detailed information, please provide a response in the following JSON format:
{
  "analysis": {
    "item": "specific item name based on description",
    "material": "primary material type (be specific)",
    "recyclability": "Yes/No/Special handling required",
    "recyclingCode": "if applicable (e.g., #1-7 for plastics)",
  },
  "instructions": {
    "method": "Curbside/Drop-off/Special program/Retailer take-back/Not recyclable",
    "preparation": [
      "detailed step-by-step preparation instructions based on condition and materials",
      "each string is a separate step"
    ],
    "location": "specific guidance on where to take it",
    "timing": "any timing considerations if applicable (e.g., collection days, seasonal programs)"
  },
  "warnings": [
    "important safety warnings",
    "contamination concerns",
    "what NOT to do"
  ],
  "environmentalImpact": "detailed explanation of why proper disposal matters and environmental benefits",
  "alternatives": {
    "reuse": ["creative reuse suggestions based on condition and materials."],
    "donation": "donation options if item is functional, including specific organizations.",
    "upcycling": ["specific DIY project ideas based on materials."],
    "repair": "repair options if item is broken but fixable."
  },
  "tips": [
    "material-specific recycling tips",
    "how to identify similar items in the future",
    "prevention/reduction suggestions"
  ],
  "relatedItems": [
    "similar items that follow the same disposal process"
  ]
}

ANALYSIS GUIDELINES:
- Use the detailed material information to provide precise recycling guidance
- Consider the item's condition when recommending disposal methods
- If multiple materials are present, address each one specifically
- Factor in size and quantity for practical disposal advice
- Address any special features or concerns mentioned
- Provide location-specific guidance when possible
- Be extremely specific about preparation steps
- Include safety warnings for any hazardous materials
- Prioritize environmental impact and proper disposal
- Consider the full lifecycle of the item

IMPORTANT NOTES:
- If the item contains mixed materials, provide guidance for each component
- If recycling codes are mentioned, use them to provide specific plastic recycling guidance
- Consider contamination issues based on the item's condition
- Provide alternatives when recycling isn't the best option
- Be educational about why certain disposal methods are recommended

Respond ONLY with valid JSON, no additional text nor formatting (example: do not include Markdown bolding).`;
  }

  parseResponse(responseText) {
    try {
      // Clean the response text to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }    
      return this.parseTextResponse(responseText);
    } catch (error) {
      console.error('Error parsing response:', error);
      return this.getErrorResponse(error);
    }
  }

  parseTextResponse(text) {
    // Todo make response out of text
    return {
      analysis: {
        item: "Error analyzing item2: " + text,
        material: "Unknown",
        recyclability: "Unable to determine"
      },
      instructions: {
        method: "Please try again or consult local guidelines",
        preparation: ["Unable to provide guidance"],
        location: "Contact local waste management"
      },
      warnings: ["Service temporarily unavailable"],
      environmentalImpact: "Proper disposal is important for environmental protection",
      alternatives: {
        reuse: ["Consider if item can be repaired or repurposed"],
        donation: "Check if item is still useful to others",
        upcycling: ["Look for creative reuse ideas online"]
      },
      tips: ["Always follow local recycling guidelines", "When in doubt, don't recycle"]
    };
  }

  getErrorResponse(error) {
    return {
      analysis: {
        item: `Error analyzing item: ${error?.message || String(error)}`,
        material: "Unknown",
        recyclability: "Unable to determine"
      },
      instructions: {
        method: "Please try again or consult local guidelines",
        preparation: ["Unable to provide guidance"],
        location: "Contact local waste management"
      },
      warnings: ["Service temporarily unavailable"],
      environmentalImpact: "Proper disposal is important for environmental protection",
      alternatives: {
        reuse: ["Consider if item can be repaired or repurposed"],
        donation: "Check if item is still useful to others",
        upcycling: ["Look for creative reuse ideas online"]
      },
      tips: ["Always follow local recycling guidelines", "When in doubt, don't recycle"],
    };
  }

}

export default GeminiRecyclingService;
