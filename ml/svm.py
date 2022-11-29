from sklearn import svm

def getStats(teamId):
    return []

def predict(teamOneId, teamTwoId):
    teamOneStats = getStats(teamOneId)
    teamTwoStats = getStats(teamTwoId)

    teamStats = [teamOneStats[:], teamTwoStats[:]]
    teamTargets = []

    machine = svm.SVC(kernel="linear", C=1)
    machine.fit(teamStats, teamTargets)


    result = machine.predict()

def predict():
    #Teams Union and Flyers stats. This will eventually change to take team parameters and use those to pull data from the server.
    teamStats = [[0.389], [0.576], [0.568], [0.647], [0.583], [0.595], [0.519], [0.605], [0.468], [0.511], [0.533], [0.512], [0.583], [0.533], [0.703],
                 [0.421], [0.524], [0.551], [0.645], [0.529], [0.605], [0.550], [0.605], [0.488], [0.591], [0.529], [0.519], [0.571], [0.594], [0.533]]
    targets = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
               3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
    machine = svm.SVC(kernel="linear", C=1)
    machine.fit(teamStats, targets)
    result = machine.predict([[0.6]])
    print(result)


predict()
