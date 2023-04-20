from sklearn import svm

from prediction_api.ml_connector import getAllStatsForPlayer, getGame, getPlayer, getAllPlayersStats

baseWeight = 5
sampleWeights = []


def getPlayerStats(playerList):
    records = []
    entries = []
    playerTuple = tuple(playerList)
    playersStats = getAllPlayersStats(playerTuple)

    # Loop through each of the filtered games and put the details into the array
    for playerRow in playersStats:
        nextRecord = []
        # Store the value if the player was on the away team or home team
        home = playerRow["isHome"]
        # Get the record of the game for the weather stats
        recordWeight = baseWeight
        if home == 0:
            if playerRow["awayScore"] < playerRow["homeScore"]:
                continue
        else:
            if playerRow["awayScore"] > playerRow["homeScore"]:
                continue
            # Append goals
            nextRecord.append(playerRow["goals"])
            # Append assists
            # nextRecord.append(game[4])
            # Append completions
            # nextRecord.append(game[7])

            # Weather data appending
            temp = playerRow["temp"]
            wind = playerRow["wind"]
            precip = playerRow["precip"]
            humid = playerRow["humid"]

            # Error checking
            if None == temp:
                temp = -1
                recordWeight -= 0
            if None == wind:
                wind = -1
                recordWeight -= 1
            if None == precip:
                precip = -1
                recordWeight -= 0
            if None == humid:
                humid = -1
                recordWeight -= 0

            nextRecord.append(temp)
            nextRecord.append(wind)
            # nextRecord.append(precip)
            # nextRecord.append(humid)
            entry = [playerRow["gameID"]] + nextRecord
            entries.append(entry)
            records.append(nextRecord)
            sampleWeights.append(recordWeight)

    return [records, entries]


def getPlayerStatsFiltered(playerList, game):
    records = []
    entries = []
    playerTuple = tuple(playerList)
    playersStats = getAllPlayersStats(playerTuple)
    gameStatsFiltered = []

    for row in playersStats:
        gameDate = row["gameID"]
        if beforeDate(gameDate, game[0]):
            gameStatsFiltered.append(row)
    # Loop through each of the filtered games and put the details into the array
    for playerRow in gameStatsFiltered:
        nextRecord = []
        # Store the value if the player was on the away team or home team
        home = playerRow["isHome"]
        # Get the record of the game for the weather stats
        recordWeight = baseWeight
        if home == 0:
            if playerRow["awayScore"] < playerRow["homeScore"]:
                continue
        else:
            if playerRow["awayScore"] > playerRow["homeScore"]:
                continue
            # Append goals
            nextRecord.append(playerRow["goals"])
            # Append assists
            # nextRecord.append(game[4])
            # Append completions
            # nextRecord.append(game[7])

            # Weather data appending
            temp = playerRow["temp"]
            wind = playerRow["wind"]
            precip = playerRow["precip"]
            humid = playerRow["humid"]

            # Error checking
            if None == temp:
                temp = -1
                recordWeight -= 0
            if None == wind:
                wind = -1
                recordWeight -= 1
            if None == precip:
                precip = -1
                recordWeight -= 0
            if None == humid:
                humid = -1
                recordWeight -= 0

            nextRecord.append(temp)
            nextRecord.append(wind)
            # nextRecord.append(precip)
            # nextRecord.append(humid)
            entry = [playerRow["gameID"]] + nextRecord
            entries.append(entry)
            records.append(nextRecord)
            sampleWeights.append(recordWeight)

    return [records, entries]


def getAverageStats(playerList):
    averageStats = [0.0]
    removed = 0
    for player in playerList:
        stats = getPlayer(player)
        if stats is not None and stats[8] > 0:
            averageStats[0] += stats[5] / stats[8]
            # averageStats[1] += stats[6] / stats[8]
            # averageStats[2] += stats[4] / stats[8]
        else:
            removed += 1

    for idx in range(len(averageStats)):
        averageStats[idx] /= (len(playerList) - removed)
    return averageStats


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


def appendWeatherStats(stats, temp, wind, precip, humidity):
    formattedStats = stats
    formattedStats.append(temp)
    formattedStats.append(wind)
    # formattedStats.append(precip)
    # formattedStats.append(humidity)
    return formattedStats


def beforeDate(gameOne, gameTwo):
    gameDateOne = gameOne.split('-')
    gameDateTwo = gameTwo.split('-')
    if gameDateOne[0] < gameDateTwo[0]:
        return True
    elif gameDateOne[0] == gameDateTwo[0]:
        if gameDateOne[1] < gameDateTwo[1]:
            return True
        elif gameDateOne[1] == gameDateTwo[1]:
            if gameDateOne[2] < gameDateTwo[2]:
                return True
    return False


def predictByPlayers(teamOnePlayers, teamTwoPlayers, temperature, windSpeed, precipitation, humidity):
    statsUsed = ["completion percentage", "hold percentage", "break percentage", "wind", "precipitation"]
    sampleWeights = []
    if len(teamOnePlayers) < 1 or len(teamTwoPlayers) < 1:
        return {
        "winning-team": None,
        "winning-team-percent": None,
        "team-one-stats": None,
        "team-two-stats": None,
        "stats-used": None
    }
    teamOneStats = getPlayerStats(teamOnePlayers)
    teamOneArray = teamOneStats[1]
    teamTwoStats = getPlayerStats(teamTwoPlayers)
    teamTwoArray = teamTwoStats[1]

    if len(teamOneStats[0]) == 0 or len(teamTwoStats[0]) == 0:
        return {
            "winning-team": None,
            "winning-team-percent": None,
            "team-one-stats": None,
            "team-two-stats": None,
            "stats-used": None
        }

    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats[0], teamTwoStats[0])
    teamTargets = stringOfTeamId([], len(teamOneStats[0]), 'teamOne')
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats[0]), 'teamTwo')
    machine = svm.SVC(kernel="linear", C=1, probability=True)
    machine.fit(teamStats, teamTargets, sample_weight=sampleWeights)

    teamOneAverage = getAverageStats(teamOnePlayers)
    teamOneAverage = appendWeatherStats(teamOneAverage, formattedTemp, formattedWind, formattedPrecip,
                                        formattedHumidity)
    teamTwoAverage = getAverageStats(teamTwoPlayers)
    teamTwoAverage = appendWeatherStats(teamTwoAverage, formattedTemp, formattedWind, formattedPrecip,
                                        formattedHumidity)
    toPredict = [teamOneAverage, teamTwoAverage]
    result = machine.predict_proba(toPredict).tolist()
    adjusted = [(float(result[0][0] + result[1][0]) / 2), (float(result[0][1] + result[1][1]) / 2)]

    if adjusted[0] > adjusted[1]:
        winningTeam = "team-one"
    else:
        winningTeam = "team-two"

    dictionary = {
        "winning-team": winningTeam,
        "winning-team-percent": max(adjusted[0], adjusted[1]),
        "team-one-stats": teamOneArray,
        "team-two-stats": teamTwoArray,
        "stats-used": statsUsed
    }
    return dictionary


def predictByPlayersPriorToGame(teamOnePlayers, teamTwoPlayers, temperature, windSpeed, precipitation, humidity, game):
    statsUsed = ["Goals", "Wind"]
    sampleWeights = []
    if len(teamOnePlayers) < 1 or len(teamTwoPlayers) < 1:
        return {
            "winning-team": None,
            "winning-team-percent": None,
            "team-one-stats": None,
            "team-two-stats": None,
            "stats-used": None
        }
    teamOneStats = getPlayerStatsFiltered(teamOnePlayers, game)
    teamOneArray = teamOneStats[1]
    teamTwoStats = getPlayerStatsFiltered(teamTwoPlayers, game)
    teamTwoArray = teamTwoStats[1]

    if len(teamOneStats[0]) == 0 or len(teamTwoStats[0]) == 0:
        return {
            "winning-team": None,
            "winning-team-percent": None,
            "team-one-stats": None,
            "team-two-stats": None,
            "stats-used": None
        }

    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats[0], teamTwoStats[0])
    teamTargets = stringOfTeamId([], len(teamOneStats[0]), 'teamOne')
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats[0]), 'teamTwo')
    machine = svm.SVC(kernel="linear", C=1, probability=True)
    machine.fit(teamStats, teamTargets, sample_weight=sampleWeights)

    teamOneAverage = getAverageStats(teamOnePlayers)
    teamOneAverage = appendWeatherStats(teamOneAverage, formattedTemp, formattedWind, formattedPrecip,
                                        formattedHumidity)
    teamTwoAverage = getAverageStats(teamTwoPlayers)
    teamTwoAverage = appendWeatherStats(teamTwoAverage, formattedTemp, formattedWind, formattedPrecip,
                                        formattedHumidity)
    toPredict = [teamOneAverage, teamTwoAverage]
    result = machine.predict_proba(toPredict).tolist()
    adjusted = [(float(result[0][0] + result[1][0]) / 2), (float(result[0][1] + result[1][1]) / 2)]

    if adjusted[0] > adjusted[1]:
        winningTeam = "team-one"
    else:
        winningTeam = "team-two"

    dictionary = {
        "winning-team": winningTeam,
        "winning-team-percent": max(adjusted[0], adjusted[1]),
        "team-one-stats": teamOneArray,
        "team-two-stats": teamTwoArray,
        "stats-used": statsUsed
    }
    return dictionary
