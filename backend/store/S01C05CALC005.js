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
		console.log(input, input.cost_of_machinery)
		let cost_of_machinery = parseFloat(input["cost_of_machinery"])
		if(isNaN(cost_of_machinery) || cost_of_machinery <= 0){
			reject({'position': 0,'error': 'The cost of the machinery cannot be Rs. 0.'})
		}
		input_array.push({"key": "Cost of the Machinery", "unit": "₹", "value":cost_of_machinery})
		console.log("cost_of_machinery", cost_of_machinery)

		let scrap_value = parseFloat(input.scrap_value)
		if(isNaN(scrap_value) || scrap_value >= cost_of_machinery){
			reject({'position': 1,'error': 'The scrap value cannot be greater than the cost of the asset'})
		}
		input_array.push({"key": "Scrap Value", "unit": "₹", "value":scrap_value})

		let estimated_working_capacity = parseFloat(input.estimated_working_capacity)
		if(isNaN(estimated_working_capacity) || estimated_working_capacity <= 0){
			reject({'position': 2, 'error': 'The total working capacity of the machinery cannot be zero hours.'})
		}
		input_array.push({"key": "Estimated Working Capacity (Hours)", "value": estimated_working_capacity, "unit": ""})

		let annual_machinery_usage = []
		let total_sum_of_hours = 0
		for(var i=0;i<input.annual_machinery_usage.length;i++){
			total_sum_of_hours+=parseFloat(input.annual_machinery_usage[i])
			annual_machinery_usage.push(parseFloat(input.annual_machinery_usage[i]))
		}
		if(isNaN(total_sum_of_hours) || total_sum_of_hours <= 0 || total_sum_of_hours > estimated_working_capacity){
			reject({'position': 2, 'error': `The sum of hours used over ${input.annual_machinery_usage.length}
years cannot exceed ${estimated_working_capacity}`})
		}
		input_array.push({"key": "Annual Machinery Usage (Hours)", "value": annual_machinery_usage, "unit": ""})
		console.log("annual_machinery_usage", annual_machinery_usage)

		let result1 = (cost_of_machinery - scrap_value)
		console.log(result1)
		let depreciation = result1/estimated_working_capacity
		console.log("depreciation", depreciation)

		let result = [], stepwise = [], tables = []

		var result3_table = `<table class="result-table" cellspacing="0" style="width:100%;">
						<thead class="heading-cell">
							<tr>
								<th class="first-heading">Years</th>
								<th>Hours Used</th>
								<th class="last-heading">Depreciation</th>
							<tr>
						</thead>
						<tbody class="value-cell">`

		var result3_table_values = []
		for(var i=0;i<annual_machinery_usage.length;i++){
			result3_table_values.push(
				[i+1,annual_machinery_usage[i],annual_machinery_usage[i]*depreciation])
			result3_table += `<tr>
						<th>${result3_table_values[i][0]}</th>
						<th>${result3_table_values[i][1].toFixed(2)}</th>
						<th>${result3_table_values[i][2].toFixed(2)}</th>
					</tr>`
		}

		result3_table += `</tbody></table>`

		tables.push({
			"label": "Annual Depreciation amount",
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

		var table_sum = 0
		var table_values = [[1,cost_of_machinery,result3_table_values[0][2],cost_of_machinery-result3_table_values[0][2]]]
		table_sum += result3_table_values[0][2]
		table += `<tr>
					<th>${table_values[0][0]}</th>
					<th>${table_values[0][1].toFixed(2)}</th>
					<th>${table_values[0][2].toFixed(2)}</th>
					<th>${table_values[0][3].toFixed(2)}</th>
				</tr>`
		var xdata = [1], ydata = [], 
		line1data = [table_values[0][2].toFixed(2)], 
		line1datalbl = ["₹"+table_values[0][2].toFixed(2)]
		line2data=[table_values[0][1].toFixed(2)], 
		line2datalbl=["₹"+table_values[0][1].toFixed(2)], 
		closing_balance = table_values[0][3].toFixed(2)
		for(var i=1;i<annual_machinery_usage.length;i++){
			table_sum += result3_table_values[i][2]
			table_values.push(
				[i+1,table_values[i-1][3],result3_table_values[i][2],table_values[i-1][3]-result3_table_values[i][2]])
			table += `<tr>
						<th>${table_values[i][0]}</th>
						<th>${table_values[i][1].toFixed(2)}</th>
						<th>${table_values[i][2].toFixed(2)}</th>
						<th>${table_values[i][3].toFixed(2)}</th>
					</tr>`
			xdata.push(i+1)
			line1data.push(table_values[i][2].toFixed(2))
			line1datalbl.push("₹"+table_values[i][2].toFixed(2))
			line2data.push(table_values[i][1].toFixed(2))
			line2datalbl.push("₹"+table_values[i][1].toFixed(2))
			// if(i == (parseInt(annual_machinery_usage.length)-1)){
				closing_balance = table_values[i][3].toFixed(2)
			// }
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
			"label": "Depreciation schedule for " + annual_machinery_usage.length + " years",
			"table": table
		})

		result.push({
			"label": `Total depreciable amount`,
			"value": result1.toFixed(2),
			"unit": "₹"
		},{
			"label": `Depreciation per hour`,
			"value": parseFloat(table_sum).toFixed(2),
			"unit": "₹"
		})

		stepwise.push({
			"number": 1,
			"title": "Depreciation Amount per hour",
			"explanation" : [
				"The Formula for depreciation amount per hour",
				"Substituting all values into the Formula, we get",
				"Simplifying the above equation, we get",
			],
			"content": [
				"$$ \\style{font-family:Arial}{\\text{Depreciation per hour} = \\frac{\\text{Cost of Machinery}-\\text{Scrap Value}}{\\text{Estimated Working Capacity(Hrs)}}} $$",
				"$$ \\text{Depreciation per hour} = \\frac{"+cost_of_machinery+"-"+scrap_value+"}{"+estimated_working_capacity+"} $$",
				"$$ \\text{Depreciation per hour} = \\frac{"+(cost_of_machinery-scrap_value)+"}{"+estimated_working_capacity+"}=₹"+depreciation.toFixed(2)+" $$",
			],
			"detailed_explanation": [
				null,
				null,
				[{
					"page_number": 1,
					"content": [
						"$$ \\text{Depreciation per hour} = \\frac{"+cost_of_machinery+"-"+scrap_value+"}{"+estimated_working_capacity+"} $$",
						"$$ \\text{Depreciation} = \\frac{"+(cost_of_machinery-scrap_value)+"}{"+estimated_working_capacity+"}=₹"+depreciation.toFixed(2)+" $$",
					],
					"explanation":`The numerator indicates that the value of the asset reduces from ₹${cost_of_machinery} to ₹${scrap_value}. That is, the total reduction (depreciation) in the asset's value is ₹${result1.toFixed(2)} after using the machinery for its entire capacity of ${estimated_working_capacity} hours.`
				},{
					"page_number": 2,
					"content": [
						"$$ \\text{Depreciation per hour} = \\frac{"+(cost_of_machinery-scrap_value)+"}{"+estimated_working_capacity+"}="+depreciation.toFixed(2)+" $$"
					],
					"explanation": `Since the machinery will be used for ${estimated_working_capacity} hours, the total depreciable amount must be divided among all ${estimated_working_capacity} hours of estimated usage, thereby allocating ${depreciation.toFixed(2)} of depreciation per hour of usage`
				}],
			]
		})

		stepwise.push({
			"number": 2,
			"title": "Annual Depreciation Amount",
			"explanation": [
				"Under this method, since depreciation is calculated on the basis of usage of the machinery, the annual depreciation amount can be found out by multiplying the total hours of usage in the year by the hourly depreciation amount, as follows",
				"The annual depreciation for " + annual_machinery_usage.length + " years can be calculated as follows"
			],
			"content": [
				"$$ \\text{Annual Depreciation} = \\text{no. of hours used in the year} * \\text{hourly depreciation rate} $$",
				result3_table
			],
			"detailed_explanation":[
				null,
				null
			]
		})
		var graph = {
			'x_label': 'Years',
			'y_label': 'Amount',
			'x_data': xdata,
			'y_data': [],
			'line_1_label': 'Annual Depreciation',
			'line_2_label': 'Opening Balance',
			'line_1_data':line1data,
			'line_1_data_lbl': line1datalbl,
			'line_2_data':line2data,
			'line_2_data_lbl':line2datalbl,
			'timeline_count':annual_machinery_usage.length,
			'closing': "₹"+closing_balance
		}
		resolve({input: input_array, result: result, stepwise: stepwise, tables:tables, graph:graph})
	})
}

module.exports = {
	calculator: calculator
}