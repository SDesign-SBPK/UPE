import random

from prediction_api.ml.svm import predictPriorToGame
from prediction_api.ml_connector import getGameFromTeamID

teamIdList = ['alleycats', 'allstars1', 'aviators', 'breeze', 'cannons', 'cascades', 'constitution', 'cranes',
              'dragons',
              'empire', 'express', 'lions', 'flamethrowers', 'flyers', 'glory', 'growlers', 'hammerheads', 'havoc',
              'hustle',
              'legion', 'mechanix', 'nightwatch', 'nitro', 'outlaws', 'phoenix', 'radicals', 'rampage',
              'revolution',
              'riptide', 'royal', 'rush', 'shred', 'sol', 'spiders', 'spinners', 'summit', 'thunderbirds', 'union',
              'windchill']


def testPrediction():
    team = teamIdList[random.randrange(0, len(teamIdList), 1)]
    gameList = getGameFromTeamID(team)
    if gameList is None or len(gameList) == 0:
        return None
    else:
        selectedGame = gameList[random.randrange(0, len(gameList), 1)]
        teamOne = team
        if selectedGame[1] == teamOne:
            teamTwo = selectedGame[2]
        else:
            teamTwo = selectedGame[1]

    # Determine winning team ID
    if selectedGame[6] > selectedGame[7]:
        winningTeam = selectedGame[1]
    elif selectedGame[7] > selectedGame[6]:
        winningTeam = selectedGame[2]
    else:
        winningTeam = None

    # Exclude games that have incomplete data to make sure predictions are realistic
    if selectedGame[9] is None or selectedGame[10] is None or selectedGame[11] is None or selectedGame[12] is None:
        return None

    # Do the prediction
    result = predictPriorToGame(teamOne, teamTwo, selectedGame[9], selectedGame[10], selectedGame[11], selectedGame[12], selectedGame[0])

    # There was an error so ignore this test
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
        if winningTeam == predictedWinner:
            return True
        else:
            return False
    else:
        return None


correct = 0
total = 0
nulls = 0
for x in range(0, 300):
    result = testPrediction()
    if result is None:
        nulls += 1
        continue
    if result:
        correct += 1
        total += 1
    elif not result:
        total += 1
print("Average Accuracy: " + str((correct / total) * 100) + "%")
print("Number of null results: " + str(nulls))
