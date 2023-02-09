import PairValue from '../Common/PairValues';
import FundTableList from '../Funds/FundTableList';
// import ETH from 'src/components/Assets/ETH.png';
import ETH from 'src/assets/ETH.png';
import USDT from 'src/assets/USDT.jpg';

import Funds from '@/abi/Funds';
import { LPPositionsMock } from '@/mockData/mockData';
import type { Fund } from '@prisma/client';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Address, useContractReads } from 'wagmi';
import CustomButton from '../Common/CustomButton';

interface AssetsDetailProps {
  fund: Fund;
}

// Convert to ENUM
const tvlIndex = 0;
const lpPositionsIndex = 1;
// const stableCoinAddressIndex = 2;

const ManageFundCard = ({
  fund: { address, description, name, manager, startDate, matureDate },
}: AssetsDetailProps) => {
  const router = useRouter();

  const config = {
    address: address as Address,
    abi: Funds,
  };

  const { data, isLoading } = useContractReads({
    scopeKey: address, // cache with individual fund page
    contracts: [
      { ...config, functionName: 'totalValueLocked' },
      {
        ...config,
        functionName: 'fetchAllLpPositions',
      },
      // { ...config, functionName: 'stablecoin' },
    ],
    cacheTime: 60 * 1000, // 1min
    enabled: !!address,
  });

  if (!address || !data || !manager) {
    return null;
  }

  const totalValueLocked = ethers.utils.formatUnits(data[tvlIndex], 18);
  const yieldPercentage = 12.2;
  const logo1 = ETH;
  const logo2 = USDT;
  const lpPositions = data[lpPositionsIndex] || LPPositionsMock;
  const amount0 = 0;
  const amount1 = 1;

  return (
    <div
      className="w-full cursor-pointer rounded-xl border-2 border-[#EF5DA8] bg-blackfill py-4 px-8 text-left text-white transition-all hover:bg-gray-800"
      onClick={() => router.push(`/funds/${address}`)}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-fuchsia-100 sm:text-4xl">
          {name}
        </h3>
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Image
              src={logo1}
              width={40}
              alt={'WETH'}
              className="rounded-full"
              style={{ borderRadius: 100 }}
            />
            <p className="text-2xl">{amount0.toLocaleString()}</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Image
              src={logo2}
              width={40}
              alt={'USDC'}
              className="rounded-full"
              style={{ borderRadius: 100 }}
            />
            <p className="text-2xl">{amount1.toLocaleString()}</p>
          </div>
        </div>
        <CustomButton title="Add Position" theme="solidPurple" className="" />
      </div>
      <div className="flex">
        <div className="mr-12">
          <PairValue field="TVL" value={totalValueLocked + ' ETH'} />
          <div className="flex items-center space-x-2">
            <p className="font-semibold sm:text-xl">Yield:</p>
            <p className="text-greenGrowth">{yieldPercentage}%</p>
          </div>
          <PairValue
            field="Start Date"
            value={new Date(startDate).toLocaleDateString()}
          />
          <PairValue
            field="Mature Date"
            value={new Date(matureDate).toLocaleDateString()}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-1 space-x-6"></div>
          <div className="flex-1">
            <FundTableList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFundCard;