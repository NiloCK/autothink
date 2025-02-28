# AutoThink - Intelligent Complexity-Based Thinking for Claude

[![Visit the AutoThink demo](https://img.shields.io/badge/Demo-Visit_AutoThink-7c3aed)](http://nilock.github.io/autothink)

An automatic thinking system for Claude that intelligently adjusts thinking depth based on question complexity.

## Overview

AutoThink is a proof-of-concept that demonstrates how AI assistants can automatically determine when to use extended thinking capabilities based on the complexity of user queries.

Rather than requiring users to manually toggle "thinking mode" for every interaction, AutoThink:

1. Analyzes the complexity of each user query on a scale from 0-100
2. Automatically enables thinking mode for complex queries
3. Allocates an appropriate thinking budget based on complexity
4. Responds directly for simple queries that don't require deep thought

## Local Usage

- Clone repo
- Run `npm install` to install dependencies
- Run `npm run dev` to start the development server

## Why This Matters

The manual "think toggle" in AI assistants creates unnecessary cognitive load for users. AutoThink presents a more natural interaction model where the AI, like a human, exercises judgment about when to think deeply versus respond quickly.

## Key Features

- **Automatic complexity detection**: Scores queries from 0-100
- **Dynamic thinking allocation**: Assigns thinking tokens proportional to complexity
- **Transparent operation**: Shows complexity scores and thinking process
- **Bring-your-own-API-key**: Uses client-side API calls for data privacy

## Getting Started

Visit the [live demo](http://nilock.github.io/autothink) and provide your Anthropic API key to try it out.

Your API key is stored only in your browser's localStorage and is never sent to our servers. All API calls are made directly from your browser to Anthropic.

## Implementation Details

The core algorithm is straightforward:

1. Pre-fire the user query to determine its complexity (0-100)
2. If complexity is below threshold (10), respond immediately
3. If complexity is above threshold, allocate proportional thinking budget
4. Send the original query with allocated thinking tokens

## Technical Stack

- React + Vite
- Anthropic API (Claude 3.7)
- Client-side only (no server)

## Future Improvements

- Incorporate conversation context into complexity ratings
- Fine-tune complexity thresholds based on user feedback
- Add chat persistence and history

## Contributing

Feel free, but the author mostly considers this a compled PoC not subject to further development.

## License

MIT License
