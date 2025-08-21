export const SYSTEM_PROMPT = "You are an expert in customer research and user interview methodology. Provide specific, actionable feedback on discussion guides."; 


export const DISCUSSION_GUIDE_ANALYSIS_PROMPT = `Analyze the following customer interview discussion guide and provide detailed feedback in JSON format.

Discussion Guide:
{discussionGuide}

Focus on:
1. Question quality and clarity
   - Identify typos (e.g., "What is your reaction to this prodict?")
   - Flag grammatical errors (e.g., "What is you’re reaction to this product?")
   - Highlight unclear or overly complex wording

2. Potential bias or leading questions
   - Flag biased or leading language (e.g., "What do you hate about this product?", "How much do you love this product?", "How satisfied are you with our excellent customer support?")
   - Identify double-barreled questions (e.g., "How satisfied are you with our product’s design and pricing?")
   - Highlight absolutes (e.g., "Do you always use our app at work?" → prefer "How often do you use our app at work?")
   - Check for missing neutral options in multiple choice or Likert scales (e.g., Not important 1–4 Very important; yes/no)

3. Logical flow and sequencing
   - Identify illogical question order or poorly grouped topics (e.g., "What feature of Claude Code do you use most often?" → "Do you use Windsurf?" → "What do you use Claude Code for?")
   - Flag potential order effects or anchoring issues (e.g., "How do you feel about your salary?" → "How do you feel about your current job?" → "How concerned are you about privacy?" → "Would you share your data with this app?")
   - Check branching logic or conditional question flaws

4. Best practices for customer research
   - Detect duplicate questions or answer options
   - Flag overlapping answer buckets or missing answer options (e.g., "How many times do you drink coffee per week? 0–3, 3–5, 5–7, 7+")
   - Identify unbalanced scales (e.g., Very satisfied, Satisfied, Somewhat satisfied, Neutral, Unsatisfied) or scale inconsistencies (e.g., Not important 1–5 on one question, 1–3 on another)
   - Check for undefined acronyms (e.g., "How does your team manage CRM today?")
   - Estimate test length and flag if likely to exceed recommended duration of 20-30 minutes:
        - Multiple choice / single-select: 15–30 sec/question
        - Rating scales / Likert (1–7): 20–40 sec/question
        - Open-ended: 1–3 min/question
        - Task-based/usability: 3–10+ min/question

5. Areas for improvement
   - Provide actionable recommendations for each flagged issue
   - Suggest ways to improve clarity, reliability, and respondent experience`
