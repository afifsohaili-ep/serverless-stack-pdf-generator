export async function handler(event) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello! You've requested to print the receipt at page ${event.queryStringParameters.url}`,
  };
}
