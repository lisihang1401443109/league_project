import './App.css';
import React, { useRef, useEffect, useState} from 'react';
import axios from 'axios'
import axiosThrottle from 'axios-request-throttle'
import processPlayerObject from './processPlayerObject';

function App() {

  const apiStringBase = 'https://na1.api.riotgames.com'
  const apiKey = 'RGAPI-91b436a0-0818-4e41-be97-63c1c09b1a79'
  const apiStirngBaseAmerica = 'https://americas.api.riotgames.com'
  const numMatchesForAnalyze = 10

  // use throttled version of axios to get around the rate limit of riot developer api
  axiosThrottle.use(axios, { requestsPerSecond: 20 })

  // used to get the summoner name input
  // updated through onClick event of submit button
  const summonerNameRef = useRef()
  const errorDisplayRef = useRef()

  const displayError = (error) => errorDisplayRef.current.innerHTML = error

  // the count-most recent matches
  const findMostRecentMatches = (puuid, count) => {
    const apiString = apiStirngBaseAmerica + '/tft/match/v1/matches/by-puuid/' + puuid + '/ids' + '?api_key=' + apiKey + '&count=' + count
    return axios.get(apiString).then( (response) => {
      // console.log(response)
      if ('data' in response){
        return response.data
      }else{
        return response
      }
    }).catch(displayError)
  }

  // for each of the participant object in the match, find the corresponding participant object
  // and start to process it
  const analyzeMatch = (matchID, playerID) => {
    const apiString = apiStirngBaseAmerica + '/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey
    const matchPromise = axios.get(apiString)
    matchPromise.then( (response) => {
      var info = response.data.info
      if (info.tft_set_number != 7){
        return null
      }
      var playerObject = info.participants.filter(x => x.puuid == playerID)
      processPlayerObject(playerObject)
    })
  }

  // get the participants in the game given the matchID
  // exclude myself if the player of interest is in it
  const findParticipants = (matchID, myself = '') => {
    const apiString = apiStirngBaseAmerica + '/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey
    return axios.get(apiString).then( (response) => {
      if ('metadata' in response.data){
        return response.data.metadata.participants.filter(x => x != myself)
      }else{
        return response.data.participants.filter(x => x != myself)
      }
    }).catch(displayError)
  }

  const analyzeMatchDetails = (matchIDs) => {
    return Promise.all(matchIDs.map(id => {
      return axios.get(apiStirngBaseAmerica + '/tft/match/v1/matches/' + id + '?api_key=' + apiKey)
    })).then((response) => console.log(response));
  }

  const clickHandler = (e) =>{
    e.preventDefault()

    console.log(summonerNameRef.current.value)
    var myPuuid = ''

    // make api call to get the puuid of the player interested
    const apiString = apiStringBase + '/tft/summoner/v1/summoners/by-name/' + summonerNameRef.current.value + '?api_key=' + apiKey
    const playerInfoPromise = axios.get(apiString).then( (response) => {
      console.log(response)
      displayError('')
      if ('data' in response){
        console.log(response.data.puuid)
        myPuuid = response.data.puuid
        return response.data.puuid
      }else{
        console.log(response.puuid)
        myPuuid = response.puuid
        return response.puuid
      }
    }).catch(displayError)

    //get the player's most recent match and participants in it
    const participantsPromise = playerInfoPromise.then( (response) => findMostRecentMatches(response, 1)).catch(displayError).then(
      (response) => (findParticipants(response, myPuuid))
    ).catch(displayError)

    //do something for each participants
    participantsPromise.then( (response) => {
      return Promise.all(response.map( x => findMostRecentMatches(x, numMatchesForAnalyze)))
    }).then(res => {
      console.log(res)
      return res.map(player_matches => analyzeMatchDetails(player_matches))
    })


    // on the promise, the puuid of all participants in the latest game

    
    // for each of the participants, get their most recently played X games

  }

  return (
    <div className="App">
      <div className='container' id='get-user-inputs'>
        <input id='user-input' ref={summonerNameRef} type="text" placeholder='summoner-name'></input>
        <br></br>
        <button id='submit-button' onClick={clickHandler}>submit</button>
        <div className='error-message' ref={errorDisplayRef}></div>
      </div>
    </div>
  );
}

export default App;
