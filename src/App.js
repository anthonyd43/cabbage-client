import './App.css';
import {useEffect, useState} from 'react';
import axios from "axios";
import { usePlaidLink } from 'react-plaid-link';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

function PlaidAuth({publicToken}){
  useEffect(() => {
    async function fetch() {
      const response = await axios.post("/api/plaid/exchange_public_token", {
        public_token: publicToken
      })
      console.log(response.data);
    } fetch();
  }, [publicToken])

  return (
    <div>
      <h1>Public Token: {publicToken}</h1>
    </div>
  )
}

function App() {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();
  useEffect(() => {
    async function fetch() {
      const response = await axios.post("/api/plaid/create_link_token")
      setLinkToken(response.data.link_token);
    }
    fetch();
  }, [])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      // send public_token to server
      setPublicToken(public_token);
      console.log("public_token ", public_token, metadata);
    },
  });
  
  return publicToken ? (<PlaidAuth publicToken={publicToken}/>) : (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}

export default App;
