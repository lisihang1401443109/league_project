import './App.css';
import React, { useRef, useEffect, useState} from 'react';

function App() {
  const summonerNameRef = useRef()
  useEffect(() => {
    console.log('summonerName: ' + summonerNameRef.current)
    }
    ,[summonerNameRef])

  return (
    <div className="App">
      <div className='container' id='get-user-inputs'>
        <input id='user-input' ref={summonerNameRef} type="text" placeholder='summoner-name'></input>
        <br></br>
        <button id='submut-button'>submit</button>
      </div>
    </div>
  );
}

export default App;
