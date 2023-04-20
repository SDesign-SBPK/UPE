import random

from prediction_api.ml.player_svm import predictByPlayersPriorToGame
from prediction_api.ml.svm import getTeamPlayersBeforeGame, predictPriorToGame
from prediction_api.ml_connector import getGameFromTeamID

teamIdList = ['alleycats', 'allstars1', 'aviators', 'breeze', 'cannons', 'cascades', 'constitution', 'cranes',
              'dragons',
              'empire', 'express', 'lions', 'flamethrowers', 'flyers', 'glory', 'growlers', 'hammerheads',
              'hustle',
              'legion', 'mechanix', 'nightwatch', 'nitro', 'outlaws', 'phoenix', 'radicals', 'rampage',
              'revolution',
              'riptide', 'royal', 'rush', 'shred', 'sol', 'spiders', 'spinners', 'summit', 'thunderbirds', 'union',
              'windchill']


def testPlayerPrediction(spot):
    team = teamIdList[spot]
    gameList = getGameFromTeamID(team)
    if gameList is None or len(gameList) < 2:
        return None
    else:
        selectedGame = gameList[random.randrange(0, int(len(gameList) / 10) + 1, 1)]
        while selectedGame[8] == 'Upcoming':
            selectedGame = gameList[random.randrange(0, int(len(gameList) / 8) + 1, 1)]
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

    if winningTeam is not None:
        if winningTeam == teamOne:
            winningTeam = "team-one"
        else:
            winningTeam = "team-two"


    # Exclude games that have incomplete data to make sure predictions are realistic
    if selectedGame[10] is None:
        return None

    # Do the prediction
    result = predictByPlayersPriorToGame(getTeamPlayersBeforeGame(teamOne, selectedGame[0]),
                                         getTeamPlayersBeforeGame(teamTwo, selectedGame[0]), selectedGame[9],
                                         selectedGame[10], selectedGame[11], selectedGame[12], selectedGame)
    # There was an error so ignore this test
    if result is None:
        return None

    if result["winning-team"] is None:
        return None
    elif result["winning-team"] == winningTeam:
        return True
    else:
        return False


def testTeamPrediction(spot):
    team = teamIdList[spot]
    gameList = getGameFromTeamID(team)
    if gameList is None or len(gameList) < 2:
        return None
    else:
        selectedGame = gameList[random.randrange(0, int(len(gameList) / 10) + 1, 1)]
        while selectedGame[8] == 'Upcoming':
            selectedGame = gameList[random.randrange(0, int(len(gameList) / 8) + 1, 1)]
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
    if selectedGame[10] is None:
        return None

    # Do the prediction
    result = predictPriorToGame(teamOne,
                                         teamTwo, selectedGame[9],
                                         selectedGame[10], selectedGame[11], selectedGame[12], selectedGame[0])
    # There was an error so ignore this test
    if result is None:
        return None

    if result["winning-team"] is None:
        return None
    elif result["winning-team"] == winningTeam:
        return True
    else:
        return False

spot = 0
correct = 0
total = 0
nulls = 0
while total < 100:
    result = testPlayerPrediction(spot)
    spot += 1
    spot %= len(teamIdList)
    if result is None:
        nulls += 1
        continue
    if result:
        correct += 1
        total += 1
    elif not result:
        total += 1
print("Average Accuracy: " + str((correct / total) * 100) + "%")
