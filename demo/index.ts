import { config as loadEnv } from 'dotenv';
import { streamText } from 'ai';

loadEnv();
loadEnv({ path: '.env.local', override: true });

async function main() {
  const hasKey =
    process.env.OPENAI_API_KEY ||
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_OIDC_TOKEN;

  if (!hasKey) {
    throw new Error(
      'Set OPENAI_API_KEY, AI_GATEWAY_API_KEY, or ensure a Vercel OIDC token is available (run `vercel env pull`).',
    );
  }

  const result = streamText({
    model: 'openai/gpt-4.1',
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
