import React, { useState } from 'react';
import type { Fund } from './AssetsSection';

interface ModalProp {
  closeModal: () => void;
  fund?: Fund;
  addPosition: (number: string) => void;
}

interface DropdownProps {
  value?: string;
  options: string[];
  setValue: (val: string) => void;
}
const DropDown = ({ value, options, setValue }: DropdownProps) => {
  const [isHidden, setIsHidden] = useState(true);
  //   const [value, setValue] = useState(curValue);
  return (
    <div>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="mr-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setIsHidden(!isHidden)}
      >
        {value ? value : 'Select Token'}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {!isHidden && (
        <div
          id="dropdown"
          className="absolute w-24 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
          style={{ display: isHidden ? 'none' : 'normal' }}
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {options.map((option) => {
              return (
                <li
                  key={option}
                  onClick={() => {
                    setValue(option);
                    setIsHidden(true);
                  }}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {option}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const AddPositionModal = ({ closeModal, fund, addPosition }: ModalProp) => {
  const [number, setNumber] = useState<string>('');
  const [token1, setToken1] = useState('ETH');
  const [token2, setToken2] = useState('');
  const [amount1, setAmount1] = useState(0);
  const [amount2, setAmount2] = useState(0);
  //   const assets = fund.assets;

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };

  const continueDeposit = () => {
    addPosition(number);
  };

  return (
    <div className="">
      <div
        id="defaultModal"
        className="absolute left-1/2 -translate-x-1/2 "
        style={{ minWidth: 600 }}
      >
        <div className="relative w-full h-full max-w-2xl md:h-auto">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Uniswap V3 Position
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal"
                onClick={closeModal}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-left text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Select Pairs of Token
              </p>
              <div className="flex">
                <DropDown
                  value={token1}
                  options={['ETH', 'USDC', 'USDT']}
                  setValue={(val) => setToken1(val)}
                />
                <DropDown
                  value={token2}
                  options={['ETH', 'USDC', 'USDT']}
                  setValue={(val) => setToken2(val)}
                />
              </div>
              {token1 && token2 && (
                <div>
                  <div className="flex items-center mb-3">
                    <input
                      value={amount1}
                      type="text"
                      id="first_name"
                      onChange={(e: React.ChangeEvent<any>) =>
                        setAmount1(e.target.value)
                      }
                      className="w-100 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Asset"
                      required
                    />
                    <p className="text-left text-base leading-relaxed text-gray-500 dark:text-gray-400 pl-2">
                      {token1}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      value={amount2}
                      type="text"
                      id="first_name"
                      onChange={(e: React.ChangeEvent<any>) =>
                        setAmount2(e.target.value)
                      }
                      className="w-100 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Asset"
                      required
                    />
                    <p className="text-left text-base leading-relaxed text-gray-500 dark:text-gray-400 pl-2">
                      {token2}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* <!-- Modal footer --> */}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={addPosition}
              >
                + Add Position
              </button>
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPositionModal;
