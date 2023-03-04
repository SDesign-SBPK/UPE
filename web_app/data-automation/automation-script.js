const upcomingGamesScraper = require('../scrapers/player/upcoming-games-store.js');
const predict = require('../data-automation/upcoming-games-automation');
const cron = require('node-cron');
const schedule = require('node-schedule');

//schedule.scheduleJob('10 * * * * *', async () => upcomingGamesScraper.storeGamesOnPage);

schedule.scheduleJob('10 * * * * *', async () => predict.calculatePredictions);


/*cron.schedule('10 * * * * *', () => {
	console.log('Updating Upcoming Games at 23:00 EST');
	upcomingGamesScraper.storeGamesOnPage;
});8?

/*cron.schedule('15 * * * * *', () => {
	console.log('Calculating Predictions for Upcoming Games at 23:05 EST');
	dataAutomation.calculatePredictions
}); */