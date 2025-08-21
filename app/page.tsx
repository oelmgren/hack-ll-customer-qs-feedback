'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { MessageSquare, Users, Target, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface FeedbackItem {
  start_index: number;
  end_index: number;
  type: 'recommendation' | 'warning';
  note: string;
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
      // Create mock feedback items based on the input text
      const createMockFeedbackItems = (text: string): FeedbackItem[] => {
        const items: FeedbackItem[] = [];
        
        // Find question patterns (numbered questions or questions ending with ?)
        const questionRegex = /\d+\.\s+([^\n]+\?)|([^\n]+\?)/g;
        let match;
        
        while ((match = questionRegex.exec(text)) !== null) {
          const questionText = match[1] || match[0];
          const startIndex = match.index;
          const endIndex = startIndex + questionText.length;
          
          // Randomly decide if it's a recommendation or warning
          const type = Math.random() > 0.5 ? 'recommendation' : 'warning';
          
          items.push({
            start_index: startIndex,
            end_index: endIndex,
            type,
            note: type === 'recommendation' 
              ? `This is a well-structured question that encourages detailed responses.` 
              : `Consider rephrasing this as an open-ended question to get more detailed responses.`,
            confidence_level: 0.7 + Math.random() * 0.3 // Random between 0.7 and 1.0
          });
        }
        
        // If no questions found, create a generic feedback item
        if (items.length === 0 && text.length > 10) {
          const randomStart = Math.floor(Math.random() * (text.length / 2));
          const randomLength = Math.min(30, Math.floor(Math.random() * 50));
          const randomEnd = Math.min(text.length, randomStart + randomLength);
          
          items.push({
            start_index: randomStart,
            end_index: randomEnd,
            type: 'recommendation',
            note: 'Consider adding more specific questions to get better insights.',
            confidence_level: 0.85
          });
        }
        
        return items;
      };
      
      // Create mock analysis with feedback items
      const mockAnalysis: AnalysisResponse = {
        feedback: createMockFeedbackItems(discussionGuide),
        summary: 'Analysis of your discussion guide'
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysis(mockAnalysis);
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Listen Labs</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 sm:py-24">
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
      <section className="py-12">
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
                                  let lastIndex = 0;
                                  const textParts = [];
                                  
                                  // Sort feedback items by start_index
                                  const sortedFeedback = [...analysis.feedback].sort(
                                    (a, b) => a.start_index - b.start_index
                                  );
                                  
                                  sortedFeedback.forEach((item, index) => {
                                    // Add text before the highlight
                                    if (item.start_index > lastIndex) {
                                      textParts.push(
                                        <span key={`text-${index}`}>
                                          {discussionGuide.substring(lastIndex, item.start_index)}
                                        </span>
                                      );
                                    }
                                    
                                    // Add highlighted text
                                    textParts.push(
                                      <span 
                                        key={`highlight-${index}`}
                                        className={`cursor-pointer px-0.5 rounded ${item.type === 'warning' ? 'bg-yellow-200' : 'bg-blue-200'}`}
                                        onMouseEnter={(e) => {
                                          setHoverHighlight({
                                            item,
                                            x: e.clientX,
                                            y: e.clientY
                                          });
                                        }}
                                        onMouseLeave={() => setHoverHighlight(null)}
                                      >
                                        {discussionGuide.substring(item.start_index, item.end_index)}
                                      </span>
                                    );
                                    
                                    lastIndex = item.end_index;
                                  });
                                  
                                  // Add any remaining text after the last highlight
                                  if (lastIndex < discussionGuide.length) {
                                    textParts.push(
                                      <span key="text-end">
                                        {discussionGuide.substring(lastIndex)}
                                      </span>
                                    );
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <span>Listen Labs</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 