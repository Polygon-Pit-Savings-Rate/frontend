import FundCreateModal from '@/components/Funds/FundCreateModal';
import useFund from '@/hooks/useFund';
import type { LPPosition } from '@/types/type';
import truncateString from '@/utils/truncateString';
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { Address } from 'wagmi';
import CustomButton from '../Common/CustomButton';
import PairValue from '../Common/PairValues';
import FundTable from '../FundDetails/FundTable';
import Spinner from '../Layout/Spinner';
import FundTableList from './FundTableList';

export interface FundDetailsProps {
  tokenA: string;
  tokenB: string;
  isLoading: boolean;
  fundAddress: Address;
  tvlSymbol: string;
  totalValueLocked: string;
  startDate: string;
  matureDate: string;
  manager: string;
  // description: string;
  // yieldPercentage: number;
  // lpPositions: LPPosition[];
  // fundName: string;
}

const FundDetails = ({
  // fundName,
  fundAddress,
  isLoading,
  tokenA,
  tokenB,
  tvlSymbol,
  totalValueLocked,
  matureDate,
  startDate,
  manager,
}: // description,
// yieldPercentage = 20.4,
// lpPositions = [],
FundDetailsProps) => {
  const router = useRouter();
  const { data } = useFund(fundAddress);

  const redirect = () => {
    router.push(`funds/${fundAddress}`);
  };
  return (
    <div
      className="min-h-40 w-full bg-blackfill text-whiteFont"
      style={{ position: 'relative' }}
    >
      <div className="flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold sm:text-3xl">
            {data?.name || 'No name found'}
          </h3>
          <CustomButton
            title="Deposit"
            theme="solidPurple"
            onClick={redirect}
          />
        </div>
        <div>
          <p className="text-l mb-xs sm:text-md">
            Manager:{' '}
            <span className="slashed-zero">{truncateString(manager)}</span>
          </p>
          <p className="max-w-mlg mt-4 mb-8 text-xs sm:text-sm">
            {data?.description || 'No description found'}
          </p>
        </div>
        <div className="">
          <PairValue field="TVL" value={totalValueLocked + ' ETH'} />
          <div className="flex items-center space-x-2">
            <p className="font-semibold sm:text-xl">Yield:</p>
            {/* <p className="text-greenGrowth">{yieldPercentage}%</p> */}
            <p className="text-greenGrowth">{0}%</p>
          </div>
          <PairValue field="Start Date" value={startDate} />
          <PairValue
            field="Mature Date"
            value={matureDate}
            style={{ marginBottom: 5 }}
          />
          <FundTableList data={[]} />
        </div>
      </div>
    </div>
  );
};

export default FundDetails;
