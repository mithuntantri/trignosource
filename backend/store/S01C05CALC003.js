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
		console.log(input, input.cost_of_asset)
		let cost_of_asset = parseFloat(input["cost_of_asset"])
		input_array.push({"key": "Cost of Asset", "unit": "₹", "value":cost_of_asset})
		console.log("cost_of_asset", cost_of_asset)

		let scrap_value = parseFloat(input.scrap_value)
		input_array.push({"key": "Scrap Value", "unit": "₹", "value":scrap_value})

		let useful_life_of_asset = parseFloat(input.useful_life_of_asset)
		input_array.push({"key": "Useful Asset of Life (Years)", "value": useful_life_of_asset, "unit": ""})

		let result1 = (cost_of_asset - scrap_value)
		console.log(result1)
		let depreciation = useful_life_of_asset*(useful_life_of_asset+1)/2
		console.log("depreciation", depreciation)
		let depreciation_rate = depreciation/cost_of_asset*100
		console.log("depreciation_rate", depreciation_rate)

		let result = [], stepwise = [], tables = []
		result.push({
			"label": `Total depreciable amount (over ${useful_life_of_asset} years)`,
			"value": result1.toFixed(2),
			"unit": "Rs."
		},{
			"label": `Sum of years' digits`,
			"value": depreciation.toFixed(2),
			"unit": "Rs."
		})

		var result3_table = `<table class="result-table" cellspacing="0">
						<thead class="heading-cell">
							<tr>
								<th class="first-heading">Years</th>
								<th>Total depreciable amount</th>
								<th>Remaining Useful life of asset</th>
								<th>Depreciation rate</th>
								<th class="last-heading">Annual Depreciation amount</th>
							<tr>
						</thead>
						<tbody class="value-cell">`

		var results_table_values = [[1,result1,useful_life_of_asset,useful_life_of_asset/depreciation, result1*useful_life_of_asset/depreciation]]
		result3_table += `<tr>
					<th>${results_table_values[0][0]}</th>
					<th>${results_table_values[0][1].toFixed(2)}</th>
					<th>${results_table_values[0][2]}</th>
					<th>${results_table_values[0][3].toFixed(2)}</th>
					<th>${results_table_values[0][4].toFixed(2)}</th>
				</tr>`
		var result3_table_sum = results_table_values[0][4].toFixed(2)
		for(var i=1;i<parseInt(useful_life_of_asset);i++){
			results_table_values.push(
				[
					i+1,
					result1,
					results_table_values[i-1][2]-1,
					(results_table_values[i-1][2]-1)/depreciation,
					result1*(results_table_values[i-1][2]-1)/depreciation
				]
			)
			result3_table_sum += results_table_values[i][4].toFixed(2)
			result3_table += `<tr>
						<th>${results_table_values[i][0]}</th>
						<th>${results_table_values[i][1].toFixed(2)}</th>
						<th>${results_table_values[i][2]}</th>
						<th>${results_table_values[i][3].toFixed(2)}</th>
						<th>${results_table_values[i][4].toFixed(2)}</th>
					</tr>`
		}

		result3_table_sum = parseFloat(result3_table_sum).toFixed(2)
		result3_table += `<tr>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th>${result3_table_sum}</th>
					</tr>
		`

		tables.push({
			"label": "Annual depreciation rates and amounts",
			"table": result3_table
		})

		var table = `<table class="result-table" cellspacing="0">
						<thead class="heading-cell">
							<tr>
								<th class="first-heading">Years</th>
								<th>Asset Opening Balance</th>
								<th>Depreciation</th>
								<th class="last-heading">Asset Closing Balance</th>
							<tr>
						</thead>
						<tbody class="value-cell">`
		var table_values = [[1,cost_of_asset,results_table_values[0][4],cost_of_asset-results_table_values[0][4]]]
		var table_sum = parseFloat(table_values[0][3])
		table += `<tr>
					<th>${table_values[0][0]}</th>
					<th>${table_values[0][1].toFixed(2)}</th>
					<th>${table_values[0][2].toFixed(2)}</th>
					<th>${table_values[0][3].toFixed(2)}</th>
				</tr>`

		for(var i=1;i<parseInt(useful_life_of_asset);i++){
			table_values.push(
				[
					i+1,
					table_values[i-1][3],
					results_table_values[i][4],
					table_values[i-1][3]-results_table_values[i][4]])
			table_sum += table_values[i][3]
			table += `<tr>
						<th>${table_values[i][0]}</th>
						<th>${table_values[i][1].toFixed(2)}</th>
						<th>${table_values[i][2].toFixed(2)}</th>
						<th>${table_values[i][3].toFixed(2)}</th>
					</tr>`
		}

		table_sum = parseFloat(table_sum).toFixed(2)

		table += `<tr>
						<th></th>
						<th></th>
						<th>${table_sum}</th>
						<th></th>
					</tr>
		`

		table += `</tbody></table>`

		tables.push({
			"label": "Depreciation schedule for " + useful_life_of_asset + " years",
			"table": table
		})

		stepwise.push({
			"number": 1,
			"title": "Total depreciable amount",
			"explanation" : [
				"Total depreciable amount is the total reduction in the asset's value throughout it's useful life, in other words, it is the difference between the cost and the scrap value of the asset",
				"Substituting all values into the Formula, we get",
			],
			"content": [
				"$$ \\text{Total depreciable amt} = \\text{Cost of asset}-\\text{Scrap Value} $$",
				"$$ \\text{Total depreciable amt} = \\text{"+cost_of_asset+"}-\\text{"+scrap_value+"} = "+result1.toFixed(2)+" $$",
			],
			"detailed_explanation": [
				null,
				null,
			]
		})

		var sum_of_years_text = `1`
		for(var i=1;i<useful_life_of_asset;i++){
			if(i<4){
				sum_of_years_text+=`+`+(i+1)
			}else{
				sum_of_years_text+=`.`
			}
		}
		if(useful_life_of_asset > 1){
			sum_of_years_text += `upto ${useful_life_of_asset}`
		}
		stepwise.push({
			"number": 2,
			"title": "Sum of years' digits",
			"explanation": [
				"The sum of years' digits is simply the total of the digits of all years from 1 to "+useful_life_of_asset+ ". This can be calculated as: ",
				"Or, the sum can also be calculated using the Formula for `sum of n terms` as follows:",
			],
			"content": [
				"$$ \\text{Sum of Years' digits} = \\text{"+sum_of_years_text+"} = "+depreciation.toFixed(2)+"$$",
				"$$ \\text{Sum of n terms} = \\frac{n(n+1)}{2} = \\frac{"+useful_life_of_asset+"("+useful_life_of_asset+"+1)}{2} = "+depreciation+" $$"
			],
			"detailed_explanation":[
				null,
				null
			]
		})

		stepwise.push({
			"number": 3,
			"title": "Annual depreciation amounts",
			"explanation": [
				"The depreciation amount of a particular year is found out by multiplying the depreciable amount by that year's depreciation rate which is nothing but the proportion of the remaining number of years of useful life to the total sum of years of useful life.",
			],
			"content": [
				result3_table
			],
			"detailed_explanation":[
				null,
			]
		})
		resolve({input: input_array, result: result, stepwise: stepwise, table:table})
	})
}

module.exports = {
	calculator: calculator
}