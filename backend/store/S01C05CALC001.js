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
		let depreciation = result1/useful_life_of_asset
		console.log("depreciation", depreciation)
		let depreciation_rate = depreciation/cost_of_asset*100
		console.log("depreciation_rate", depreciation_rate)

		let result = [], stepwise = [], tables = []
		result.push({
			"label": `Total depreciation (over ${useful_life_of_asset} years)`,
			"value": result1.toFixed(2),
			"unit": "Rs."
		},{
			"label": `Annual depreciation amount`,
			"value": depreciation.toFixed(2),
			"unit": "Rs."
		},{
			"label": "Annual rate of depreciation (on cost)",
			"value": depreciation_rate.toFixed(2),
			"unit": "%"
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
		var table_values = [[1,cost_of_asset,depreciation,cost_of_asset-depreciation]]
		table += `<tr>
					<th>${table_values[0][0]}</th>
					<th>${table_values[0][1].toFixed(2)}</th>
					<th>${table_values[0][2].toFixed(2)}</th>
					<th>${table_values[0][3].toFixed(2)}</th>
				</tr>`

		for(var i=1;i<parseInt(useful_life_of_asset);i++){
			table_values.push(
				[i+1,table_values[i-1][1]-depreciation,depreciation,table_values[i-1][3]-depreciation])
			table += `<tr>
						<th>${table_values[i][0]}</th>
						<th>${table_values[i][1].toFixed(2)}</th>
						<th>${table_values[i][2].toFixed(2)}</th>
						<th>${table_values[i][3].toFixed(2)}</th>
					</tr>`
		}

		table += `<tr>
						<th></th>
						<th></th>
						<th>${(depreciation*useful_life_of_asset).toFixed(2)}</th>
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
			"title": "Annual Depreciation Amount",
			"explanation" : [
				"Formula for Annual Depreciation amount under Straight Line Method (SLM)",
				"Substituting all values into the Formula, we get",
				"Simplifying the above equation, we get",
				null
			],
			"content": [
				"$$ \\text{Depreciation} = \\frac{\\text{Cost of asset}-\\text{Scrap Value}}{\\text{Useful life}} $$",
				"$$ \\text{Depreciation} = \\frac{"+cost_of_asset+"-"+scrap_value+"}{"+useful_life_of_asset+"} $$",
				"$$ \\text{Depreciation} = \\frac{"+cost_of_asset+"-"+scrap_value+"}{"+useful_life_of_asset+"}=₹"+depreciation+" $$",
				"A depreciation of ₹"+depreciation+" is charged every year on the asset for "+useful_life_of_asset+" years, until it reaches a scrap value of ₹"+scrap_value
			],
			"detailed_explanation": [
				null,
				null,
				[{
					"page_number": 1,
					"content": [
						"$$ \\text{Depreciation} = \\frac{"+cost_of_asset+"-"+scrap_value+"}{"+useful_life_of_asset+"} $$",
						"$$ \\text{Depreciation} = \\frac{"+cost_of_asset+"-"+scrap_value+"}{"+useful_life_of_asset+"}=₹"+depreciation+" $$",
					],
					"explanation":`The numerator indicates that the value of the asset reduces from ₹${cost_of_asset} to ₹${scrap_value}. That is, the total reduction (depreciation) in the asset's value is ₹${depreciation} over a period of ${useful_life_of_asset} years.`
				},{
					"page_number": 2,
					"content": [
						"Since depreciation is an \"Annual Charge\", the total depreciation of an asset must be divided among all years of usage.",
						"$$ \\text{Depreciation} = \\frac{"+cost_of_asset+"-"+scrap_value+"}{"+useful_life_of_asset+"}="+depreciation+" $$"
					],
					"explanation": `Since the asset will be used for ${useful_life_of_asset} years, the total depreciation of ₹${depreciation} must be divided among all ${useful_life_of_asset} years`
				}],
				null,
			]
		})

		stepwise.push({
			"number": 2,
			"title": "Annual Rate of Depreciation",
			"explanation": [
				"The amount of depreciation has to be measured in terms of the cost of the asset. Therefore,",
				null
			],
			"content": [
				"$$ \\text{Depreciation Rate} = \\frac{"+depreciation+"}{"+cost_of_asset+"} * 100 = "+depreciation_rate+"$$",
				`Depreciation of ${depreciation_rate}% is charged on the cost of the asset every year`
			],
			"detailed_explanation":[
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