from sklearn import svm

from prediction_api.ml_connector import getAllStatsForPlayer, getGame, getPlayer

baseWeight = 1
sampleWeights = []
def getPlayerStats(playerList, yearStart, yearEnd):
    records = []
    for player in playerList:
        gameStats = getAllStatsForPlayer(player)
        gameStatsFiltered = []
        ## games filtered by years passed through
        for x in range(yearStart, yearEnd + 1):
            for y in gameStats:
                if str(x) in y[0]:
                    gameStatsFiltered.append(y)
        ## Loop through each of the filtered games and put the details into the array
        for game in gameStatsFiltered:
            nextRecord = []
            ##Store the value if the player was on the away team or home team
            away = game[2]
            ## Get the record of the game for the weather stats
            gameRecord = getGame(game[0])
            recordWeight = baseWeight
            if gameRecord is not None:
                if away:
                    if gameRecord[6] > gameRecord[7]:
                        nextRecord.append(1)
                    else:
                        nextRecord.append(0)
                else:
                    if gameRecord[7] > gameRecord[6]:
                        nextRecord.append(1)
                    else:
                        nextRecord.append(0)
                ## Append goals
                nextRecord.append(game[2])
                ## Append assists
                nextRecord.append(game[3])
                ## Append completions
                nextRecord.append(game[4])

                ## Weather data appending
                temp = gameRecord[7]
                wind = gameRecord[8]
                precip = gameRecord[9]
                humid = gameRecord[10]

                ## Error checking
                if None == temp:
                    temp = -1
                    recordWeight -= .1
                if None == wind:
                    wind = -1
                    recordWeight -= .25
                if None == precip:
                    precip = -1
                    recordWeight -= .25
                if None == humid:
                    humid = -1
                    recordWeight -= .1

                nextRecord.append(temp)
                nextRecord.append(wind)
                nextRecord.append(precip)
                nextRecord.append(humid)
                records.append(nextRecord)
                sampleWeights.append(recordWeight)

    return records

def getAverageStats(playerList):
    averageStats = [1, 0.0, 0.0, 0.0]
    for player in playerList:
        stats = getPlayer(player)
        if stats is not None:
            averageStats[1] += stats[5]
            averageStats[2] += stats[6]
            averageStats[3] += stats[4]
    for stat in averageStats:
        stat = (stat/len(playerList))
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
    formattedStats.append(precip)
    formattedStats.append(humidity)
    return formattedStats

def predictByPlayers(teamOnePlayers, teamTwoPlayers, temperature, windSpeed, precipitation, humidity):
    sampleWeights = []
    if len(teamOnePlayers) < 7 or len(teamTwoPlayers) < 7:
        return None
    teamOneStats = getPlayerStats(teamOnePlayers, 2014, 2022)
    teamTwoStats = getPlayerStats(teamTwoPlayers, 2014, 2022)
    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamTargets = stringOfTeamId([], len(teamOneStats), 'teamOne')
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats), 'teamTwo')
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
    return result
