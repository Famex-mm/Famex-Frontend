import * as React from "react";

// core components
import Toggle from "../../src/components/core/Toggle/Toggle";

// page components
import FarmsCard from "../../src/components/pages/farms/FarmsCard";
import FarmsCardItem from "../../src/components/pages/farms/FarmsCardItem";

import { usePageTitleContext } from "../../src/context/PageTitleContext";
import {useEffect} from "react";
import helper from "../../src/helpers";
import {useWallet} from "@albs1/use-wallet";
import Head from "next/head";
import {TITLE_PREFIX} from "../../src/helpers/constants";


export default function Farms(props) {
    const { setTitle } =  usePageTitleContext();
    const wallet = useWallet();
    const [liquidityMakers, setLiquidityMakers] = React.useState([]);

    React.useEffect(() => {
        setTitle("Farms")   
    , [setTitle]})

        useEffect(() => {
        const fetchFarms = async () => {
            const result = await helper.liquidityMaker.getLiquidityMakers();
            setLiquidityMakers(result ?? []);
        };
            fetchFarms();

    }, [wallet]);
    
    return (
        <div className="flex flex-col gap-5 divide-y divide-dashed">
            <Head>
                <title>Farms | {TITLE_PREFIX}</title>
                <meta property="og:title" content={`Farms | ${TITLE_PREFIX}`} key="title" />
            </Head>
            {/*<div className="flex flex-col items-center justify-center gap-3">*/}
            {/*    <label className="text-2xl text-center font-medium">Stake LP tokens</label>*/}
            {/*    <Toggle label="Staked only" />*/}
            {/*</div>*/}
            <div className="pt-5">
                <FarmsCard>
                    {liquidityMakers.map((liquidityMaker, index) => <FarmsCardItem key={index} liquidityMaker={liquidityMaker} />)}
                </FarmsCard>
            </div>
        </div>
    )
}