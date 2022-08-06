import React, { useState, useEffect } from "react";

function useRequest(req, params = null){
    const [summonerName, setSummonerName] = useState('');
    const timeout = 1000
    const threshold = 20
    // var reqQueue = 0
    const [reqQueue, setReqQueue] = useState([])
    const [onGoingReq, setOnGoingReq] = useState([])
  
    useEffect(() => {
        console.log(reqQueue)
        if (reqQueue.length == 0){
          return
        }
        if (onGoingReq.length < threshold){
          //put a request to onGoingReq if it's not full
          console.log('putting: ' + reqQueue)
          setOnGoingReq(val => [...val, axios.get(reqQueue[0])])
          setReqQueue(val => val.slice(1))
        }else{
          //put it back to the end
          console.log('full')
          setReqQueue(val => [...val, val[0]].slice(1))
        }
    }, [reqQueue])
  
    useEffect(() => {
      if (onGoingReq.length == 0){
        return
      }
      
    }, [onGoingReq])

    setReqQueue(arr => [...arr, req])

    return (url) => {
      let objPromist = Promise((resolve, reject) => {
        
      })
    }
}

export default MakeRequest