import { Signer, providers, ethers, BigNumber } from 'ethers';
import FundsFactory from '../abi/FundsFactory';

const USDC_MUMBAI_ADDRESS = '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747';

const getContract = async (
  signerOrProvider: providers.Provider | Signer,
  fundAddress: string
) => {
  if ((signerOrProvider as Signer)._isSigner) {
    const signer = signerOrProvider as Signer;

    return new ethers.Contract(fundAddress, FundsFactory, signer);
  } else {
    const provider = signerOrProvider as providers.Provider;
    return new ethers.Contract(fundAddress, FundsFactory, provider);
  }
};

const deposit = async (
  signer: Signer,
  fundAddress: string,
  amount: BigNumber
) => {
  const contract = await getContract(signer, fundAddress);
  const tx = await contract.deposit(amount);

  return await tx.wait();
};

/**
 * Fund manager functions
 */

export { deposit };
