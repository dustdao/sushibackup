import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { useEffect, useState } from 'react';
import { WETH } from '../../imports/tokens';
import { WethMaker } from 'unwindooor-sdk';
import { formatUnits } from 'ethers/lib/utils';
import erc20Abi from './../../imports/abis/erc20.json';
import wethMakerABI from './../../imports/abis/wethMaker.json';
import { NETWORKS } from '../../helpers/network';
import Slippage from './slippage';
import { UNWINDOOOR_ADDR } from '../../helpers/unwindooor';
import { PRODUCTS, PRODUCT_IDS } from '../../helpers/products';

const BuyWeth = ({ setTxPending }: { setTxPending: Function }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector } = context;
  const [slippage, setSlippage] = useState(0.1);
  const [swapList, setSwapList] = useState([{ token: '', share: BigNumber.from(100) }]);
  const [outputs, setOutputs]: [outputs: any, setOutputs: Function] = useState([]);

  const execBuyWeth = async () => {
    if (!chainId || !connector) return;
    const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], wethMakerABI, provider).connect(provider.getSigner());
    const tokens = swapList.map((swap) => {
      return swap.token;
    });
    const amounts = outputs.map((output: any) => {
      return output.amountIn;
    });
    const minimumOuts = outputs.map((output: any) => {
      return output.minimumOut;
    });

    const gasQuantity = await maker.estimateGas.buyWeth(tokens, amounts, minimumOuts);
    const tx = await maker.buyWeth(tokens, amounts, minimumOuts, { gasLimit: gasQuantity.mul(130).div(100) }); //increase gas limit by 30% to reduce out of gas errors
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
  };

  useEffect(() => {
    const fetchOutputs = async () => {
      if (!connector || !chainId) return;
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const wethMaker = new WethMaker({
        wethMakerAddress: UNWINDOOOR_ADDR[chainId],
        preferTokens: [],
        provider: provider,
        maxPriceImpact: BigNumber.from(60),
        priceSlippage: BigNumber.from(slippage * 10),
        wethAddress: chainId ? WETH[chainId] : WETH[1],
        sushiAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        factoryAddress: chainId
          ? PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].networks[chainId]
          : PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].networks[1],
      });
      const wethMakerContract = new Contract(UNWINDOOOR_ADDR[chainId], wethMakerABI, provider);
      const tempOutputs = await Promise.all(
        swapList.map(async (swap: any) => {
          if (swap.token === '') return null;
          const { amountIn, minimumOut } = await wethMaker.sellToken(swap.token, swap.share);
          const bridge = await wethMakerContract.bridges(swap.token);
          const outputToken = new Contract(
            bridge === '0x0000000000000000000000000000000000000000' ? WETH[chainId] : bridge,
            erc20Abi,
            provider
          );
          const pairAddress = await wethMaker._getPair(swap.token);
          const { token0, reserve0, reserve1 } = await wethMaker._getMarketData(pairAddress, swap.token);
          const sellingToken0 = swap.token.toUpperCase() === token0.toUpperCase();
          const reserveIn = sellingToken0 ? reserve0 : reserve1;
          const reserveOut = sellingToken0 ? reserve1 : reserve0;
          const noPriceImpactAmountOut = reserveOut.mul(amountIn).div(reserveIn);
          return {
            amountIn: amountIn,
            minimumOut: minimumOut,
            noPriceImpactAmountOut: noPriceImpactAmountOut,
            decimals: await outputToken.decimals(),
            symbol: await outputToken.symbol(),
          };
        })
      );
      setOutputs(tempOutputs);
    };
    fetchOutputs();
  }, [active, chainId, connector, swapList, slippage]);

  if (!active) return <div className="text-center text-white">Please connect your wallet.</div>;

  return (
    <div className="text-center text-white">
      <Slippage setSlippage={setSlippage} slippage={slippage} />
      {swapList.map((swap, index) => {
        const output = outputs[index];
        const minimumOut = output ? parseFloat(formatUnits(output.minimumOut, output.decimals)) : 0;
        const noPriceImpactAmountOut = output
          ? parseFloat(formatUnits(output.noPriceImpactAmountOut, output.decimals))
          : 0;
        return (
          <div key={index} className="p-2 mt-4 text-lg border-2 border-indigo-700 rounded-lg">
            <div className="grid grid-cols-5 mb-4">
              <h3>From:</h3>
              <input
                className="col-span-4 text-center bg-indigo-700 rounded-lg"
                type={'text'}
                placeholder="Enter token address"
                onChange={(e) => {
                  const tempSwapList = [...swapList];
                  tempSwapList[index].token = e.target.value;
                  setSwapList(tempSwapList);
                }}
              />
            </div>
            <div className="grid grid-cols-6 mb-4">
              <h3>Share:</h3>
              <input
                className="w-16 font-medium text-center text-white bg-indigo-700 rounded-full text-md"
                type={'number'}
                value={swap.share.toNumber()}
                onChange={(e) => {
                  const tempSwapList = [...swapList];
                  let share = parseInt(e.target.value, 10);
                  if (isNaN(share)) share = 100;
                  if (share > 100) share = 100;
                  if (share < 1) share = 1;
                  tempSwapList[index].share = BigNumber.from(share);
                  setSwapList(tempSwapList);
                }}
              />
              <h3>Receive:</h3>
              <h3 className="col-span-3">
                {output
                  ? minimumOut.toFixed(4) +
                    ' (' +
                    ((minimumOut / noPriceImpactAmountOut - 1) * 100).toFixed(2) +
                    '%) ' +
                    output.symbol
                  : 'Loading...'}
              </h3>
            </div>
          </div>
        );
      })}
      <div>
        <button
          className={'px-6 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600 m-4'}
          onClick={() => {
            const tempSwapList = [...swapList];
            tempSwapList.pop();
            setSwapList(tempSwapList);
          }}
        >
          -
        </button>
        <button
          className={'px-6 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600 m-4'}
          onClick={() => {
            const tempSwapList = [...swapList];
            tempSwapList.push({
              token: '',
              share: BigNumber.from(100),
            });
            setSwapList(tempSwapList);
          }}
        >
          +
        </button>
      </div>
      <button
        className={'px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600'}
        onClick={() => execBuyWeth()}
      >
        Execute
      </button>
    </div>
  );
};

export default BuyWeth;
