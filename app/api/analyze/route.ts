import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DISCUSSION_GUIDE_ANALYSIS_PROMPT, SYSTEM_PROMPT } from '@/lib/prompts';

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: DISCUSSION_GUIDE_ANALYSIS_PROMPT.replace('{discussionGuide}', discussionGuide)
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      functions: [
        {
          name: "analyze_discussion_guide",
          description: "Analyze a customer interview discussion guide and provide structured feedback",
          parameters: {
            type: "object",
            properties: {
              feedback: {
                type: "array",
                description: "List of specific feedback items",
                items: {
                  type: "object",
                  properties: {
                    start_index: {
                      type: "number",
                      description: "Character position where this feedback starts"
                    },
                    end_index: {
                      type: "number", 
                      description: "Character position where this feedback ends"
                    },
                    highlighted_text: {
                      type: "string", 
                      description: "String that we're attempting to highlight / flag"
                    },
                    type: {
                      type: "string",
                      enum: ["recommendation", "warning"],
                      description: "Type of feedback"
                    },
                    note: {
                      type: "string",
                      description: "Detailed explanation of the feedback"
                    },
                    confidence_level: {
                      type: "number",
                      minimum: 0,
                      maximum: 1,
                      description: "Confidence level between 0 and 1"
                    }
                  },
                  required: ["start_index", "end_index", "type", "note", "confidence_level"]
                }
              },
              summary: {
                type: "string",
                description: "Overall assessment of the discussion guide"
              }
            },
            required: ["feedback", "summary"]
          }
        }
      ],
      function_call: { name: "analyze_discussion_guide" }
    });

    const functionCall = completion.choices[0]?.message?.function_call;
    
    if (!functionCall || !functionCall.arguments) {
      throw new Error('No structured response from OpenAI');
    }

    // Parse the function call arguments
    let analysis: any;
    try {
      analysis = JSON.parse(functionCall.arguments);
    } catch (parseError) {
      console.error('Failed to parse function call arguments:', functionCall.arguments);
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