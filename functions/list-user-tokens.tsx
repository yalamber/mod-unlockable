import { Handler } from '@netlify/functions';
import ethers from 'ethers';

const contractAddress = process.env.REACT_APP_MOD_CONTRACT_ADDRESS;

const handler: Handler = async (event, context) => {
  const { address } = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify([]),
  };
};

export { handler };
