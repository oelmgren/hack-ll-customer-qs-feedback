'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Logo } from './components/ui/logo';
import { MessageSquare, Users, Target, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface FeedbackItem {
  start_index: number;
  end_index: number;
  type: 'recommendation' | 'warning';
  note: string;
  highlighted_text: string;
  confidence_level: number;
}

interface AnalysisResponse {
  feedback: FeedbackItem[];
  summary: string;
}

export default function HomePage() {
  const [discussionGuide, setDiscussionGuide] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputFolded, setInputFolded] = useState(false);
  const [hoverHighlight, setHoverHighlight] = useState<{item: FeedbackItem, x: number, y: number} | null>(null);

  const handleGetFeedback = async () => {
    if (!discussionGuide.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setHoverHighlight(null);
    
    try {
      // Call the API route to analyze the discussion guide
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discussionGuide }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze discussion guide');
      }

      const data: AnalysisResponse = await response.json();

      console.log("API Output", data);

      setAnalysis(data);
      
      setInputFolded(true); // Fold the input after getting feedback
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: "Question Quality Analysis",
      description: "Get insights on whether your questions will elicit meaningful responses"
    },
    {
      icon: Users,
      title: "Bias Detection",
      description: "Identify leading questions and potential interviewer bias in your guide"
    },
    {
      icon: MessageSquare,
      title: "Flow Optimization",
      description: "Improve the logical flow and sequence of your interview questions"
    },
    {
      icon: Lightbulb,
      title: "Best Practices",
      description: "Receive suggestions based on proven customer research methodologies"
    }
  ];

  const sampleQuestions = [
    "Tell me about the last time you tried to solve [problem]",
    "What's the most frustrating part of your current process?",
    "How do you currently handle [specific situation]?",
    "What would an ideal solution look like to you?"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="https://listenlabs.ai" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Logo size="md" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            Perfect Your Customer <span className="text-primary">Interview Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant feedback on your discussion guides. Ensure every customer conversation delivers valuable insights.
          </p>
        </div>
      </section>

      {/* Main Interaction Area */}
      <section className="">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Discussion Guide Analyzer
              </CardTitle>
              <CardDescription>
                Paste your interview questions below and get AI-powered feedback to improve your customer research
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!inputFolded ? (
                // Input mode - show textarea for entering discussion guide
                <>
                  <div>
                    <label htmlFor="discussion-guide" className="block mb-2">
                      Your Discussion Guide
                    </label>
                    <Textarea
                      id="discussion-guide"
                      placeholder="Paste your interview questions here... 

Example:
1. Tell me about the last time you tried to solve [problem]
2. What's the most frustrating part of your current process?
3. How do you currently handle [specific situation]?
4. What would an ideal solution look like to you?"
                      value={discussionGuide}
                      onChange={(e) => setDiscussionGuide(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {discussionGuide.length} characters
                    </span>
                    <Button 
                      onClick={handleGetFeedback}
                      disabled={!discussionGuide.trim() || isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Get Feedback
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                // Feedback mode - show folded input and feedback
                <>
                  <div className="space-y-6">
                    {/* Folded input section */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium">Your Discussion Guide</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setInputFolded(false)}
                        >
                          Edit Questions
                        </Button>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{discussionGuide}</p>
                      </div>
                    </div>
                    
                    {/* Feedback section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Feedback</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm whitespace-pre-wrap">
                            {analysis && analysis.feedback.length > 0 ? (
                              // Render text with highlights
                              <>
                                {(() => {
                                  // Group feedback items by highlighted_text to handle multiple feedbacks for the same text
                                  const feedbackByText = new Map<string, FeedbackItem[]>();
                                  
                                  // Group feedback items by their highlighted text
                                  analysis.feedback.forEach(item => {
                                    if (!item.highlighted_text) return;
                                    
                                    if (!feedbackByText.has(item.highlighted_text)) {
                                      feedbackByText.set(item.highlighted_text, []);
                                    }
                                    
                                    feedbackByText.get(item.highlighted_text)!.push(item);
                                  });
                                  
                                  // For each group, keep only the item with highest confidence
                                  const processedFeedback: FeedbackItem[] = [];
                                  
                                  feedbackByText.forEach((items, text) => {
                                    // Sort by confidence level (descending)
                                    const sortedItems = [...items].sort(
                                      (a, b) => b.confidence_level - a.confidence_level
                                    );
                                    
                                    // Add the highest confidence item
                                    processedFeedback.push(sortedItems[0]);
                                  });
                                  
                                  // Now we need to find all occurrences of each highlighted_text in the discussion guide
                                  const textParts: JSX.Element[] = [];
                                  let remainingText = discussionGuide;
                                  let currentIndex = 0;
                                  
                                  // Process the text sequentially
                                  while (remainingText.length > 0) {
                                    // Find the earliest match among all highlighted texts
                                    let earliestMatch: {
                                      text: string;
                                      index: number;
                                      item: FeedbackItem;
                                    } | null = null;
                                    
                                    for (const item of processedFeedback) {
                                      const text = item.highlighted_text;
                                      const index = remainingText.indexOf(text);
                                      
                                      if (index !== -1 && (earliestMatch === null || index < earliestMatch.index)) {
                                        earliestMatch = { text, index, item };
                                      }
                                    }
                                    
                                    if (earliestMatch) {
                                      // Add text before the match
                                      if (earliestMatch.index > 0) {
                                        textParts.push(
                                          <span key={`text-${currentIndex}`}>
                                            {remainingText.substring(0, earliestMatch.index)}
                                          </span>
                                        );
                                      }
                                      
                                      // Add the highlighted text
                                      const item = earliestMatch.item;
                                      textParts.push(
                                        <span 
                                          key={`highlight-${currentIndex}`}
                                          className={`cursor-pointer px-0.5 rounded transition-colors duration-150 ${item.type === 'warning' 
                                            ? hoverHighlight?.item === item 
                                              ? 'bg-red-300' 
                                              : 'bg-red-200 hover:bg-red-300' 
                                            : hoverHighlight?.item === item 
                                              ? 'bg-blue-300' 
                                              : 'bg-blue-200 hover:bg-blue-300'}`}
                                          onMouseEnter={(e) => {
                                            setHoverHighlight({
                                              item,
                                              x: e.clientX,
                                              y: e.clientY
                                            });
                                          }}
                                          onMouseLeave={() => setHoverHighlight(null)}
                                        >
                                          {earliestMatch.text}
                                        </span>
                                      );
                                      
                                      // Update remaining text and index
                                      remainingText = remainingText.substring(earliestMatch.index + earliestMatch.text.length);
                                      currentIndex++;
                                    } else {
                                      // No more matches, add the remaining text
                                      textParts.push(
                                        <span key={`text-end-${currentIndex}`}>
                                          {remainingText}
                                        </span>
                                      );
                                      break;
                                    }
                                  }
                                  
                                  return textParts;
                                })()} 
                              </>
                            ) : (
                              // Render plain text if no feedback items
                              <p>{discussionGuide}</p>
                            )}
                          </div>
                          
                          {/* Tooltip for hover highlight */}
                          {hoverHighlight && createPortal(
                            <div 
                              className="fixed z-50 p-3 rounded-md shadow-lg border bg-white max-w-xs"
                              style={{
                                left: `${hoverHighlight.x}px`,
                                top: `${hoverHighlight.y - 10}px`,
                                transform: 'translate(-50%, -100%)'
                              }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <Badge 
                                  variant={hoverHighlight.item.type === 'warning' ? 'destructive' : 'secondary'}
                                  className="mb-2"
                                >
                                  {hoverHighlight.item.type === 'warning' ? 'Warning' : 'Recommendation'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Confidence: {Math.round(hoverHighlight.item.confidence_level * 100)}%
                                </span>
                              </div>
                              <p className="text-sm">{hoverHighlight.item.note}</p>
                            </div>,
                            document.body
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">What You'll Get</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive analysis to make every customer conversation count
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Ready to improve your customer research?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of product teams using Listen Labs to conduct better customer interviews
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <a href="https://listenlabs.ai" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 