import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

var apiKey = 'RGAPI-f87bb50f-16b6-4c8d-a6e1-ed3add7cf369';
var apiBase = 'https://na1.api.riotgames.com';

function getSummonerInfo(summonerName){
  //make API call
  var apiString = apiBase + '/tft/summoner/v1/summoners/by-name/' + summonerName + '?api_key=' + apiKey;

  axios.get(apiString).then(function(response){
    var data = response.data;
    console.log(data);
    return data;
  }).catch(function(response){
    console.log('Error: ' + response);
    return;
  })
}

function getMatchInfo(puuid){
  var apiString = apiBase + '/tft/summoner/v1'

  
}

function searchHandler(e, summonerName){
  e.preventDefault();

  console.log('Searching for ' + summonerName);
  var data = getSummonerInfo(summonerName)
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
