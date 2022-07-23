import React, { useState } from 'react';
import './App.css';

function searchHandler(e, summonerName){
  e.preventDefault();

  console.log('Searching for ' + summonerName);
}

function App() {
  const [summonerName, setSummonerName] = useState(0);
  return (
    <div className="App">
      <input type="text" className="summoner-name-input" placeholder="summoner-name" onChange={e => setSummonerName(e.target.value)}></input>
      <button className="search-btn" onClick={e => searchHandler(e, summonerName)}>Search</button>
    </div>
  );
}

export default App;
