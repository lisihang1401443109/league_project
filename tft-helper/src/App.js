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
      <div className='container'>
        <input ref={summonerNameRef} type="text" placeholder='summoner-name'></input>
        <button>submit</button>
      </div>
    </div>
  );
}

export default App;
