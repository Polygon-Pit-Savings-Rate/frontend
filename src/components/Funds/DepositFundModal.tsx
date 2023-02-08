import { ethers } from 'ethers';
import { Label, Modal, TextInput } from 'flowbite-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Address,
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import Funds from '../../abi/Funds';
import CustomButton from '../Common/CustomButton';

type DepositFundProps = {
  fundAddress: string;
  show: boolean;
  onClose: () => void;
};

const WMATIC_MUMBAI_ADDRESS =
  process.env.WMATIC_MUMBAI_ADDRESS ??
  '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';

const DepositFundModal = ({ fundAddress, show, onClose }: DepositFundProps) => {
  const [amountToDeposit, setAmountToDeposit] = useState(0);

  const account = useAccount();
  const { data: wmatic } = useContractReads({
    contracts: [
      {
        address: WMATIC_MUMBAI_ADDRESS as Address,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: WMATIC_MUMBAI_ADDRESS as Address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account.address as Address],
      },
      {
        address: WMATIC_MUMBAI_ADDRESS as Address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [account.address as Address, fundAddress as Address],
      },
    ],
    enabled: !!account?.address,
  });

  const [wmaticDecimals, wmaticBalance, wmaticAllowance] = wmatic ?? [18, 0, 0];

  // wagmi hooks
  const { config } = usePrepareContractWrite({
    address: fundAddress as Address,
    abi: Funds,
    functionName: 'deposit',
    args: [ethers.utils.parseUnits(amountToDeposit.toString(), wmaticDecimals)],
    enabled:
      amountToDeposit > 0 &&
      ethers.utils.parseUnits(`${amountToDeposit}`, wmaticDecimals) <
        wmaticBalance,
  });
  const { data, isSuccess, write } = useContractWrite(config);
  const {
    data: txReceipt,
    isSuccess: txIsSuccess,
    isLoading: txIsLoading,
  } = useWaitForTransaction({
    hash: data?.hash,
    enabled: isSuccess,
  });

  // toasts
  const [hasCreated, setHasCreated] = useState(false);

  useEffect(() => {
    if (txIsSuccess && !hasCreated) {
      setHasCreated(true);
      console.log(
        `Successfully deposited, transaction hash: ${JSON.stringify(txReceipt)}`
      );
      toast.success(
        `Successfully deposited, transaction hash: ${txReceipt?.transactionHash}`
      );
      onClose();
    }
  }, [hasCreated, txIsSuccess, txReceipt?.transactionHash]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setHasCreated(false);
    if (
      ethers.utils.parseUnits(`${amountToDeposit}`, wmaticDecimals) >
      wmaticBalance
    ) {
      toast.error(
        `Insufficient balance, currently you have ${ethers.utils.formatEther(
          wmaticBalance
        )} WMATIC`
      );
    }

    write?.();
  };

  return (
    <Modal show={show} dismissible onClose={onClose} className="h-full">
      <Modal.Header className="bg-gray-800">Deposit Fund</Modal.Header>
      <Modal.Body className="bg-gray-800">
        <form className="space-y-4 rounded" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="amountToDeposit">WMATIC amount</Label>
            <TextInput
              id="amountToDeposit"
              type="text"
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  setAmountToDeposit(Number(e.target.value));
                }
              }}
              required
              placeholder="Enter your deposit amount"
            />
          </div>
          <div className="flex space-x-4">
            <CustomButton
              className="focus:shadow-outline rounded py-2 px-4"
              type="submit"
              title={
                wmaticAllowance <
                ethers.utils.parseUnits(`${amountToDeposit}`, wmaticDecimals)
                  ? 'Approve'
                  : 'Deposit'
              }
              theme="solidBlue"
              isLoading={txIsLoading}
            />
            <CustomButton
              className="focus:shadow-outline rounded py-2 px-4"
              title="Cancel"
              theme="solidPurple"
              onClick={onClose}
            />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DepositFundModal;
