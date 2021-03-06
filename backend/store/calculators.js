var express = require('express');
var shortid = require('shortid');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var hash = require('bcryptjs');
var otplib = require('otplib').default;
var jwt = require('jwt-simple');
require('../routes/passportJs')(passport);
var sqlQuery = require('../database/sqlWrapper');
var fs = require('fs');
var moment = require('moment')
let _ = require("underscore");
var sql_wrapper = require('../database/sqlWrapper');
var store = require('../store/store')
var multer  = require('multer')
var fs = require('fs');
var path = require('path');
var rethinkOps = require('../store/rethinkOps');
var thumbler = require('video-thumb');
var ffmpeg = require('fluent-ffmpeg');
var child_process = require('child_process')

var S01C05CALC001 = require('../store/S01C05CALC001');
var S01C05CALC002 = require('../store/S01C05CALC002');
var S01C05CALC003 = require('../store/S01C05CALC003');
var S01C05CALC004 = require('../store/S01C05CALC004');
var S01C05CALC005 = require('../store/S01C05CALC005');
var S01C05CALC006 = require('../store/S01C05CALC005');

var calculators = [
	//Subject 1
	[	//Chapter 1 
		[],
		//Chapter 2
		[],
		//Chapter 3
		[],
		//Chapter 4
		[],
		//Chapter 5
		[	//Calculator 1
			{
				"number" : "01",
				"calculator_id" : "S01C05CALC001",
				"name" : "Annual depreciation amount - Straight line method",
				"inputs": 	[
								{"label": "Cost of the asset", "unit": "₹", "key":"cost_of_asset"},
								{"label": "Scrap value / Salvage value", "unit": "₹", "key": "scrap_value"},
								{"label": "Useful life of the asset", "unit": "Years", "key": "useful_life_of_asset"}
						 	],
				"results": 	[
								"Total depreciation",
								"Annual depreciation amount - SLM",
								"Annual rate of depreciation - SLM",
								"Depreciation schedule - table, graph, timeline"
							],
				"tooltips": [
								`The total amount spent on purchasing the machinery or
								its acquisition including additional costs spent on installation, commissioning,
								etc.`,
								`Residual value or the value that the machinery could
								fetch after its useful life.`,
								`The total number of years over which the asset is expected to be
								used by the enterprise.`
							]
			},
			{
				"number" : "02",
				"calculator_id" : "S01C05CALC002",
				"name" : "Annual rate of Depreciation - Written down value method",
				"inputs": 	[
								{"label": "Cost of the asset", "unit": "₹", "key":"cost_of_asset"},
								{"label": "Scrap value / Salvage value", "unit": "₹", "key": "scrap_value"},
								{"label": "Useful life of the asset", "unit": "Years", "key": "useful_life_of_asset"}
						 	],
				"results": 	[
								"Total depreciation",
								"Annual rate of depreciation - WDV",
								"Depreciation schedule - table, graph, timeline"
							],
				"tooltips": [
								`The total amount spent on purchasing the machinery or
								its acquisition including additional costs spent on installation, commissioning,
								etc.`,
								`Residual value or the value that the machinery could
								fetch after its useful life.`,
								`The total number of years over which the asset is expected to be
								used by the enterprise.`
							]
			},
			{
				"number" : "03",
				"calculator_id" : "S01C05CALC003",
				"name" : "Annual depreciation amount - Sum of Years' Digits method",
				"inputs": 	[
								{"label": "Cost of the asset", "unit": "₹", "key":"cost_of_asset"},
								{"label": "Scrap value / Salvage value", "unit": "₹", "key": "scrap_value"},
								{"label": "Useful life of the asset", "unit": "Years", "key": "useful_life_of_asset"}
						 	],
				"results": 	[
								"Total depreciable amount",
								"Sum of Years' Digits",
								"Depreciation schedule - table, graph, timeline"
							],
				"tooltips": [
								`The total amount spent on purchasing the machinery or
								its acquisition including additional costs spent on installation, commissioning,
								etc.`,
								`Residual value or the value that the machinery could
								fetch after its useful life.`,
								`The total number of years over which the asset is expected to be
								used by the enterprise.`
							]
			},
			{
				"number" : "04",
				"calculator_id" : "S01C05CALC004",
				"name" : "Annual depreciation amount - Annuity method",
				"inputs": 	[
								{"label": "Cost of the lease", "unit": "₹", "key":"cost_of_lease"},
								{"label": "Duration of lease", "unit": "Years", "key": "duration_of_lease"},
								{"label": "Rate of Interest on Investment", "unit": "%", "key": "roi_on_investment"}
						 	],
				"results": 	[
								"Annual Depreciation Amount",
								"Depreciation schedule - table, graph, timeline"
							],
				"tooltips": [
								`The total amount spent on purchasing the lease or on
								acquisition of the lease contract including any additional costs`,
								`The total number of years of the lease`,
								`The percentage of interest considered to be charged and
								written off on the lease.`
							]
			},
			{
				"number" : "05",
				"calculator_id" : "S01C05CALC005",
				"name" : "Hourly & Annual depreciation amounts - Machine Hour method",
				"inputs": 	[
								{"label": "Cost of the machinery", "unit": "₹", "key":"cost_of_machinery"},
								{"label": "Scrap Value/Salvage Value", "unit": "₹", "key": "scrap_value"},
								{"label": "Estimated total working capacity", "unit": "Hours", "key": "estimated_working_capacity"},
								{"label": "Annual Machinery Usage", "unit": "Hours", "key": "annual_machinery_usage", "array": true, "button_name": "Add Year", "column_name": "Year"}
						 	],
				"results": 	[
								"Total depreciable amount",
								"Depreciation per hour",
								"Annual Depreciation Amount",
								"Depreciation schedule - table, graph, timeline"
							],
				"tooltips": [
								`The total amount spent on purchasing the machinery or
								its acquisition including additional costs spent on installation, commissioning,
								etc.`,
								`Residual value or the value that the machinery could
								fetch after its useful life`,
								`The total number of hours for which the machinery can
								be expected to run efficiently`
							]
			},
			{
				"number" : "06",
				"calculator_id" : "S01C05CALC006",
				"name" : "Accounts generator - Straight Line Method(SLM)",
				"inputs": 	[
								{	"label": "Select the asset to be depreciated", 
									"unit": null, 
									"key": "asset_to_be_depreciated", 
									"dropdown": true, 
									"button_name": "Select an asset", 
									"options": [
										"Machinery",
										"Plant",
										"Building",
										"Vehicle",
										"Furniture",
										"Plant and Machinery",
										"Create custom asset"
									],
									"disable": true,
									"display": 'flex'
								},
								{
									"label" : "Name of the asset",
									"unit": null,
									"key": "name_of_the_asset",
									"button_name": "", 
									"dropdown": false,
									"extra": true, 
									"options": [],
									"disable": false,
									"display": 'none',
								},
								{	"label": "Date of closing books of accounts", 
									"unit": null, 
									"key": "closing_date", 
									"dropdown": true, 
									"button_name": "Select date of closing books", 
									"options": [
										"31st December",
										"31st March"
									],
									"disable": true,
									"display": 'flex'
								}
						 	],
				"results": 	[
								"Total depreciable amount",
								"Depreciation per hour",
								"Annual Depreciation Amount",
								"Depreciation schedule - table, graph, timeline"
							],
				"tooltips": [
								`The total amount spent on purchasing the machinery or
								its acquisition including additional costs spent on installation, commissioning,
								etc.`,
								`Residual value or the value that the machinery could
								fetch after its useful life`,
								`The total number of hours for which the machinery can
								be expected to run efficiently`
							]
			}
		],
		//Chapter 6
		[],
		//Chapter 7
		[],
		//Chapter 8
		[],
		//Chapter 9
		[],
		//Chapter 10
		[],
		//Chapter 11
		[]
	],
	//Subject 2
	[],
	//Subject 3
	[],
	//Subject 4
	[],
]

var getResults = (calculators_id, input_object)=>{
	return new Promise((resolve, reject)=>{
		if(calculators_id == "S01C05CALC001"){
			S01C05CALC001.calculator(input_object).then((result)=>{
				resolve(result)
			}).catch((err)=>{
				reject(err)
			})
		}else if(calculators_id == "S01C05CALC002"){
			S01C05CALC002.calculator(input_object).then((result)=>{
				resolve(result)
			}).catch((err)=>{
				reject(err)
			})
		}else if(calculators_id == "S01C05CALC003"){
			S01C05CALC003.calculator(input_object).then((result)=>{
				resolve(result)
			}).catch((err)=>{
				reject(err)
			})
		}else if(calculators_id == "S01C05CALC004"){
			S01C05CALC004.calculator(input_object).then((result)=>{
				resolve(result)
			}).catch((err)=>{
				reject(err)
			})
		}else if(calculators_id == "S01C05CALC005"){
			console.log(input_object)
			S01C05CALC005.calculator(input_object).then((result)=>{
				resolve(result)
			}).catch((err)=>{
				reject(err)
			})
		}
	})
}

var getCalculatorDetails = ()=>{
	return new Promise((resolve, reject)=>{
		resolve(calculators)		
	})
}


module.exports = {
	getResults: getResults,
	getCalculatorDetails: getCalculatorDetails
}