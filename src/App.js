import './App.css';
import { useState } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import axios from 'axios';
import List from './List';

const apiUrls = {
  "eip155:1": "https://api.imstaging.works/v3/jsonrpc",
  "eip155:5": "https://api.imdev.works/v3/jsonrpc",
  "eip155:42161": "https://api.imstaging.works/v3/jsonrpc",
  "eip155:421613": "https://api.imdev.works/v3/jsonrpc"
}

const instance = axios.create()

export default () => {
  const [caip2, setCaip2] = useState("eip155:1");
  const [jsonStr, setJsonStr] = useState('');
  const [dataResult, setDataResult] = useState({});
  
  const preview = () => {
    const apiUrl = apiUrls[caip2]
    const rabbyJson = JSON.parse(jsonStr);
    const jsonRPC = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "wallet.simulateTx",
      "params": [
          {
            "caip2": caip2,
            "from": rabbyJson.from,
            "to": rabbyJson.to,
            "gas": "0x4122c9d",
            "maxFeePerGas": "0x20e38ba3c0",
            "maxPriorityFeePerGas": "0x59682f00",
            "value": rabbyJson.value,
            "input": rabbyJson.data ? rabbyJson.data : rabbyJson.input
          }
      ]
    }
    console.log("json request", jsonRPC)
    const headers = {
      'Content-Type': 'application/json',
    }
    const startTime = new Date().getTime();
    instance.post(apiUrl,jsonRPC, {headers}).then((response) => {
      if (response.status === 200) {
        const currentTime = new Date().getTime();
        console.log(response.data);
        setDataResult({...response.data.result, "reqDuration": currentTime - startTime})
      } else {
        alert("网络错误: status eq " + response.status)
      }
    }).catch((error) => {
      alert(error);
    })
  }
 
  return (
    <div className="App">
      <div className='left'>
        <div className="selectNetwork">
            <FormControl fullWidth>
              <InputLabel id="caip2-select-label">CAIP2</InputLabel>
              <Select
                labelId="caip2-select-label"
                id="caip2-select"
                value={caip2}
                label="Caip2"
                onChange={(event) => { console.log(event.target.value); setCaip2(event.target.value)}}
              >
                <MenuItem value={"eip155:1"}>ethereum主网</MenuItem>
                <MenuItem value={"eip155:5"}>ethereum测试网</MenuItem>
                <MenuItem value={"eip155:42161"}>arbitrum主网</MenuItem>
                <MenuItem value={"eip155:421613"}>arbitrum测试</MenuItem>
              </Select>
            </FormControl>
        </div>
        <div className="inputJson">
            <textarea 
              id="rabbyjsondata" name="rabbyjsondata"
              placeholder='pls input json data. example {"from": "", to: "", "data":"", "value":""}'
              rows="32" cols="60"
              value={jsonStr && jsonStr}
              onChange={(event) => { setJsonStr(event.target.value); setDataResult({})}}
            />
            <Button variant='contained' onClick={preview}>Preview</Button>
        </div>
      </div>
      <div className='right'>
        <List data={dataResult} />
      </div>
    </div>
  );
};