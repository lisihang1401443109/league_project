import './App.css';
import React, { useRef, useEffect, useState} from 'react';
import axios from 'axios'
import axiosThrottle from 'axios-request-throttle'
import processPlayerObject from './processPlayerObject';

function App() {

  const apiStringBase = 'https://na1.api.riotgames.com'
  const apiKey = 'RGAPI-8f62f87e-7e29-41f3-bfd5-42c649900476'
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
  const findParticipants = async (matchID, myself = '') => {
    const apiString = apiStirngBaseAmerica + '/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey
    return axios.get(apiString).then( (response) => {
      if ('metadata' in response.data){
        return response.data.metadata.participants.filter(x => x != myself)
      }else{
        return response.data.participants.filter(x => x != myself)
      }
    }).catch(displayError)
  }

  const analyzeMatchDetails = async (matchIDs, playerID) => {
    console.log('analyzing match details')
    console.log(matchIDs, playerID)

    const playerObjects = await matchIDs.map(matchID => {
      const apiString = apiStirngBaseAmerica + '/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey
      return axios.get(apiString).then( (response) => {
        const playerObj = response.data.info.participants
        // console.log(playerObj, playerID) 
        console.log(playerObj.filter(x => x.puuid == playerID)[0])
        return playerObj
      })
    })
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
        console.log('mypuuid: ' + myPuuid)
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
    participantsPromise.then( (playerIDs) => {
      return playerIDs.filter(playerID => playerID != myPuuid).map(playerID => {
        console.log(playerID)
        const recentNMatches = findMostRecentMatches(playerID, numMatchesForAnalyze)
        recentNMatches.then( (matches) => {
          return analyzeMatchDetails(matches, playerID)
        })
      })
    }).then( (response) => console.log(response) );


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
