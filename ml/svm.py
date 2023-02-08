from sklearn import svm

from database.ml_connector import getAllStatsForTeam, getGame, getTeam


def getTeamStats(teamId, yearStart, yearEnd):
    gameHistory = []
    sqlGames = getAllStatsForTeam(teamId)
    for row in sqlGames:
        skip = True
        for x in range(yearStart, yearEnd + 1):
            if str(x) in row[0]:
                skip = False

        if skip:
            continue
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
            if '-' in wind:
                wind = -1
            if '-' in precip:
                precip = -1
            if '-' in humidity:
                humidity = -1

            gameEntry.append(temp)
            gameEntry.append(wind)
            gameEntry.append(precip)
            gameEntry.append(humidity)
            gameHistory.append(gameEntry)

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
    formattedStats = stats;
    formattedStats.append(temp)
    formattedStats.append(wind)
    formattedStats.append(precip)
    formattedStats.append(humidity)
    return formattedStats


# teamOne: first team id that's used
# teamTwo: second team id that's used
# return: A 2-D array of games with the first using the average stats for the season of first team id for the first
# index followed by the second teams average stats
def predict(teamOne, teamTwo):
    return


# teamOne: teamOne id from database to use.
# teamTwo: teamTwo id from database to use.
# temperature: average temperature to use for predicted game.
# windSpeed: average wind speed to use for predicted game.
# precipitation: average precipitation to use for predicted game.
# humidity: average humidity to use for predicted game.
def predict(teamOne, teamTwo, temperature, windSpeed, precipitation, humidity):
    teamOneStats = getTeamStats(teamOne, 2014, 2022)
    teamTwoStats = getTeamStats(teamTwo, 2014, 2022)
    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamTargets = stringOfTeamId([], len(teamOneStats, teamOne))
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats), teamTwo)
    # TODO: Check if C=.5 is having any impact
    machine = svm.SVC(kernel="linear", C=.5, probability=True)
    machine.fit(teamStats, teamTargets)

    teamOneSeasonAverage = getStatAverage(teamOne)
    teamOneSeasonAverage = appendWeatherStats(teamOneSeasonAverage, formattedTemp, formattedWind, formattedPrecip,
                                              formattedHumidity)
    teamTwoSeasonAverage = getStatAverage(teamTwo)
    teamTwoSeasonAverage = appendWeatherStats(teamTwoSeasonAverage, formattedTemp, formattedWind, formattedPrecip,
                                              formattedHumidity)
    toPredict = [teamOneSeasonAverage, teamTwoSeasonAverage]

    return machine.predict(toPredict).tolist()


# teamOne: teamOne id from database to use.
# teamTwo: teamTwo id from database to use.
# yearStart: The first year to start pulling data from.
# yearEnd: The last year to pull data from. If this is the same as yearStart, it will use only that year.
# temperature: average temperature to use for predicted game.
# windSpeed: average wind speed to use for predicted game.
# precipitation: average precipitation to use for predicted game.
# humidity: average humidity to use for predicted game.
def predict(teamOne, teamTwo, yearStart, yearEnd, temperature, windSpeed, precipitation, humidity):
    teamOneStats = getTeamStats(teamOne, yearStart, yearEnd)
    teamTwoStats = getTeamStats(teamTwo, yearStart, yearEnd)
    formattedTemp = float(temperature)
    formattedWind = float(windSpeed)
    formattedPrecip = float(precipitation)
    formattedHumidity = float(humidity)
    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamTargets = stringOfTeamId([], len(teamOneStats), teamOne)
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats), teamTwo)
    machine = svm.SVC(kernel="linear", C=1, probability=True)
    machine.fit(teamStats, teamTargets)

    teamOneSeasonAverage = getStatAverage(teamOne)
    teamOneSeasonAverage = appendWeatherStats(teamOneSeasonAverage, formattedTemp, formattedWind, formattedPrecip,
                                              formattedHumidity)
    teamTwoSeasonAverage = getStatAverage(teamTwo)
    teamTwoSeasonAverage = appendWeatherStats(teamTwoSeasonAverage, formattedTemp, formattedWind, formattedPrecip,
                                              formattedHumidity)
    toPredict = [teamOneSeasonAverage, teamTwoSeasonAverage]

    return machine.predict(toPredict).tolist()

