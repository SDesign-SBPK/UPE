import random

from prediction_api.ml.svm import predictPriorToGame
from prediction_api.ml_connector import getGameFromTeamID

teamIdList = ['alleycats', 'allstars1', 'aviators', 'breeze', 'cannons', 'cascades', 'constitution', 'cranes',
              'dragons',
              'empire', 'express', 'flamethrowers', 'flyers', 'glory', 'growlers', 'hammerheads', 'havoc', 'hustle',
              'legion', 'mechanix', 'nightwatch', 'nitro', 'outlaws', 'phoenix', 'radicals', 'rampage',
              'revolution',
              'riptide', 'royal', 'rush', 'shred', 'sol', 'spiders', 'spinners', 'summit', 'thunderbirds', 'union',
              'windchill']


def testPrediction():
    team = teamIdList[random.randrange(0,len(teamIdList), 1)]
    gameList = getGameFromTeamID(team)
    if gameList is None or len(gameList) == 0:
        print("Error: No games returned")
        return None
    else:
        selectedGame = gameList[random.randrange(0, len(gameList), 1)]
        teamOne = team
        if selectedGame[1] is teamOne:
            teamTwo = selectedGame[2]
        else:
            teamTwo = selectedGame[1]
            if teamOne == teamTwo:
                return None
    if selectedGame[6] > selectedGame[7]:
        winningTeam = selectedGame[1]
    elif selectedGame[7] > selectedGame[6]:
        winningTeam = selectedGame[2]
    else:
        winningTeam = None
    if selectedGame[9] is None or selectedGame[10] is None or selectedGame[11] is None or selectedGame[12] is None:
        return None
    result = predictPriorToGame(teamOne, teamTwo, selectedGame[9], selectedGame[10], selectedGame[11], selectedGame[12], selectedGame[0])
    if result is None:
        return None
    if result[0][0] > result[0][1]:
        if result[1][0] > result[1][1]:
            predictedWinner = teamOne
        else:
            predictedWinner = None
    else:
        if result[1][1] > result[1][0]:
            predictedWinner = teamTwo
        else:
            predictedWinner = None
    if winningTeam is not None:
        if winningTeam is predictedWinner:
            return True
        else:
            return False
    else:
        if predictedWinner is None:
            return True
        else:
            return False

correct = 0
total = 0
randomValue = random.randrange(0, 500, 1)
for x in range(0, randomValue):
    result = testPrediction()
    if result is None:
        continue
    if result is True:
        correct += 1
        total += 1
    else:
        total += 1
print("Average Accuracy: " + str(correct / total) + "\nOut of " + str(randomValue) + " tests")
