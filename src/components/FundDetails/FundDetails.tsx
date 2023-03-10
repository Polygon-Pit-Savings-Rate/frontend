import Funds from '@/abi/Funds';
import useDatabaseFund from '@/hooks/useDatabaseFund';
import { LPPositionsMock } from '@/mockData/mockData';
import { ethers } from 'ethers';
import { Address, useAccount, useContractReads } from 'wagmi';
import FundDetailHeader from './FundDetailHeader';
import FundDetailAssets from './FundDetailsAssets';
import FundDetailGraph from './FundDetailsGraph';
import Positions from './Positions';

interface FundDetailsProps {
  fundAddress: string;
  showLpPositions?: boolean;
}

const FundDetails = ({
  fundAddress,
  showLpPositions = true,
}: FundDetailsProps) => {
  const config = {
    address: fundAddress as Address,
    abi: Funds,
  };

  const { data: fund } = useDatabaseFund(fundAddress);

  const { data, isLoading } = useContractReads({
    scopeKey: fundAddress, // cache with individual fund page
    contracts: [
      { ...config, functionName: 'totalValueLocked' },
      {
        ...config,
        functionName: 'fetchAllLpPositions',
      },
      {
        ...config,
        functionName: 'startDate',
      },
      {
        ...config,
        functionName: 'matureDate',
      },
      // { ...config, functionName: 'stablecoin' },
    ],
    cacheTime: 60 * 1000, // 1min
    enabled: !!fundAddress,
  });

  const tvlLocked = parseFloat(ethers.utils.formatUnits(data ? data[0] : 0));

  const assetLocked = tvlLocked * 0.6;
  const assetFree = tvlLocked * 0.4;

  const LPPositionsMockAdjusted = LPPositionsMock;

  if (assetLocked) {
    LPPositionsMockAdjusted[0].amount0 = (assetLocked * 0.3) as any;
    LPPositionsMockAdjusted[1].amount0 = (assetLocked * 0.7) as any;
  }

  if (!fund) {
    return null;
  }

  return (
    <div className="mx-auto md:max-w-4xl">
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <FundDetailHeader
          fundName={fund?.name || 'Fund A'}
          fundAddress={fundAddress}
          fundManager={fund?.manager}
          fundDescription={
            fund?.description ||
            'An ETF LP token of DAI and WBTC on Uniswap V3 represents a liquidity pool that holds both DAI (a stablecoin pegged to the US dollar) and WBTC (Wrapped Bitcoin).\\n By holding this LP token, an investor has a stake in the liquidity pool and is entitled to a portion of the fees generated from trading activity in the pool. '
          }
          netValue={tvlLocked * 1.1}
          netDeposit={tvlLocked}
        />
        <div className="flex w-full flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <FundDetailAssets
            freeAmount0={tvlLocked * 0.4}
            freeAmount1={tvlLocked}
            lockedAmount0={tvlLocked * 0.6}
            lockedAmount1={tvlLocked}
            logo0={undefined}
            logo1={undefined}
          />
          <FundDetailGraph />
        </div>
        <Positions lpPositions={[]} showLpPositions={showLpPositions} />
      </div>
    </div>
  );
};

export default FundDetails;

{
  /* <PageTitle title="Fund Details" />
<div className="bg-slate-100 text-left px-6 py-6 rounded-lg shadow max-w-4xl mx-auto">
  <div className="pb-4">
    <div className="flex justify-between">
      <h2 className="text-3xl font-bold text-purple-800 pb-1">
        Fund Address:
      </h2>
      {status === 'connected' && address === manager && (
        <FancyButton
          className="shadow-sm"
          isLink
          href={`/funds/${fundAddress}/manage`}
        >
          Manage
        </FancyButton>
      )}
    </div>
    <span className="text-xl">{fundAddress}</span>
  </div>
  <div className="pb-4">
    <h2 className="text-3xl font-bold text-purple-800 pb-1">Assets:</h2>
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <p className="text-xl">
          <span className="font-bold">{tokenA}: </span>
          {tokenAAmount}
        </p>
        <NormalButton
          className="md:px-4 md:py-2"
          onClick={() => deposit()}
        >
          Deposit
        </NormalButton>
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-xl">
          <span className="font-bold">{tokenB}: </span>
          {tokenBAmount}
        </p>
        <NormalButton
          className="md:px-4 md:py-2"
          onClick={() => deposit()}
        >
          Deposit
        </NormalButton>
      </div>
    </div>
  </div>
  <div className="">
    <h2 className="text-3xl font-bold text-purple-800 pb-1">Manager:</h2>
    <span className="text-xl">{manager}</span>
  </div> */
}
