from sklearn import svm

from ml_connector import getAllStatsForTeam, getGame, getTeam, getGameFromTeamID, getTeamGameRoster
from ml.player_svm import predictByPlayers

baseWeight = 5
sampleWeights = []


def getTeamStatsFiltered(teamId, gameID):
    gameHistory = []
    sqlGames = getAllStatsForTeam(teamId)
    dateSplit = gameID.split('-')
    for row in sqlGames:
        skip = True
        for x in range(2010, int(dateSplit[0]) + 1):
            rowSplit = row[0].split('-')
            if x < int(rowSplit[0]):
                skip = False
            elif x == int(rowSplit[0]):
                if int(rowSplit[1]) < int(dateSplit[1]):
                    skip = False
                elif int(rowSplit[1]) == int(dateSplit[1]):
                    if int(rowSplit[2]) < int(dateSplit[2]):
                        skip = False

        if skip:
            continue
        currentWeight = baseWeight
        # Add the team completion%, hold%, break%, turnovers, blocks. Verified that there are no null values in DB first
        # gameEntry = [float(row[2]), float(row[6]), float(row[7])]
        winHistory = getGame(row[0])
        gameEntry = []
        if winHistory is not None:
            # Check to see if it is away or home team
            if teamId == winHistory[1]:
                if not (int(winHistory[6]) - int(winHistory[7]) > 0):
                    # Append that they won
                    # gameEntry.append(1)
                    continue
                else:
                    gameEntry.append(winHistory[6])
            else:
                if not (int(winHistory[7]) - int(winHistory[6]) > 0):
                    # Append the team won
                    # gameEntry.append(1)
                    continue
                else:
                    gameEntry.append(winHistory[7])
            # Add the average  temp, wind, precip, humidity from th game data
            # TODO: Verify if there are any null cases to look for.
            temp = winHistory[9]
            wind = winHistory[10]
            precip = winHistory[11]
            humidity = winHistory[10]
            # if '-' in temp:
            #     temp = -1
            #     currentWeight = currentWeight - .15
            if wind is None:
                wind = -1
                currentWeight = currentWeight - 1
            if precip is None:
                precip = -1
                currentWeight = currentWeight - 1
            # if '-' in humidity:
            #     humidity = -1
            #     currentWeight = currentWeight - .1

            gameEntry.append(wind)
            # gameEntry.append(precip)
            gameHistory.append(gameEntry)
            sampleWeights.append(currentWeight)

    return gameHistory


def getTeamStats(teamId):
    gameHistory = []
    sqlGames = getAllStatsForTeam(teamId)
    for row in sqlGames:
        currentWeight = baseWeight
        # Add the team completion%, hold%, blocks. Verified that there are no null values in DB first
        gameEntry = [float(row[2]), float(row[6]),  float(row[10])]
        winHistory = getGame(row[0])
        if winHistory is not None:
            # Check to see if it is away or home team
            if teamId in winHistory[0][1]:
                if int(winHistory[0][5]) - int(winHistory[0][6]) > 0:
                    # Append that they won
                    gameEntry.append(1)
                else:
                    # Append the team lost
                    gameEntry.append(-1)
            else:
                if int(winHistory[0][6]) - int(winHistory[0][5]) > 0:
                    # Append the team won
                    gameEntry.append(1)
                else:
                    # Append the team lost
                    gameEntry.append(-1)
            # Add the average  temp, wind, precip, humidity from th game data
            # TODO: Verify if there are any null cases to look for.
            temp = winHistory[0][7]
            wind = winHistory[0][8]
            precip = winHistory[0][9]
            humidity = winHistory[0][10]
            # if '-' in temp:
            #     temp = -1
            #     currentWeight = currentWeight - .15
            if '-' in wind:
                wind = -1
                currentWeight = currentWeight - 1
            if '-' in precip:
                precip = -1
                currentWeight = currentWeight - 1
            # if '-' in humidity:
            #     humidity = -1
            #     currentWeight = currentWeight - .1

            gameEntry.append(wind)
            # gameEntry.append(precip)
            gameHistory.append(gameEntry)
            sampleWeights.append(currentWeight)

    return gameHistory





def stringOfTeamId(array, total, teamId):
    for x in range(total):
        array.append(teamId)
    return array


def combineArrays(teamOne, teamTwo):
    combined = []
    for x in teamOne:
        combined.append(x)
    for x in teamTwo:
        combined.append(x)
    return combined


def getStatAverage(teamId):
    teamStats = getTeam(teamId)

    formattedResult = []
    if teamStats is not None:
        # Add the team completion%, hold%, break%, turnovers, blocks. Verified that there are no null values in DB first
        completion = float(teamStats[5])
        if completion is None:
            completion = .5
        hold = float(teamStats[6])
        if hold is None:
            hold = .5
        breakPercentage = float(teamStats[7])
        if breakPercentage is None:
            breakPercentage = .5
        turnovers = float(teamStats[9])
        if turnovers is None:
            turnovers = 0
        blocks = float(teamStats[10])
        if blocks is None:
            blocks = 0
        gamesPlayed = teamStats[4]
        if gamesPlayed <= 0:
            gamesPlayed = 1
        scoresFor = teamStats[12]
        if scoresFor < 0:
            scoresFor = 0
        formattedResult = [float(scoresFor / gamesPlayed)]
    else:
        formattedResult = [.5, .5, .5]
    #   Append a 1 for as a 'win' since that is what we are checking for
    # formattedResult.append(1)
    return formattedResult


def appendWeatherStats(stats, temp, wind, precip, humidity):
    formattedStats = stats
    # formattedStats.append(temp)
    formattedStats.append(wind)
    # formattedStats.append(precip)
    # formattedStats.append(humidity)
    return formattedStats


def beforeDate(gameDateOne, gameDateTwo):
    if gameDateOne[0] < gameDateTwo[0]:
        return True
    elif gameDateOne[0] == gameDateTwo[0]:
        if gameDateOne[1] < gameDateTwo[1]:
            return True
        elif gameDateOne[1] == gameDateTwo[1]:
            if gameDateOne[2] < gameDateTwo[2]:
                return True
    return False


def moreRecent(gameOne, gameTwo):
    if beforeDate(gameOne[0].split('-'), gameTwo[0].split('-')):
        return gameTwo
    return gameOne


def getTeamPlayersBeforeGame(teamID, gameID):
    gameList = getGameFromTeamID(teamID)
    gameIdDate = gameID.split('-')
    if gameList is None or len(gameList) == 0:
        return None
    selectedGame = gameList[0]
    for game in gameList:
        selectedGameDate = selectedGame[0].split('-')
        gameDate = game[0].split('-')
        if not beforeDate(selectedGameDate, gameIdDate):
            selectedGame = game
        if beforeDate(gameDate, gameIdDate):
            selectedGame = moreRecent(game, selectedGame)
    awayGame = True
    if selectedGame[2] == teamID:
        awayGame = False
    return getTeamRoster(selectedGame, awayGame)

def getTeamPlayers(teamID):
    gameList = getGameFromTeamID(teamID)
    if gameList is None or len(gameList) == 0:
        return None
    selectedGame = gameList[0]
    for game in gameList:
        selectedGame = moreRecent(game, selectedGame)
    awayGame = True
    if selectedGame[2] == teamID:
        awayGame = False
    return getTeamRoster(selectedGame, awayGame)


def getTeamRoster(gameID, away):
    queries = getTeamGameRoster(gameID, away)
    teamIdList = []
    for x in queries:
        teamIdList.append(x[1])
    return teamIdList


# teamOne: teamOne id from database to use.
# teamTwo: teamTwo id from database to use.
# temperature: average temperature to use for predicted game.
# windSpeed: average wind speed to use for predicted game.
# precipitation: average precipitation to use for predicted game.
# humidity: average humidity to use for predicted game.
def predict(teamOne, teamTwo, temperature, windSpeed, precipitation, humidity):
    sampleWeights = []
    teamOneStats = getTeamStats(teamOne)
    teamTwoStats = getTeamStats(teamTwo)

    if len(teamOneStats) == 0 or len(teamTwoStats) == 0:
        return predictByPlayers(getTeamPlayers(teamOne), getTeamPlayers(teamTwo), temperature, windSpeed, precipitation,
                                humidity)
    print(teamOneStats)


    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamTargets = stringOfTeamId([], len(teamOneStats), teamOne)
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats), teamTwo)
    machine = svm.SVC(kernel="linear", C=1, probability=True)
    machine.fit(teamStats, teamTargets, sample_weight=sampleWeights)

    teamOneSeasonAverage = getStatAverage(teamOne)
    teamOneSeasonAverage = appendWeatherStats(teamOneSeasonAverage, formattedTemp, formattedWind, formattedPrecip,
                                              formattedHumidity)
    teamTwoSeasonAverage = getStatAverage(teamTwo)
    teamTwoSeasonAverage = appendWeatherStats(teamTwoSeasonAverage, formattedTemp, formattedWind, formattedPrecip,
                                              formattedHumidity)
    toPredict = [teamOneSeasonAverage, teamTwoSeasonAverage]
    result = machine.predict_proba(toPredict).tolist()
    return result


def predictPriorToGame(teamOne, teamTwo, temperature, windSpeed, precipitation, humidity, game):
    prediction = predictByPlayers(getTeamPlayersBeforeGame(teamOne, game), getTeamPlayersBeforeGame(teamTwo, game), temperature, windSpeed,
                                  precipitation,
                                  humidity)

    if prediction["winning-team"] is not None:
        if prediction["winning-team"] == "team-one":
            prediction["winning-team"] = teamOne
        else:
            prediction["winning-team"] = teamTwo

    return prediction

def predictPlayerBased(teamOne, teamTwo, temperature, windSpeed, precipitation, humidity):
    prediction = predictByPlayers(getTeamPlayers(teamOne), getTeamPlayers(teamTwo), temperature, windSpeed, precipitation,
                                humidity)

    if prediction["winning-team"] is not None:
        if prediction["winning-team"] == "team-one":
            prediction["winning-team"] = teamOne
        else:
            prediction["winning-team"] = teamTwo

    return prediction