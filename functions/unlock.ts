import { Handler } from '@netlify/functions';
import { Contract, providers, utils } from 'ethers';
import ModAbi from '../src/data/abi/Mod3DItem.json';

const contractAddress = process.env.REACT_APP_MOD_CONTRACT_ADDRESS;

const ModContract = new Contract(
  contractAddress,
  ModAbi.abi,
  new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
);

const handler: Handler = async (event, context) => {
  if (!event.body) {
    return {
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
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'unlocked',
          unlocked_link: 'https://test.com/expiring_link',
        }),
      };
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'unlock-fail' }),
  };
};

export { handler };
