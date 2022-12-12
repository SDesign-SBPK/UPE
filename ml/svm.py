from sklearn import svm
from flask import jsonify

from database.ml_connector import getAllStatsForTeam, getGame


def getTeamStats(teamId):
    gameHistory = []
    sqlGames = getAllStatsForTeam(teamId)
    for row in sqlGames:
        gameEntry = [float(row[2])]
        winHistory = getGame(row[0])
        if winHistory is not None:
            # Check to see if it is away or home team
            if teamId in winHistory[0][1]:
                if int(winHistory[0][5]) - int(winHistory[0][6]) > 0:
                    gameEntry.append(1)
                else:
                    gameEntry.append(-1)
            else:
                if int(winHistory[0][6]) - int(winHistory[0][5]) > 0:
                    gameEntry.append(1)
                else:
                    gameEntry.append(-1)
        else:
            gameEntry.append(0)
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
    print(teamOne)
    print(teamTwo)
    for row in teamTwo:
        teamOne.append(row)
    return teamOne


# This method should at least fit the model.
def predict(id1, id2):
    teamOneStats = getTeamStats(id1)
    teamTwoStats = getTeamStats(id2)

    teamStats = combineArrays(teamOneStats, teamTwoStats)
    teamOneTargets = stringOfTeamId([], len(teamOneStats), id1)
    totalTeamTargets = stringOfTeamId(teamOneTargets, len(teamTwoStats), id2)

    print(teamStats)
    print(teamOneTargets)
    print(totalTeamTargets)

    # machine = svm.SVC(kernel="linear", C=1)
    # machine.fit(teamStats, totalTeamTargets)

    result = 0
    return result

#
# #This method is just for reference and testing
# def predict():
#     # Teams Union and Flyers stats. This will eventually change to take team parameters and use those to pull data from the server.
#     teamStats = [[0.389], [0.576], [0.568], [0.647], [0.583], [0.595], [0.519], [0.605], [0.468], [0.511], [0.533],
#                  [0.512], [0.583], [0.533], [0.703],
#                  [0.421], [0.524], [0.551], [0.645], [0.529], [0.605], [0.550], [0.605], [0.488], [0.591], [0.529],
#                  [0.519], [0.571], [0.594], [0.533]]
#     targets = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
#                3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
#     machine = svm.SVC(kernel="linear", C=1)
#     machine.fit(teamStats, targets)
#     result = machine.predict([[0.6]])
#     print(result)


predict('empire', 'dragons')
