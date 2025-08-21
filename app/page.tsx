'use client';

import React, { useState } from 'react';
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

  const handleGetFeedback = async () => {
    if (!discussionGuide.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
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
      setAnalysis(data);
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
            <Badge variant="secondary">Beta</Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            Perfect Your Customer <span className="text-primary">Interview Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
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
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Analysis Results */}
      {error && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-destructive">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm">{error}</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {analysis && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  {analysis.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.feedback.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        item.type === 'warning' 
                          ? 'border-yellow-200 bg-yellow-50' 
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          variant={item.type === 'warning' ? 'destructive' : 'secondary'}
                          className="mb-2"
                        >
                          {item.type === 'warning' ? 'Warning' : 'Recommendation'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Confidence: {Math.round(item.confidence_level * 100)}%
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>Text:</strong> "{discussionGuide.slice(item.start_index, item.end_index)}"
                      </p>
                      <p className="text-sm">{item.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Sample Questions */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl mb-6 text-center">Need inspiration? Try these proven question patterns:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleQuestions.map((question, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setDiscussionGuide(prev => prev + (prev ? '\n' : '') + `${index + 1}. ${question}`)}>
                <CardContent className="p-4">
                  <p className="text-sm">{question}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
          <div className="flex items-center justify-center gap-4">
            <CheckCircle className="w-5 h-5" />
            <span>Free to try</span>
            <CheckCircle className="w-5 h-5" />
            <span>No credit card required</span>
            <CheckCircle className="w-5 h-5" />
            <span>Instant feedback</span>
          </div>
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