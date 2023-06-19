import React from "react";
import { ethers } from "ethers";

const List = ({data}) => {
    if (Object.keys(data).length === 0) {
        return <div>empty data!</div>
    }
    const {reqDuration, tokenFlow, addressInfos,lastInteract,txType, methodName, riskStatus, simulateStatus, simulatemessage} = data;
    const listItems = tokenFlow && tokenFlow.map((item, key) => {
        const addressInfo = addressInfos[item.token]
        if (addressInfo) {
            const tokenNumber = ethers.utils.formatUnits(ethers.BigNumber.from(item.value).toString(), addressInfo.addressExtraInfo.decimals)
            return <li style={{paddingBottom: "10px"}} key={key}>
                Token: {item.token}<br/>
                {addressInfo.addressType} &nbsp; &nbsp;
                {item.direction === "OUT" ? "-" : "+"} {tokenNumber}
                &nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.addressExtraInfo.symbol} 
                &nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.logo && <img src={addressInfo.logo} width={18} height={18} />}
            </li>
        } else {
            return <li style={{paddingBottom: "10px"}} key={key}>
                Token: {item.token}<br/>
                {`Unknown Token`} &nbsp; &nbsp;
                {item.direction === "OUT" ? "-" : "+"} {ethers.BigNumber.from(item.value).toString()}
                &nbsp;&nbsp;&nbsp;&nbsp;{`No Symbol`} 
                &nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.logo && <img src={addressInfo.logo} width={18} height={18} />}

            </li>
        }
    })

    const balancesChange = tokenFlow && tokenFlow.reduce((obj, flow) => {
        obj[flow.token] = obj[flow.token] ? obj[flow.token] : [];
        const addressInfo = addressInfos[flow.token];
        if (obj[flow.token].length === 0 || !addressInfo || !(addressInfo.addressType === "SYS" || addressInfo.addressType === "ERC20"))  {
          obj[flow.token].push(flow);
          return obj;
        } 
        const oldData = obj[flow.token].pop();
        const oldNumber = ethers.BigNumber.from(oldData.value);
        const newNumber = ethers.BigNumber.from(flow.value);
        if (oldData.direction === flow.direction) {
          oldData.value = oldNumber.add(newNumber).toString();
          obj[flow.token].push(oldData);
          return obj;
        } else if (oldNumber.eq(newNumber)) {
          return obj;
        } else if (oldNumber.gt(newNumber)) {
          oldData.value = oldNumber.sub(newNumber).toString()
          obj[flow.token].push(oldData);
          return obj;
        } else {
          flow.value = newNumber.sub(oldNumber).toString()
          obj[flow.token].push(flow);
          return obj;
        }
    }, {})
    let balancesChangeItems = [];
    for (let k in balancesChange) {
        const addressInfo = addressInfos[k];
        for (let idx in balancesChange[k]) {
            console.log("idx", idx, "obj", balancesChange[k][idx])
            const item = balancesChange[k][idx];
            if (addressInfo) {
                const tokenNumber = ethers.utils.formatUnits(ethers.BigNumber.from(item.value).toString(), addressInfo.addressExtraInfo.decimals)
                balancesChangeItems.push(
                    <li style={{paddingBottom: "10px"}} key={"k-" + k + "-index-" + idx}>
                        Token: {item.token}<br/>
                        {addressInfo.addressType} &nbsp; &nbsp;
                        {item.direction === "OUT" ? "-" : "+"} {tokenNumber}
                        &nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.addressExtraInfo.symbol} 
                        &nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.logo && <img src={addressInfo.logo} width={18} height={18} />}
                    </li>
                )
            } else {
                balancesChangeItems.push(<li style={{paddingBottom: "10px"}} key={"k-" + k + "-index-" + idx}>
                    Token: {item.token}<br/>
                    {`Unknown Token`} &nbsp; &nbsp;
                    {item.direction === "OUT" ? "-" : "+"} {ethers.BigNumber.from(item.value).toString()}
                    &nbsp;&nbsp;&nbsp;&nbsp;{`No Symbol`} 
                    &nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.logo && <img src={addressInfo.logo} width={18} height={18} />}
                </li>)
            }
        }
    }

    return (
        <div >
            <h1 className="tokenFlowUl">Information</h1>
            <div className="listFlow">
                <div>
                        processTime: {reqDuration} ms
                </div>
                <div>
                        lastInteract:     {lastInteract}
                </div>
                <div>
                        riskStatus:       {riskStatus} 
                </div>
                <div>
                        simulateStatus:   {simulateStatus} 
                </div>
                <div>
                        txType: {txType}
                </div>
                <div>
                        methodName : {methodName}
                </div>
                {
                    simulateStatus !== "SUCCESS" && <div> simulateMessage:  {simulatemessage}  </div>
                }
            </div>
            <br/>
            <h1 className="tokenFlowUl">Token flow</h1>
            {
                tokenFlow && <ul className="tokenFlowUl">{listItems}</ul>
            }
            <h1 className="tokenFlowUl"> balance change</h1>
            {
                tokenFlow && <ul className="tokenFlowUl">{balancesChangeItems}</ul>
            }
        </div>
    )
}

export default List;