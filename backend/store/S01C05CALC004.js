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

var calculator = (input_object)=>{
	return new Promise((resolve, reject)=>{
		console.log(input_object)
		let input = JSON.parse(input_object)
		let input_array = []
		console.log(input, input.cost_of_lease)
		let cost_of_lease = parseFloat(input["cost_of_lease"])
		input_array.push({"key": "Cost of Lease", "unit": "₹", "value":cost_of_lease})
		console.log("cost_of_lease", cost_of_lease)

		let duration_of_lease = parseFloat(input.duration_of_lease)
		input_array.push({"key": "Duration of Lease (Years)", "unit": "", "value":duration_of_lease})

		let roi_on_investment = parseFloat(input.roi_on_investment)
		input_array.push({"key": "Rate of Intereset on Investment (%)", "value": roi_on_investment, "unit": ""})

		let a = 1 + (roi_on_investment/100)
		let b = 1 - duration_of_lease
		let denominator = (1 - Math.pow(a,b))/(roi_on_investment/100)
		let result1 = 1/denominator
		console.log(result1)
		let annual_depreciation = cost_of_lease*result1
		console.log("annual_depreciation", annual_depreciation)

		let result = [], stepwise = [], tables = []
		result.push({
			"label": "Rate of depreciation per Rs. 1 for "+duration_of_lease+" years @"+roi_on_investment+"% intereset",
			"value": result1.toFixed(2),
			"unit": "%"
		},{
			"label": `Annual depreciation amount`,
			"value": annual_depreciation.toFixed(2),
			"unit": "Rs."
		})

		var table = `<table class="result-table" cellspacing="0">
						<thead class="heading-cell">
							<tr>
								<th class="first-heading">Years</th>
								<th>Opening value of lease</th>
								<th>Intereset(${roi_on_investment}%)</th>
								<th>Value of lease before depreciation</th>
								<th>Depreciation</th>
								<th class="last-heading">Closing value of lease</th>
							<tr>
						</thead>
						<tbody class="value-cell">`
		var table_values = [[
							1,
							cost_of_lease,
							cost_of_lease*(roi_on_investment/100),
							cost_of_lease+(cost_of_lease*(roi_on_investment/100)),
							annual_depreciation,
							cost_of_lease+(cost_of_lease*(roi_on_investment/100)) - annual_depreciation
						]]
		table += `<tr>
					<th>${table_values[0][0]}</th>
					<th>${table_values[0][1].toFixed(2)}</th>
					<th>${table_values[0][2].toFixed(2)}</th>
					<th>${table_values[0][3].toFixed(2)}</th>
					<th>${table_values[0][4].toFixed(2)}</th>
					<th>${table_values[0][5].toFixed(2)}</th>
				</tr>`

		for(var i=1;i<parseInt(duration_of_lease);i++){
			table_values.push(
				[	i+1,
					table_values[i-1][5],
					table_values[i-1][5]*(roi_on_investment/100),
					table_values[i-1][5]+(table_values[i-1][5]*(roi_on_investment/100)),
					annual_depreciation,
					table_values[i-1][5]+(table_values[i-1][5]*(roi_on_investment/100))-annual_depreciation
				]
			)
			table += `<tr>
						<th>${table_values[i][0]}</th>
						<th>${table_values[i][1].toFixed(2)}</th>
						<th>${table_values[i][2].toFixed(2)}</th>
						<th>${table_values[i][3].toFixed(2)}</th>
						<th>${table_values[i][4].toFixed(2)}</th>
						<th>${table_values[i][5].toFixed(2)}</th>
					</tr>`
		}

		table += `<tr>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th>${(annual_depreciation*duration_of_lease).toFixed(2)}</th>
						<th></th>
					</tr>
		`

		table += `</tbody></table>`

		tables.push({
			"label": "Depreciation schedule for " + duration_of_lease + " years",
			"table": table
		})

		stepwise.push({
			"number": 1,
			"title": "Annual Depreciation Amount",
			"explanation" : [
				"The amount of depreciation per Rs.1 for "+duration_of_lease+ " years at "+roi_on_investment+"% intereset(found in annuity tables is)",
				"The annual depreciation amount for the lease is,"
			],
			"content": [
				"$$ \\text{Rs. " + result1.toFixed(2)+"} $$",
				"$$ \\text{"+cost_of_lease+"}*\\text{"+result1.toFixed(2)+"} = "+annual_depreciation.toFixed(2)+"$$",
			],
			"detailed_explanation": [
				null,
				null
			]
		})
		resolve({input: input_array, result: result, stepwise: stepwise, table:table})
	})
}

module.exports = {
	calculator: calculator
}