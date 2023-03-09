from sklearn import svm

from ml_connector import getAllStatsForTeam, getGame, getTeam


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
            gameHistory.append(gameEntry)
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
        formattedResult = [.5, .5, .5, .5, 0, 0]
    #   Append a 1 for as a 'win' since that is what we are checking for
    formattedResult.append(1)
    return formattedResult


# teamOne: teamOne id from database to use.
# teamTwo: teamTwo id from database to use.
def predict(teamOne, teamTwo):
    teamOneStats = getTeamStats(teamOne, 2014, 2022)
    teamTwoStats = getTeamStats(teamTwo, 2014, 2022)
    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamTargets = stringOfTeamId([], len(teamOneStats), teamOne)
    teamTargets = stringOfTeamId(teamTargets, len(teamTwoStats), teamTwo)
    machine = svm.SVC(kernel="linear", C=.5, probability=True)
    machine.fit(teamStats, teamTargets)

    teamOneSeasonAverage = getStatAverage(teamOne)
    teamTwoSeasonAverage = getStatAverage(teamTwo)

    toPredict = [teamOneSeasonAverage, teamTwoSeasonAverage]
    result = machine.predict_proba(toPredict).tolist()
    return result
