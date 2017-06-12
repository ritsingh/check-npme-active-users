#!/usr/bin/env node

var client = require('redis').createClient('redis://172.17.0.1:6379')
var moment = require('moment');


const user = 'analytics:users';
const type = 'WITHSCORES';
const options = ['--duration', '-d','--help','-h', 'year', 'month', 'week',  'day'];
var errMessage = "";



    startScript();

    function startScript() {

        var paramLength = process.argv.length;

        var positionalParam1 = process.argv[2] ? validateParams(process.argv[2], options): "";

        var positionalParam2 = process.argv[3] ? validateParams(process.argv[3], options): "";


        switch (paramLength)
        {
            case 2:
                getActiveUser((moment().subtract('1', 'day')).valueOf(), function (err, result) {
                    printResult(err,result, 'day');
                });
                break;
            case 3:
                if (positionalParam1 == '-h' || positionalParam1 == '--help') {
                    console.log('Usage: node [index.js] [--duration] [options]');
                    process.exit(-1);
                }
                else {
                    console.log('The command you supplied is incorrect\nUsage: node [index.js] [--duration] [options]');
                    process.exit(-1)
                }
                break;
            case 4:
                if (positionalParam2 == '-h' || positionalParam2 == '--help') {
                    console.log('Options:\n'
                        + 'day             Display active users for today\n'
                        + 'week            Display active user in current week\n'
                        + 'month           Display active user in current month\n'
                        + 'year            Display active user in current year'
                    );
                    process.exit(-1);
                }

                switch (positionalParam2)
                {
                    case 'year':
                        getActiveUser((moment().startOf(positionalParam2)).valueOf(), function (err, result) {
                            printResult(err,result, positionalParam2);
                        });
                        break;
                    case 'month':
                        getActiveUser((moment().startOf('month')).valueOf(), function (err, result) {
                            printResult(err,result, positionalParam2);
                        });
                        break;
                    case 'week':
                        getActiveUser((moment().subtract('7', 'day')).valueOf(), function (err, result) {
                            printResult(err,result, positionalParam2);
                        });
                        break;
                    case 'day':
                        getActiveUser((moment().subtract('1', 'day')).valueOf(), function (err, result) {
                            printResult(err,result, positionalParam2);
                        });
                        break
                }
                break;
        }

    }

    function getActiveUser(period, callback) {
        client.zrangebyscore(user, period, (Date.now()).valueOf(), type, function (err, userscores) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            var result = [];


            for (var i = 0; i < userscores.length; i += 2) {
                result.push(userscores[i]);
            }
            callback(null, result);
        });
    }


    function validateParams(param, options) {
        if(options.indexOf(param) < 0) {
            errMessage = "Invalid argument supplied. For more details run 'node index.js --help'"
            console.log(errMessage);
            process.exit(-1);
        }
        else
            return param;
    }

    function printResult (err, result, param) {
        console.log('\n**********************************************');
        param != 'day' ?console.log("Active users in current "+ param) : console.log("List of active users for today.");
        if (err) {
            console.log('Error: ' + err);
        }
        else {
            console.log('---------------------------------------------');
            if (result.length == 0)
                console.log("-> No active users found.");
            else {
                result.forEach(function (name) {
                    console.log(name);
                });
            }
            console.log('---------------------------------------------');
            console.log('Active users count = '+result.length);
            console.log('\n**********************************************');
        }
        process.exit(-1);
    }

