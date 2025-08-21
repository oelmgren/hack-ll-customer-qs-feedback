# Listen Labs - Customer Interview Feedback

A Next.js application that helps product teams perfect their customer interview questions by providing AI-powered feedback on discussion guides.

## Features

- **Question Quality Analysis**: Get insights on whether your questions will elicit meaningful responses
- **Bias Detection**: Identify leading questions and potential interviewer bias in your guide
- **Flow Optimization**: Improve the logical flow and sequence of your interview questions
- **Best Practices**: Receive suggestions based on proven customer research methodologies

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **UI Components**: Custom component library built with Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hack-ll-customer-qs-feedback
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── public/              # Static assets
├── package.json
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Usage

1. Navigate to the main page
2. Paste your discussion guide questions in the text area
3. Click "Get Feedback" to receive AI-powered analysis
4. Review the feedback and suggestions to improve your questions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
