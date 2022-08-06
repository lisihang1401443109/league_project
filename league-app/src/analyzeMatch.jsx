import React, {} from "react";
import axios from "axios";
import {apiKey, apiBase, apiBaseAmericas} from "./App"

export default function analyzeMatch(matchID, player){
    const apiString = apiBaseAmericas + "/tft/match/v1/matches/" + matchID + "?api_key=" + apiKey

    // var matchDesc = axios.get(apiString).then((response) => {
    //     return response;
    // }).catch((error) => {
    //     console.log("Error: " + error)
    // })

    // matchDesc.then((matchDetail) => {
    //     var traits = []
    //     var units = []
        
    // })
}