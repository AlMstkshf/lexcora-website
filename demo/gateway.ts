import { GatewayError } from '@ai-sdk/gateway';
import { config as loadEnv } from 'dotenv';
import { createGateway, streamText } from 'ai';

loadEnv();
loadEnv({ path: '.env.local', override: true });
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

async function main() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  const baseURL = process.env.AI_GATEWAY_URL;
  const modelId = process.env.AI_GATEWAY_MODEL ?? 'openai/gpt-4.1';

  if (!apiKey && !process.env.VERCEL_OIDC_TOKEN) {
    throw new Error(
      'Set AI_GATEWAY_API_KEY or ensure a Vercel OIDC token is available (run `vercel env pull`).',
    );
  }

  const gateway = createGateway({
    baseURL,
    apiKey,
  });

  try {
    const result = streamText({
      model: gateway(modelId),
      prompt: 'Invent a new holiday and describe its traditions.',
    });

    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }

    console.log();
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);
  } catch (err) {
    handleError(err);
  }
}

main().catch(handleError);

function handleError(err: unknown) {
  if (GatewayError.isInstance(err)) {
    console.error('AI Gateway error:', err.message);
    if (err.statusCode === 403) {
      console.error(
        'Add a credit card or set AI_GATEWAY_API_KEY / use vercel dev to refresh the token.',
      );
    }
  } else {
    console.error(err);
  }
  process.exitCode = 1;
}
