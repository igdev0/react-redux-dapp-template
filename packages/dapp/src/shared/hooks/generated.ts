import {createUseReadContract, createUseSimulateContract, createUseWriteContract,} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Contract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const contractAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'count',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decrement',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'increment',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sayHello',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
] as const

/**
 *
 */
export const contractAddress = {
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
} as const

/**
 *
 */
export const contractConfig = {
  address: contractAddress,
  abi: contractAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__
 *
 *
 */
export const useReadContract = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  address: contractAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"count"`
 *
 *
 */
export const useReadContractCount = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  address: contractAddress,
  functionName: 'count',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"sayHello"`
 *
 *
 */
export const useReadContractSayHello = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  address: contractAddress,
  functionName: 'sayHello',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__
 *
 *
 */
export const useWriteContract = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  address: contractAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"decrement"`
 *
 *
 */
export const useWriteContractDecrement = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  address: contractAddress,
  functionName: 'decrement',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"increment"`
 *
 *
 */
export const useWriteContractIncrement = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  address: contractAddress,
  functionName: 'increment',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__
 *
 *
 */
export const useSimulateContract = /*#__PURE__*/ createUseSimulateContract({
  abi: contractAbi,
  address: contractAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"decrement"`
 *
 *
 */
export const useSimulateContractDecrement =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: 'decrement',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"increment"`
 *
 *
 */
export const useSimulateContractIncrement =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: 'increment',
  })
