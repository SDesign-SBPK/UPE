from sklearn import svm

from prediction_api.ml.player_svm import predictByPlayers
from prediction_api.ml_connector import getAllStatsForTeam, getGame, getTeam


baseWeight = 1
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
        gameEntry = [float(row[2]), float(row[6]), float(row[7]), float(row[9]), float(row[10])]
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
            if '-' in temp:
                temp = -1
                currentWeight = currentWeight - .15
            if '-' in wind:
                wind = -1
                currentWeight =  currentWeight - .2
            if '-' in precip:
                precip = -1
                currentWeight = currentWeight - .2
            if '-' in humidity:
                humidity = -1
                currentWeight = currentWeight - .1

            gameEntry.append(temp)
            gameEntry.append(wind)
            gameEntry.append(precip)
            gameEntry.append(humidity)
            gameHistory.append(gameEntry)
            sampleWeights.append(currentWeight)

    return gameHistory

def getTeamStats(teamId):
    gameHistory = []
    sqlGames = getAllStatsForTeam(teamId)
    for row in sqlGames:

        currentWeight = baseWeight
        # Add the team completion%, hold%, break%, turnovers, blocks. Verified that there are no null values in DB first
        gameEntry = [float(row[2]), float(row[6]), float(row[7]), float(row[9]), float(row[10])]
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
            if '-' in temp:
                temp = -1
                currentWeight = currentWeight - .15
            if '-' in wind:
                wind = -1
                currentWeight =  currentWeight - .2
            if '-' in precip:
                precip = -1
                currentWeight = currentWeight - .2
            if '-' in humidity:
                humidity = -1
                currentWeight = currentWeight - .1

            gameEntry.append(temp)
            gameEntry.append(wind)
            gameEntry.append(precip)
            gameEntry.append(humidity)
            gameHistory.append(gameEntry)
            sampleWeights.append(currentWeight)

    return gameHistory


def getStats():
    gameHistory = []
    for x in range(20):
        temp = []
        for y in range(2):
            temp.append(x)
        gameHistory.append(temp)
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
        completion = float(teamStats[5]);
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
        formattedResult = [completion, hold, breakPercentage, turnovers, blocks]
    else:
        print("No completion percentage to use for team")
        formattedResult = [.5, .5, .5, .5, 0, 0]
    #   Append a 1 for as a 'win' since that is what we are checking for
    formattedResult.append(1)
    return formattedResult


def appendWeatherStats(stats, temp, wind, precip, humidity):
    formattedStats = stats
    formattedStats.append(temp)
    formattedStats.append(wind)
    formattedStats.append(precip)
    formattedStats.append(humidity)
    return formattedStats

def getTeamPlayers(teamID):
    return

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
        return predictByPlayers(getTeamPlayers(teamOne), getTeamPlayers(teamTwo), temperature, windSpeed, precipitation, humidity)

    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamTargets = stringOfTeamId([], len(teamOneStats), teamOne)
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats), teamTwo)
    machine = svm.SVC(kernel="linear", C=1, probability=True, class_weight='balanced')
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
    sampleWeights = []
    teamOneStats = getTeamStatsFiltered(teamOne, game)
    teamTwoStats = getTeamStatsFiltered(teamTwo, game)

    if len(teamOneStats) == 0 or len(teamTwoStats) == 0:
        # return predictByPlayers(getTeamPlayers(teamOne), getTeamPlayers(teamTwo), temperature, windSpeed, precipitation, humidity)
        return

    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamTargets = stringOfTeamId([], len(teamOneStats), teamOne)
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats), teamTwo)
    machine = svm.SVC(kernel="linear", C=1, probability=True, class_weight='balanced')
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
