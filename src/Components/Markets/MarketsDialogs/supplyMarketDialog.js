import BigNumber from "bignumber.js";
import React, {useEffect, useState} from "react"
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../TabControl/tabControl";
import TextBox from "../../Textbox/textBox";
import BorrowLimitSection from "./borrowLimitSection";
import MarketDialogButton from "./marketDialogButton";
import DialogMarketInfoSection from "./marketInfoSection";
import "./supplyMarketDialog.css"
import SupplyRateSection from "./supplyRatesSection";
import MarketDialogItem from "./marketDialogItem";
import { Spinner } from "../../../assets/huIcons/huIcons";

const SupplyMarketDialog = (props) =>{
    
    const [supplyInput, setSupplyInput] = useState("")
    const [withdrawInput, setWithdrawInput] = useState("")
    const [supplyValidation, setSupplyValidation] = useState("")
    const [withdrawValidation, setWithdrawValidation] = useState("")
    const [tabChange, setTabChange] = useState(1)
    const [newBorrowLimit1, setNewBorrowLimit1] = useState();
    const [newBorrowLimit2, setNewBorrowLimit2] = useState();
    const [withdrawMax, setWithdrawMax] = useState(false);

    const CloseDialog = () =>{
        if(props.spinnerVisible)
            return
        setSupplyInput("")
        setWithdrawInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setTabChange(1)
        setNewBorrowLimit1("")
        setNewBorrowLimit2("")
        setWithdrawMax(false)
        props.closeSupplyMarketDialog()
    }

    useEffect(()=>{
        const handleSupplyAmountChange = () => {
            if(supplyInput === ""){
                setSupplyValidation("")
                return;
            }

            if(isNaN(supplyInput)){
                setSupplyValidation("Amount must be a number");
            }else if (supplyInput <= 0) {
              setSupplyValidation("Amount must be > 0");
            } else if (supplyInput > +props.market?.walletBalance) {
              setSupplyValidation("Amount must be <= balance");
            }else{
                setSupplyValidation("");
            }
      
            setNewBorrowLimit1(
              props.generalData.totalBorrowLimit?.plus(
                props.market?.isEnterMarket
                  ? new BigNumber(supplyInput ? supplyInput : "0")
                      .times(props.market?.underlyingPrice)
                      .times(props.market?.collateralFactor)
                  : new BigNumber(0)
              )
            );
          };
        
          handleSupplyAmountChange()
          // eslint-disable-next-line
    }, [supplyInput])

    useEffect(()=>{
        const handleWithdrawAmountChange = () => {
            if(withdrawInput===""){
                setWithdrawValidation("")
                return
            }
            if(isNaN(withdrawInput)){
                setWithdrawValidation("Amount must be a number")
            }else if (withdrawInput <= 0) {
                setWithdrawValidation("Amount must be > 0")
            } else if (withdrawInput > +props.market?.supplyBalanceInTokenUnit) {
                setWithdrawValidation("Amount must be <= your supply balance")
            } else if (withdrawInput > +props.market?.underlyingAmount) {
                setWithdrawValidation("Amount must be <= liquidity")
            }else{
                setWithdrawValidation("");
                if(withdrawMax){
                    if(props.market?.supplyBalanceInTokenUnit.toString() !== withdrawInput.toString())
                    {
                        console.log(props.market?.supplyBalanceInTokenUnit.toString() + " " + withdrawInput)
                            setWithdrawMax(false)
                    }
                }
            }

            

            

            setNewBorrowLimit2(
                props.generalData.totalBorrowLimit?.minus(
                props.market?.isEnterMarket
                    ? new BigNumber(withdrawInput ? withdrawInput : "0")
                        .times(props.market?.underlyingPrice)
                        .times(props.market?.collateralFactor)
                : new BigNumber(0)
            ));
            console.log(withdrawMax)
        };
        
          handleWithdrawAmountChange()
          // eslint-disable-next-line
    }, [withdrawInput])

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        
        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }

    }, [props.open]);

    

    const getMaxAmount = async () => {
        var amount = await props.getMaxAmount(props.market?.symbol, props.market?.walletBalance)
        setSupplyInput(amount.toString())
    }

    const getMaxWithdraw = () => {
        setWithdrawMax(true)
        setWithdrawInput(props.market?.supplyBalanceInTokenUnit)
    }

    return (
        props.open ? (
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <div className="dialog-background" onClick = {() => CloseDialog()}></div>
            <div className="supply-box">
                <button className="dialog-close" onClick={()=>CloseDialog()}>

                </button>
                <div className="dialog-title">
                    {props.market?.symbol && (
                    <img
                        className="rounded-circle"
                        style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                        src={props.market?.logoSource}
                        alt=""/>)}
                    {`${props.market?.symbol}`}
                </div>
                <Tab>
                    <TabHeader tabChange = {tabChange}>
                        <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                        <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                    </TabHeader>
                    <TabContent>
                        <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.symbol}`} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"MAX"} 
                                onClick={()=>getMaxAmount()}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit1}/>
                            <DialogMarketInfoSection generalData={props.generalData} market={props.market} collateralFactorText={"Loan-to-Value"}/>
                           
                            {props.market?.underlyingAllowance?.isGreaterThan(0) &&
                                props.market?.underlyingAllowance?.isGreaterThanOrEqualTo(+supplyInput) 
                                ? (
                                    <MarketDialogButton disabled={!supplyInput || supplyValidation || props.market?.supplySpinner}
                                        onClick={() => {    props.handleSupply(
                                                                props.market?.symbol,
                                                                supplyInput
                                                            );
                                                        }}>
                                        {props.market.supplySpinner ? (<Spinner size={"20px"}/>) : "Supply"}
                                    </MarketDialogButton>
                                ) : (
                                    <MarketDialogButton disabled={props.market?.supplySpinner}
                                        onClick={() => {props.handleEnable(
                                                            props.market?.symbol
                                                        )
                                                }}>
                                        {props.market?.supplySpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.symbol}`}
                                    </MarketDialogButton>)}

                            <MarketDialogItem title={"Wallet Ballance"} 
                                value={`${props.market?.walletBalance?.decimalPlaces(4).toString()} ${props.market?.symbol}`}/>
                        </TabContentItem>
                        <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.symbol}`} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation} button={"MAX"}
                                onClick={() => getMaxWithdraw()}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit2}/>
                            <DialogMarketInfoSection generalData={props.generalData} market={props.market} collateralFactorText={"Loan-to-Value"}/>
                            <MarketDialogButton disabled={!withdrawInput || withdrawValidation}
                                onClick={() => {    console.log(withdrawMax)
                                                    props.handleWithdraw(
                                                        props.market?.symbol,
                                                        withdrawInput,
                                                        withdrawMax
                                                    );
                                                }}>
                                {props.market.withdrawSpinner ? (<Spinner size={"20px"}/>) : "Withdraw"}
                            </MarketDialogButton>
                            <MarketDialogItem title={"You Supplied"} value={`${props.market?.supplyBalanceInTokenUnit?.decimalPlaces(4)} ${props.market?.symbol}`}/>
                        </TabContentItem>
                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

export default SupplyMarketDialog