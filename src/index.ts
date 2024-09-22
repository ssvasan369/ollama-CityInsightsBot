import { ChatResponse, Ollama } from 'ollama';

// Define the interface for the expected response structure from Ollama API
interface Message {
  role: string;
  content: string;
}

// Define the interface for the parsed JSON response
interface ChatSchema {
  city: string;
  industry: string;
  fun: string;
}

/**
 * Custom error class for handling chat response errors.
 */
class ChatResponseError extends Error {
  constructor(message: string, public cause?: any) {
    super(message);
    this.name = 'ChatResponseError';
  }
}

/**
 * Safely parses a JSON string.
 * @param jsonString The JSON string to parse.
 * @returns The parsed object or throws an error if parsing fails.
 */
function safeJsonParse(jsonString: string): ChatSchema {
  try {
    return JSON.parse(jsonString) as ChatSchema;
  } catch (parseError) {
    throw new ChatResponseError('Failed to parse JSON', {
      cause: parseError,
      rawResponse: jsonString,
    });
  }
}

/**
 * Constructs the prompt messages for the AI model.
 * @param city The city name provided by the user.
 * @param schema The JSON schema to enforce in the response.
 * @returns An array of message objects.
 */
function constructMessages(city: string, schema: object): Message[] {
  return [
    {
      role: 'system',
      content: `You are an assistant that provides detailed information about cities. When given a city name, describe the city including its major industry and one fun activity to do there. Ensure the response is strictly in JSON format adhering to the following schema:
      
${JSON.stringify(schema, null, 2)}
      
Do not include any additional text or explanations outside of the JSON object.`,
    },
    { role: 'user', content: city },
  ];
}

/**
 * Type guard to check if the response message contains valid content.
 * @param response The response object to check.
 * @returns True if the response contains valid content.
 */
function isValidResponse(response: ChatResponse): response is ChatResponse & { message: { content: string } } {
  return !!response.message?.content;
}

/**
 * Fetches the chat response from the Ollama API.
 * @param city The name of the city to get information about.
 * @returns A promise that resolves to the parsed chat response or throws an error.
 */
async function getChatResponse(city: string): Promise<ChatSchema> {
  const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

  const schema = {
    city: {
      type: 'string',
      description: 'The city where the user is located.',
    },
    industry: {
      type: 'string',
      description: 'The most popular industry in the city. What the city is known for.',
    },
    fun: {
      type: 'string',
      description: 'One thing that is fun to do there on a day off.',
    },
  };

  const messages: Message[] = constructMessages(city, schema);

  try {
    // Send the request to Ollama API
    const response: ChatResponse = await ollama.chat({
      model: 'gemma:2b',
      messages,
    });

    // Log the entire response for debugging purposes
    console.log('Raw ChatResponse:', response);

    // Validate response content
    if (isValidResponse(response)) {
      // Safely parse the JSON content
      const parsedResponse = safeJsonParse(response.message.content);
      console.log('Parsed Chat Response:', parsedResponse);
      return parsedResponse;
    } else {
      throw new ChatResponseError('Invalid response structure', response);
    }
  } catch (error) {
    console.error('Error fetching chat response:', error);
    throw new ChatResponseError(`Failed to get chat response for city: ${city}`, error);
  }
}

// Example usage:
getChatResponse('London')
  .then((response) => {
    console.log('Final Parsed Response:', response);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
