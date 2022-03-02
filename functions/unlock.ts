import { Handler } from '@netlify/functions';
import { Contract, providers, utils } from 'ethers';
import ModAbi from '../src/data/abi/Mod3DItem.json';
import unlockable from '../data/unlockable.json';

const contractAddress = process.env.REACT_APP_MOD_CONTRACT_ADDRESS;

const ModContract = new Contract(
  contractAddress,
  ModAbi.abi,
  new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Max-Age': '2592000',
  'Access-Control-Allow-Credentials': 'true',
};

const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  if (!event.body) {
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({ status: 'no-body' }),
    };
  }
  const { message, signature } = JSON.parse(event.body);
  const signerAddress = utils.verifyMessage(message, signature);
  const messageData = message.split('-');
  if (messageData.length >= 3) {
    const tokenId = messageData[2];
    const tokenOwner = await ModContract.ownerOf(tokenId);
    if (signerAddress === tokenOwner) {
      const unlockItem = unlockable.find((item) => item.tokenId === tokenId);
      if (!unlockItem) {
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({
            status: 'unlocked-404',
            unlockedLink: '',
          }),
        };
      }
      return {
        headers,
        statusCode: 200,
        body: JSON.stringify({
          status: 'unlocked',
          unlockedLink: unlockItem.content,
        }),
      };
    }
  }
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({ status: 'unlock-fail' }),
  };
};

export { handler };
