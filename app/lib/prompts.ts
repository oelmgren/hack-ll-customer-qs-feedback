export const DISCUSSION_GUIDE_ANALYSIS_PROMPT = `Analyze the following customer interview discussion guide and provide feedback in JSON format.

Discussion Guide:
{discussionGuide}

Focus on:
1. Question quality and clarity
2. Potential bias or leading questions
3. Logical flow and sequencing
4. Best practices for customer research
5. Areas for improvement

Return your analysis as JSON.`;

export const SYSTEM_PROMPT = "You are an expert in customer research and user interview methodology. Provide specific, actionable feedback on discussion guides."; 