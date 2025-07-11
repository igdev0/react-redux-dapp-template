import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Contract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const contractAbi = [
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
    name: 'i',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__
 */
export const useReadContract = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"i"`
 */
export const useReadContractI = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'i',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"sayHello"`
 */
export const useReadContractSayHello = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'sayHello',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__
 */
export const useWriteContract = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"decrement"`
 */
export const useWriteContractDecrement = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  functionName: 'decrement',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"increment"`
 */
export const useWriteContractIncrement = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  functionName: 'increment',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__
 */
export const useSimulateContract = /*#__PURE__*/ createUseSimulateContract({
  abi: contractAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"decrement"`
 */
export const useSimulateContractDecrement =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'decrement',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"increment"`
 */
export const useSimulateContractIncrement =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'increment',
  })
