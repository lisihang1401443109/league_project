import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import ReactDOM from 'react-dom/client'

var apiKey = 'RGAPI-b86f6b42-6db0-4320-92d0-fdad7c12786e';
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

//takes iin the puuid of a player and returns {count} most recent matches
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

// taking the match ID and returns the participants(with puuid) that appeared in that match
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

//taking a list of matches, and analyze the player's most recently played comps
function analyzeMatches(matches){
  for (let i = 0; i < matches.length; i++){
    console.log(i + ' :' + matches[i])
    
  }
}

//taking every player, and returns the player's most recently played comps
function analyzePlayer(player){
  var matchesPromise = getMatchesInfo(player, 20);
  matchesPromise.then(function (object) {
    return analyzeMatches(object)
  });
}

function getPlayerStats(player){
  return analyzePlayer(player)
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

  matchPromise.then(object => object.map(player => getPlayerStats(player)));
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
