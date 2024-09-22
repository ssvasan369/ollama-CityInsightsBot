# CityInfoChatbot

## Overview

CityInfoChatbot is an AI-driven application that provides detailed information about cities using the Ollama API with the Gemma model. It allows users to input a city name and retrieves structured information, including the city’s major industry and a fun activity to do there, all formatted in JSON.

## Features

- **AI-Powered Responses**: Utilizes the Gemma model from Ollama to generate informative responses.
- **Structured Output**: Ensures that responses conform to a defined JSON schema for easy parsing and usage.
- **Error Handling**: Implements robust error handling for JSON parsing and API requests.
- **TypeScript Support**: Built using TypeScript for enhanced type safety and developer experience.

## Getting Started

### Prerequisites

- Node.js
- TypeScript
- Ollama API server running locally on `http://127.0.0.1:11434`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/CityInfoChatbot.git
   cd CityInfoChatbot
