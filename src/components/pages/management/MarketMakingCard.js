import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {useWallet} from "@albs1/use-wallet";
import {useRouter} from "next/router";
import helper from "../../../helpers";
import i18n from '../../../i18n/index.json';
// core components
import Button from "../../core/Button/Button";
import InputWithIcon from "../../core/Input/InputWithIcon";
import Modal from "../../core/modal/Modal";

// page components
import Card from "../projectDetail/Card/Card";
import MarketMakingDeployment from "./MarketMakingDeployment";
import MarketMakingFunds from "./MarketMakingFunds";
import HomeCard from "../../pages/Home/HomeCard";
import SwitchBlock from "../../core/SwitchBlock";
import * as React from "react";
import dynamic from "next/dynamic";
const ReactTooltip = dynamic(() => import('react-tooltip'), {ssr: false});

export default function MarketMakingCard({project, marketMakingPool, mainChainId}) {

    const wallet = useWallet();
    const router = useRouter();
    const [visibleMarketMakingDeploymentModal, setVisibleMarketMakingDeploymentModal] = useState(false);
    const [visibleMarketMakingFundsModal, setVisibleMarketMakingFundsModal] = useState(false);
    const [depositFunds,setDepositFunds] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [baseTokenBalance, setBaseTokenBalance] = useState("0");
    const [pairedTokenBalance, setPairedTokenBalance] = useState("0");
    const [maxBuyingAmount, setMaxBuyingAmount] = useState("0");
    const [maxSellingAmount, setMaxSellingAmount] = useState("0");
    const [volume, setVolume] = useState("0");
    const [maxPreferredDrawdown, setMaxPreferredDrawdown] = useState("0");
    const [lowerPreferredPriceRange, setLowerPreferredPriceRange] = useState("0");
    const [upperPreferredPriceRange, setUpperPreferredPriceRange] = useState("0");
    const [createMMPool, setCreateMMPool] = useState(false);

    useEffect(() => {
        if (wallet.status === "connected" && marketMakingPool?.address && mainChainId == wallet.chainId) {
            const initWalletConnected = async () => {
                setBaseTokenBalance(
                    helper.formatting.web3Format(
                        await helper.token.balanceOf(
                            wallet,
                            marketMakingPool.token,
                            marketMakingPool.address,
                            mainChainId
                        ) || '0'
                    )
                );
                setPairedTokenBalance(
                    helper.formatting.web3Format(
                        await helper.token.balanceOf(
                            wallet,
                            marketMakingPool.paired_token,
                            marketMakingPool.address,
                            mainChainId
                        ) || '0'
                    )
                );
            };
            initWalletConnected();
        }
    }, [wallet, marketMakingPool, project]);

    const updateMarketMakingPool = useCallback(async () => {
        try {
            setIsLoading(true);
            const settings = {
                volume,
                max_selling_amount: maxSellingAmount,
                max_buying_amount: maxBuyingAmount,
                max_preferred_drawdown: maxPreferredDrawdown,
                lower_preferred_price_range: lowerPreferredPriceRange,
                upper_preferred_price_range: upperPreferredPriceRange,
                id: marketMakingPool.id,
            };

            await helper.marketMaking.updateMarketMakingPool({
                settings,
                wallet,
            });
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
        }

    }, [volume, maxBuyingAmount, maxSellingAmount, maxPreferredDrawdown, lowerPreferredPriceRange, upperPreferredPriceRange, marketMakingPool, wallet]);


    useEffect(() => {
        setMaxSellingAmount(marketMakingPool?.max_selling_amount);
        setMaxBuyingAmount(marketMakingPool?.max_buying_amount);
        setVolume(marketMakingPool?.volume);
        setMaxPreferredDrawdown(marketMakingPool?.max_preferred_drawdown);
        setLowerPreferredPriceRange(marketMakingPool?.lower_preferred_price_range);
        setUpperPreferredPriceRange(marketMakingPool?.upper_preferred_price_range);
    }, [marketMakingPool]);

    useEffect(() => {
        setTimeout(() => {
            setVisibleMarketMakingDeploymentModal(true);
            setVisibleMarketMakingFundsModal(true);
        }, 600)
    })

    return (

        <>
            <ReactTooltip/>
            <div className="flex flex-col gap-5">
                <Card className={'col-span-full md:col-span-1'}>
                    {visibleMarketMakingDeploymentModal &&
                        <Modal
                            title={i18n.en.management.marketMaking.createPool}
                            size="sm"
                            open={createMMPool}
                            handleClose={() => setCreateMMPool(false)}
                        >
                            <MarketMakingDeployment project={project}/>
                        </Modal>
                    }
                    {
                        marketMakingPool?.address === "" ? <div className="flex flex-col p-3.75 space-y-4">
                            <h1 className="text-2xl"><i className="fa-solid fa-sliders"/> {i18n.en.management.marketMaking.settings}</h1>
                            <div className="bg-gray-200 border border-gray-400 px-4 py-3 rounded relative text-center"
                                 role="alert">
                                <span>{i18n.en.management.marketMaking.noPoolCreated}</span>

                            </div>
                            <Button
                                name={i18n.en.management.marketMaking.createPoolButton}
                                handleClick={() => setCreateMMPool(true)}
                            />
                        </div> : (
                            wallet.chainId == mainChainId ?
                                <>
                                    <Modal
                                        title={i18n.en.management.marketMaking.depositTokensFunds}
                                        size="sm"
                                        open={depositFunds}
                                        handleClose={() => setDepositFunds(false)}
                                    >
                                        <MarketMakingFunds project={project} marketMakingPool={marketMakingPool} mainChainId={mainChainId}/>
                                    </Modal>
                                    <div className="flex flex-col p-3.75 space-y-4">
                                        <h2 className="text-2xl"><i className="fa-solid fa-sliders"/> {i18n.en.management.marketMaking.title}</h2>
                                        <div className="flex justify-between">
                                            <span className="text-sm"><i className="fa-solid fa-users"/> {i18n.en.management.marketMaking.attributes.usersStaked}</span>
                                            <span className="text-base font-medium">
                        {marketMakingPool.num_invested} <i data-tip={i18n.en.management.marketMaking.attributes.usersStakedTooltip} className="fa-solid fa-info-circle cursor-pointer"/>
                        </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm"><i className="fa-solid fa-users"/> {i18n.en.management.marketMaking.attributes.usersVested} </span>
                                            <span className="text-base font-medium">
                        {marketMakingPool.num_vested} <i data-tip={i18n.en.management.marketMaking.attributes.usersVestedTooltip} className="fa-solid fa-info-circle cursor-pointer"/>
                        </span>
                                        </div>
                                        <div className="flex justify-between">
                        <span className="text-sm">
                            <i className="fa-solid fa-money-bill-transfer"/> {i18n.en.management.marketMaking.attributes.tvl}
                        </span>
                                            <span className="flex text-base font-medium">
                            <Image src={project.image} alt="" width={24} height={24}/>
                            <span className="mx-2.5">{baseTokenBalance}</span>
                            <Image src={marketMakingPool.paired_token_image} alt="" width={24} height={24}/>
                            <span className="mx-2.5">{pairedTokenBalance} </span>
                        </span>
                                        </div>
                                        <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                                            <div className="w-full space-y-2.5">
                            <span className="text-base">
                            {i18n.en.management.marketMaking.attributes.maxBuyingAmountPerDay}
                                <i data-tip={i18n.en.management.marketMaking.attributes.maxBuyingAmountPerDayTooltip} className="ml-1.5 fa-solid fa-info-circle cursor-pointer"/>
                            </span>
                                                <InputWithIcon
                                                    id="editMaxBuyingAmount"
                                                    name="editMaxBuyingAmount"
                                                    type="number"
                                                    value={maxBuyingAmount}
                                                    setValue={setMaxBuyingAmount}
                                                    image={marketMakingPool.paired_token_image}
                                                />
                                            </div>
                                            <div className="w-full space-y-2.5">
                            <span className="text-base">
                            {i18n.en.management.marketMaking.attributes.maxSellingAmountPerDay}
                                <i data-tip={i18n.en.management.marketMaking.attributes.maxSellingAmountPerDayTooltip} className="ml-1.5 fa-solid fa-info-circle cursor-pointer"/>
                            </span>
                                                <InputWithIcon
                                                    id="editMaxSellingAmount"
                                                    name="editMaxSellingAmount"
                                                    type="number"
                                                    value={maxSellingAmount}
                                                    setValue={setMaxSellingAmount}
                                                    image={project.image}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                                            <div className="w-full space-y-2.5">
                                                <span className="text-base">{i18n.en.management.marketMaking.attributes.maxPreferredDrawdown}
                                                    <i data-tip={i18n.en.management.marketMaking.attributes.maxPreferredDrawdownTooltip} className="ml-1.5 fa-solid fa-info-circle cursor-pointer"/>
                                                </span>
                                                <InputWithIcon
                                                    id="editPairToken"
                                                    name="editPairToken"
                                                    type="number"
                                                    value={maxPreferredDrawdown}
                                                    setValue={setMaxPreferredDrawdown}
                                                    image={marketMakingPool.paired_token_image}
                                                />
                                            </div>
                                            <div className="w-full space-y-2.5">
                                                <span className="text-base">{i18n.en.management.marketMaking.attributes.volume}
                                                    <i data-tip={i18n.en.management.marketMaking.attributes.volumeTooltip} className="ml-1.5 fa-solid fa-info-circle cursor-pointer"/>
                                                </span>
                                                <InputWithIcon
                                                    id="editPairToken"
                                                    name="editPairToken"
                                                    type="number"
                                                    value={volume}
                                                    setValue={setVolume}
                                                    image={marketMakingPool.paired_token_image}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                                            <div className="w-full space-y-2.5">
                            <span className="text-base">
                            {i18n.en.management.marketMaking.attributes.lowerPreferredPriceRange}
                                <i data-tip={i18n.en.management.marketMaking.attributes.lowerPreferredPriceRangeTooltip} className="ml-1.5 fa-solid fa-info-circle cursor-pointer"/>

                            </span>
                                                <InputWithIcon
                                                    id="editMaxBuyingAmount"
                                                    name="editMaxBuyingAmount"
                                                    type="number"
                                                    value={lowerPreferredPriceRange}
                                                    setValue={setLowerPreferredPriceRange}
                                                    image={marketMakingPool.paired_token_image}
                                                />
                                            </div>
                                            <div className="w-full space-y-2.5">
                            <span className="text-base">
                                    {i18n.en.management.marketMaking.attributes.upperPreferredPriceRange}
                                <i data-tip={i18n.en.management.marketMaking.attributes.upperPreferredPriceRangeTooltip} className="ml-1.5 fa-solid fa-info-circle cursor-pointer"/>

                            </span>
                                                <InputWithIcon
                                                    id="editMaxBuyingAmount"
                                                    name="editMaxBuyingAmount"
                                                    type="number"
                                                    value={upperPreferredPriceRange}
                                                    setValue={setUpperPreferredPriceRange}
                                                    image={marketMakingPool.paired_token_image}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full grid grid-cols-2 gap-3.75">
                                            <Button
                                                name={i18n.en.management.marketMaking.attributes.updateSettingsButton}
                                                handleClick={updateMarketMakingPool}
                                                isLoading={isLoading}
                                                disabled={isLoading}
                                            />
                                            <Button
                                                name={i18n.en.management.marketMaking.attributes.depositFundsButton}
                                                handleClick={() => setDepositFunds(true)}
                                            />
                                        </div>
                                    </div>
                                </>
                                : <SwitchBlock targetChainId={mainChainId}/>
                        )
                    }


                </Card>


                {
                    wallet.chainId == mainChainId && marketMakingPool?.address !== "" ?                 <div className="grid grid-cols-1 md-lg:grid-cols-2 gap-5">
                        <HomeCard
                            icon={<i className="fa-solid fa-calendar-circle-plus text-2xl text-indigo-500"></i>}
                            title={i18n.en.management.marketMaking.actions.createVesting.title}
                            content={i18n.en.management.marketMaking.actions.createVesting.description}
                            handleClick={(e) => {
                                router.push(`${project.slug}/vesting/add`)
                            }}
                        />

                        <HomeCard
                            icon={<i className="fa-solid fa-eye text-2xl text-indigo-500"></i>}
                            title={i18n.en.management.marketMaking.actions.viewVesting.title}
                            content={i18n.en.management.marketMaking.actions.viewVesting.description}
                            handleClick={(e) => {
                                router.push(`${project.slug}/vesting`)
                            }}
                        />

                        <HomeCard
                            icon={<i className="fa-solid fa-paper-plane text-2xl text-indigo-500"></i>}
                            title={i18n.en.management.marketMaking.actions.multiSend.title}
                            content={i18n.en.management.marketMaking.actions.multiSend.description}
                            handleClick={(e) => {
                                router.push(`${project.slug}/multisend/add`)
                            }}
                        />

                        <HomeCard
                            icon={<i className="fa-solid fa-rectangle-vertical-history text-2xl text-indigo-500"></i>}
                            title={i18n.en.management.marketMaking.actions.multiSendHistory.title}
                            content={i18n.en.management.marketMaking.actions.multiSendHistory.description}
                            handleClick={(e) => {
                                router.push(`${project.slug}/multisend`)
                            }}
                        />
                    </div> : ""
                }
            </div>
        </>

    )
}