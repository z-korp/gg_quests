import { env } from '../env.js';

export type PushActionsPayload = {
  actions: string[];
  address: string;
};

export async function pushActions({ actions, address }: PushActionsPayload) {
  console.log('+++ push:', address, actions);
  const url = `${env.API_URL}/api/v2/action-dispatcher/dispatch/public`;
  const body = JSON.stringify({ actions, playerAddress: address });

  // Create request object to log
  const requestDetails = {
    url,
    method: 'POST',
    headers: {
      secret: env.GAME_SECRET,
      'Content-Type': 'application/json',
    },
    body,
  };

  console.log('+++ request details:', JSON.stringify(requestDetails, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        secret: env.GAME_SECRET,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    console.log('+++ response:', response);

    return response;
  } catch (error) {
    console.error('Error pushing actions:', error);
    throw error; // Re-throw to allow caller to handle the error
  }
}
