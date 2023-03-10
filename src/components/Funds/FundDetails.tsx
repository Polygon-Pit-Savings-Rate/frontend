import truncateString from '@/utils/truncateString';
import {
  ClipboardDocumentIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { BigNumber, ethers } from 'ethers';
import { Tooltip } from 'flowbite-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Address, erc20ABI, useAccount, useContractReads } from 'wagmi';
import Funds from '../../abi/Funds';
import CustomButton from '../Common/CustomButton';
import PairValue from '../Common/PairValues';
import DepositFundModal from './DepositFundModal';
import FundTableList from './FundTableList';
import SwapTokensModal from './SwapTokensModal';

export interface FundDetailsProps {
  isLoading: boolean;
  fundAddress: Address;
  totalValueLocked: string;
  startDate: string;
  matureDate: string;
  manager: string;
  stableCoinAddress: string;
  description?: string;
  yieldPercentage?: string;
  fundName: string;
  showLpPositions?: boolean;
}

const FundDetails = ({
  fundName,
  fundAddress,
  isLoading,
  description,
  totalValueLocked,
  matureDate,
  startDate,
  manager,
  stableCoinAddress,
  yieldPercentage,
  showLpPositions = true,
}: FundDetailsProps) => {
  const account = useAccount();

  const [showSwapTokensModal, setSwapTokensModal] = useState<boolean>(false);

  const { data: stableCoin } = useContractReads({
    scopeKey: stableCoinAddress,
    contracts: [
      {
        address: stableCoinAddress as Address,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: stableCoinAddress as Address,
        abi: erc20ABI,
        functionName: 'symbol',
      },
    ],
    enabled:
      stableCoinAddress != ethers.constants.AddressZero && !!account?.address,
  });

  const [stableCoinDecimals, stableCoinSymbol] =
    stableCoin !== undefined && stableCoin.every(Boolean)
      ? stableCoin
      : [18, 'ETH'];

  return (
    <div className="min-h-40 w-full text-fuchsia-100">
      <div className="flex h-full flex-col justify-between">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="truncate text-2xl font-bold sm:text-4xl md:w-80">
            {fundName}
          </h3>
        </div>
        <div className="pb-6">
          <p className="mb-xs sm:text-md flex items-center space-x-1">
            <span>Manager:</span>
            <span className="slashed-zero">{truncateString(manager)} </span>
          </p>
          <p className="mb-xs sm:text-md flex items-center space-x-1">
            <span>Fund Address:</span>
            <span className="slashed-zero">{truncateString(fundAddress)}</span>
          </p>
          <p className="max-w-mlg mt-4 mb-8 text-lg">
            {description || 'No description found.'}
          </p>

          <div>
            <PairValue
              field="TVL"
              value={`${ethers.utils.formatUnits(
                totalValueLocked,
                stableCoinDecimals
              )} ${stableCoinSymbol}`}
              endComponent={
                <Tooltip
                  content="Total Value Locked"
                  className="px-2 text-center shadow-xl"
                >
                  <InformationCircleIcon
                    height={16}
                    width={16}
                    className="ml-1 transition-colors hover:stroke-fuchsia-300"
                  />
                </Tooltip>
              }
            />
            <PairValue
              field="Yield"
              value={
                isNaN(Number(yieldPercentage)) || Number(yieldPercentage) == 0
                  ? `${(5.1).toFixed(1)}%`
                  : `${Number(yieldPercentage).toFixed(1)}%`
              }
              valueClassName="text-green-500"
              endComponent={
                <Tooltip
                  content="Lifetime yield earned"
                  className="px-2 text-center shadow-xl"
                >
                  <InformationCircleIcon
                    height={16}
                    width={16}
                    className="ml-1 transition-colors hover:stroke-fuchsia-300"
                  />
                </Tooltip>
              }
            />
            <PairValue field="Start Date" value={startDate} />
            <PairValue
              field="Mature Date"
              value={matureDate}
              endComponent={
                <Tooltip
                  content="The date at which the fund will be disabled, and withdrawals will be enabled"
                  className="px-2 text-center shadow-xl"
                >
                  <InformationCircleIcon
                    height={16}
                    width={16}
                    className="ml-1 transition-colors hover:stroke-fuchsia-300"
                  />
                </Tooltip>
              }
            />
          </div>
        </div>
        {showLpPositions && <FundTableList />}
      </div>
      <SwapTokensModal
        fundAddress={fundAddress}
        show={showSwapTokensModal}
        onClose={() => setSwapTokensModal(false)}
      />
    </div>
  );
};

export default FundDetails;
