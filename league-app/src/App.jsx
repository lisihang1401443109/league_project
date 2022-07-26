import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import ReactDOM from 'react-dom/client'

var apiKey = 'RGAPI-da61ea78-0dd8-4288-bce8-f6234e3a0832';
var apiBase = 'https://na1.api.riotgames.com';
var apiBaseAmericas = 'https://americas.api.riotgames.com';

// using the summonerName to get the information including PUUID of the summoner
function getSummonerInfo(summonerName){
  //make API call
  var apiString = apiBase + '/tft/summoner/v1/summoners/by-name/' + summonerName + '?api_key=' + apiKey;

  console.log(apiString)

  //returns an object promise
  return axios.get(apiString).then(function(response){
    if ('data' in response){
      return response.data  
    }else{
      return response
    }
  }).catch(function(response){
    console.log('Error: ' + response);
    return;
  })
}

function getMatchesInfo(puuid, count){
  var apiString = apiBaseAmericas + '/tft/match/v1/matches/by-puuid/'
                  + puuid + '/ids'+ '?start=' + '0'
                  + '&count=' + count + '&api_key=' + apiKey;

  //returns an object promise
  return axios.get(apiString).then(function(response){
    return response.data
  }).catch(function (response){
    console.log('Error: ' + response)
    return;
  })
  
}

function getMatchDetail(matchID){
  var apiString = apiBaseAmericas + '/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey
  return axios.get(apiString).then(function(response){
    if ('data' in response){
      return response.data.metadata.participants
    }else{
      return response.metadata.participants
    }
  }).catch(function (response){
    console.log('Error: ' + response)
  })
}

function getPlayerStats(players){

}

function searchHandler(e, summonerName){
  e.preventDefault();

  console.log('Searching for ' + summonerName);
  const dataPormise = getSummonerInfo(summonerName)
  var matches_data = dataPormise.then(function(data){
    // root.render(<Field value={data}/>)
    if ('puuid' in data){
      console.log('puuid: ' + data.puuid);
      return getMatchesInfo(data.puuid, 1)
    }else{
      console.log('no puuid')
      return;
    }
  })

  const matchPromise = matches_data.then(function(matches){
    // get the most recent match
    var match_interested = matches[0]
    return getMatchDetail(match_interested)
  })

  matchPromise.then(object => getPlayerStats(object));
}

class Field extends React.Component{

  render(){
    return(
      <div>
          {this.props.value}
      </div>
    )
  }
}

function App() {
  const [summonerName, setSummonerName] = useState('');
  const [playersInfo, setPlayersInfo] = useState({});

  return (
    <div className="App">
      <input type="text" className="summoner-name-input" placeholder="summoner-name" onChange={e => setSummonerName(e.target.value)}></input>
      <button className="search-btn" onClick={e => searchHandler(e, summonerName)}>Search</button>
      <div id="container"></div>
    </div>
  );
}

// const root = ReactDOM.createRoot(document.getElementById("container"));

export default App;
