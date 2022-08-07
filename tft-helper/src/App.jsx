import './App.css';
import React, { useRef, useEffect, useState} from 'react';
import axios from 'axios'
import axiosThrottle from 'axios-request-throttle'

function App() {

  const apiStirngBase = 'https://na1.api.riotgames.com'
  const apiKey = 'RGAPI-b802dfdc-9ff5-4fcd-a125-e6f6861a49ee'

  // use throttled version of axios to get around the rate limit of riot developer api
  axiosThrottle.use(axios, { requestsPerSecond: 20 })

  // used to get the summoner name input
  // updated through onClick event of submit button
  const summonerNameRef = useRef()
  const errorDisplayRef = useRef()

  const displayError = (error) => errorDisplayRef.current.innerHTML = error

  const clickHandler = (e) =>{
    e.preventDefault()

    console.log(summonerNameRef.current.value)

    // make api call to get the puuid of the player interested
    const apiString = apiStirngBase + '/tft/summoner/v1/summoners/by-name/' + summonerNameRef.current.value + '?api_key=' + apiKey
    axios.get(apiString).then( (response) => {
      console.log(response)
      displayError('')
    }).catch(displayError)


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
