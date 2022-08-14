import React from "react";

const processPlayerObject = (playerObject) => {
    return playerObject

    // TODO: analyze the player's strategy

    // proposed method: view each player object as a vector, whose dimensions contain traits, champs, complete items, etc.
    // We also find the mainstream strategy, and find the closest strategy to the the player's strategy
    // return the strategy
}

const processResults = (results) => {
    return results

    // TODO: analyze the results (list of strategies analyzed by processPlayerObject method) and find the mostly likely strategy
    // accompanied with the cross entropy identifying the likelihood.
}

const recommendStrategy = (results) => {
    return results

    // TODO: let results be the maxima likelihood of the 7 opponents, and analyze what is the most favorable strategy for this game.
}

export default processPlayerObject