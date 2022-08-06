import './App.css';
import React, { useRef, useEffect, useState} from 'react';
import axios from 'axios'

function App() {

  const apiStirngBase = ''
  const apiKey = ''


  const summonerNameRef = useRef()

  const clickHandler = (e) =>{
    e.preventDefault()

    console.log(summonerNameRef.current.value)
  }

  return (
    <div className="App">
      <div className='container' id='get-user-inputs'>
        <input id='user-input' ref={summonerNameRef} type="text" placeholder='summoner-name'></input>
        {/* <br></br> */}
        <button id='submut-button' onClick={clickHandler}>submit</button>
      </div>
    </div>
  );
}

export default App;
