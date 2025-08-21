import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the feedback item schema
interface FeedbackItem {
  start_index: number;
  end_index: number;
  type: 'recommendation' | 'warning';
  note: string;
  confidence_level: number; // 0-1 scale
}

interface AnalysisResponse {
  feedback: FeedbackItem[];
  summary: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { discussionGuide } = await request.json();

    if (!discussionGuide || typeof discussionGuide !== 'string') {
      return NextResponse.json(
        { error: 'Discussion guide text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Analyze the following customer interview discussion guide and provide feedback. 

Discussion Guide:
${discussionGuide}

Please analyze this discussion guide and provide specific feedback in the following JSON format:

{
  "feedback": [
    {
      "start_index": <character position where this feedback starts>,
      "end_index": <character position where this feedback ends>,
      "type": "recommendation" or "warning",
      "note": "Detailed explanation of the feedback",
      "confidence_level": <number between 0 and 1 indicating confidence>
    }
  ],
  "summary": "Overall assessment of the discussion guide"
}

Focus on:
1. Question quality and clarity
2. Potential bias or leading questions
3. Logical flow and sequencing
4. Best practices for customer research
5. Areas for improvement

Return only valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in customer research and user interview methodology. Provide specific, actionable feedback on discussion guides."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let analysis: AnalysisResponse;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!analysis.feedback || !Array.isArray(analysis.feedback)) {
      return NextResponse.json(
        { error: 'Invalid response structure from AI service' },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing discussion guide:', error);
    return NextResponse.json(
      { error: 'Failed to analyze discussion guide' },
      { status: 500 }
    );
  }
} 