import { nearestUsableTick } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { Label, Modal, TextInput } from 'flowbite-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import DummyContract from '../../abi/DummyContract';
import Funds from '../../abi/Funds';
import { useAppContext } from '../../context/app/appContext';
import { useGetPairTokenAmount } from '../../hooks/useGetPairTokenAmount';
import CustomButton from '../Common/CustomButton';
import CustomToastWithLink from '../Common/CustomToastWithLink';

type Props = {
  fundAddress?: string;
  show: boolean;
  onClose: () => void;
};

const CreatePosition = ({ fundAddress, show, onClose }: Props) => {
  const { state } = useAppContext();

  const [amount1, setAmount1] = useState(0);

  const [minPrice, maxPrice] = state.priceRangeValue;
  const feeTier = state.pool?.feeTier;

  const [minTick, maxTick] = useMemo(() => {
    return [
      convertPriceToTick(
        minPrice,
        Number(state.token0?.decimals ?? '18'),
        Number(state.token1?.decimals ?? '18'),
        Number(feeTier)
      ),
      convertPriceToTick(
        maxPrice,
        Number(state.token0?.decimals ?? '18'),
        Number(state.token1?.decimals ?? '18'),
        Number(feeTier)
      ),
    ];
  }, [
    feeTier,
    maxPrice,
    minPrice,
    state.token0?.decimals,
    state.token1?.decimals,
  ]);

  // Price is "token1/token0"
  const amount0Calc = useGetPairTokenAmount(Number(amount1));
  // const amount1Calc = useGetPairTokenAmount(Number(amount0));

  const token0Details = state.token0;
  const token1Details = state.token1;

  // Convert "minPrice" and "maxPrice" to ticks
  const token0Decimals = isNaN(Number(token0Details?.decimals))
    ? 18
    : Number(token0Details?.decimals);
  const token1Decimals = isNaN(Number(token1Details?.decimals))
    ? 18
    : Number(token1Details?.decimals);

  const amount0CalcInWei = ethers.utils.parseUnits(
    `${Math.floor(amount0Calc)}`,
    token0Decimals
  );

  const amount1InWei = ethers.utils.parseUnits(
    `${Math.floor(Number(amount1))}`,
    token1Decimals
  );

  // // wagmi hooks
  // const { config } = usePrepareContractWrite({
  //   address: fundAddress as Address,
  //   abi: Funds,
  //   functionName: 'deposit',
  //   args: [ethers.utils.parseUnits(amountToDeposit.toString(), wmaticDecimals)],
  //   enabled:
  //     amountToDeposit > 0 &&
  //     ethers.utils
  //       .parseUnits(`${amountToDeposit}`, wmaticDecimals)
  //       .lt(wmaticBalance),
  // });
  // const { data, isSuccess, write } = useContractWrite(config);
  // const {
  //   data: txReceipt,
  //   isSuccess: txIsSuccess,
  //   isLoading: txIsLoading,
  // } = useWaitForTransaction({
  //   hash: data?.hash,
  //   enabled: isSuccess,
  // });

  // Dummy contract, to mimic "createLpPosition" flow
  const { config } = usePrepareContractWrite({
    address: '0x37E14AcBdf310CEf93c0259f8CA6a703C77d56D4' as Address,
    abi: DummyContract,
    functionName: 'increment',
  });

  const {
    data,
    isLoading,
    isSuccess,
    write: dummyWrite,
  } = useContractWrite(config);

  const {
    data: txReceipt,
    isSuccess: txIsSuccess,
    isLoading: txIsLoading,
  } = useWaitForTransaction({
    hash: data?.hash,
    enabled: isSuccess,
  });

  useEffect(() => {
    if (txIsSuccess) {
      console.log(
        `LP Position Created Successfully, transaction hash:`,
        txReceipt
      );
      toast.success(
        CustomToastWithLink({
          txId: txReceipt?.transactionHash as any,
          content: 'LP Position Created Successfully, transaction hash:',
        })
      );
      onClose();
    }
  }, [txIsSuccess, txReceipt?.transactionHash]);

  const onSubmit = () => {
    // e.preventDefault();
    console.log('dummy', dummyWrite);

    dummyWrite?.();
  };

  // Before user chooses tokens, don't render anything
  if (!state.token0 || !state.token1) {
    return null;
  }

  return (
    <Modal show={show} dismissible onClose={onClose} className="dark h-full">
      <Modal.Header className="bg-gray-800">Create LP Position</Modal.Header>
      <Modal.Body className="space-y-4 bg-gray-800">
        <div className="space-y-2">
          {/* <span className="text-white">{state.token1?.symbol} amount</span> */}
          <Label>{state.token1?.symbol} amount</Label>
          <TextInput
            id="token1Amount"
            type={'text'}
            onChange={(e) => {
              if (
                !isNaN(Number(e.target.value)) &&
                Number(e.target.value) > 0
              ) {
                setAmount1(Number(e.target.value));
              }
            }}
            // value={amount1Calc}
            required
            placeholder={`Enter amounts of ${state.token1?.symbol} to deposit`}
          />
        </div>
        <div className="space-y-2 pb-2">
          <Label>{state.token0?.symbol} amount</Label>
          {/* <span className="text-white">{state.token0?.symbol} amount</span> */}
          <TextInput
            id="token0Amount"
            type={'text'}
            required
            disabled
            readOnly
            className="dark:text-gray-300"
            value={amount0Calc}
          />
        </div>
        <CustomButton
          className="focus:shadow-outline rounded py-2 px-4"
          type="submit"
          title="Create"
          theme="solidBlue"
          onClick={onSubmit}
          isLoading={txIsLoading}
        />
      </Modal.Body>
    </Modal>
  );
};

const convertPriceToTick = (
  // Price of "token1" to "token0"
  price: number,
  token0Decimals: number,
  token1Decimals: number,
  poolFee: number
) => {
  const inversePrice = 1 / price;
  const tokenDiffDecimals = token1Decimals - token0Decimals;
  const priceInWei = Math.pow(10, tokenDiffDecimals) * inversePrice;
  const tickVal = Math.log(priceInWei) / Math.log(1.0001);

  if (tickVal < -887272) {
    return -887272;
  }
  if (tickVal > 887272) {
    return 887272;
  }

  return nearestUsableTick(Math.floor(tickVal), poolFee / 50);
};

export default CreatePosition;
