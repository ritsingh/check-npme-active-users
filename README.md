# check-npme-active-users

The script lists the name and total count of active users for specified time interval with parameter such as year, month, week and day.

## Usage:

* Download or clone the repo.
* cd check-npme-active-users
npm install

**Default command this will print the list of active user for current day.**
* node index.js

* Run command node index.js --help/-h
		**or**
node index.js --duration/-d --help/-h

**To print the list and count of active users for day, week, month and year.**

**Run the command below:**

* node index.js [—duration/-d] [option]

**Option:**

* day	**Display active users for today**
* week	**Display active user in current week**
* month **Display active user in current month**
* year 	**Display active user in current year**


