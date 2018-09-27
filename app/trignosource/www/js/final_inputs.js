/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    tutorials: null,
    currentSubject: null,
    currentChapter: null,
    currentCalculator: null,
    currentCalculators: null,
    currentResult: null,
    baseUrl: null,
    currentArrayCount:0,
    currentArrayPlace:null,
    listenAddBtn: false,
    videos: [],
    stopCalculate: false,
    currentAsset: null, 
    transactionObject: [{
            'name': 'Opening Balance',
            'status': false,
            'count': 0
        }],
    transactionVariables: null,
    schedules : {
            balance: [],
            purchase: [],
            sales: [],
            scraps: [],
            thefts: [],
            part_sale: [],
            part_scrap: [],
            part_theft: []
    },
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.baseUrl = localStorage.getItem('baseUrl')

        var tutorials = localStorage.getItem('tutorials')
        this.tutorials = JSON.parse(tutorials).data
        console.log('tutorials', this.tutorials)

        var calculators = localStorage.getItem('calculators')
        this.calculators = JSON.parse(calculators).data

        var prefill = false
        if(localStorage.getItem('editInput') == 'true'){
            prefill = true
        }
        this.currentAsset = localStorage.getItem('currentAsset')
        if(localStorage.getItem('transactionObject')){
            var transactionObject = localStorage.getItem('transactionObject')
            console.log("transactionObject", transactionObject)
            this.transactionObject = JSON.parse(transactionObject)         
            console.log("this.transactionObject", this.transactionObject)

            var transactionVariables = localStorage.getItem('transactionVariables')
            this.transactionVariables = JSON.parse(transactionVariables)
        }

        if(!prefill){
            localStorage.removeItem('currentResult')
        }else{
            var currentResult = localStorage.getItem('currentResult')
            this.currentResult = JSON.parse(currentResult)
            this.currentResult = this.currentResult.data
            console.log(this.currentResult, "currentResult")
        }

        var tooltip_btn_show = document.getElementById('select_tooltip_icon_show')
        console.log(tooltip_btn_show)
        var tooltip_btn_hide = document.getElementById('select_tooltip_icon_hide')
        console.log(tooltip_btn_hide)
        var tooltip = document.getElementById('select_dropdown')
        console.log(tooltip)
        tooltip_btn_show.addEventListener('click', function(){
            console.log("came here")
            tooltip_btn_show.style.display = 'none'
            tooltip_btn_hide.style.display = 'block'
            tooltip.style.display = 'block'
        })
        tooltip_btn_hide.addEventListener('click', function(){
            tooltip_btn_hide.style.display = 'none'
            tooltip_btn_show.style.display = 'block'
            tooltip.style.display = 'none'
        })
        for(var k=0;k<8;k++){
            (function(k){
                var l=k;
                var dropdown_option = document.getElementById('dropdown_option_'+(l+1))
                var dropdown_input = document.getElementById('input_total_years')
                dropdown_option.addEventListener('click', function(){
                    console.log(dropdown_option.innerHTML)
                    tooltip_btn_hide.style.display = 'none'
                    tooltip_btn_show.style.display = 'block'
                    var tooltip = document.getElementById('select_dropdown')
                    tooltip.style.display = 'none'
                    dropdown_input.value = dropdown_option.innerHTML
                })
            })(k);
        }
    },

    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
        document.getElementById('back_arrow').addEventListener('click', function(e){
            navigator.app.backHistory();
        })
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

        var that = this
        var next_btn = document.getElementById('next_btn');
        next_btn.addEventListener('click', function(){
            that.nextButton()
        })
        var close_btn = document.getElementById('close_keyboard');
        close_btn.addEventListener('click', function(){
            that.closeKeyboard()
        })
        Keyboard.shrinkView(true);

        document.addEventListener("offline", function(){ 
          console.log("Device offline")
          alert("Seems your internet is disconnected. Please check and try again") 
          navigator.app.exitApp();
        }, false);
    },

    closeKeyboard: function(){
        Keyboard.hide();
    },

    nextButton: function(){
        if(this.checkForm()){
            this.createVariables()
            window.location = 'accounts_page.html'            
        }
    },

    checkForm: function(){
        if(document.getElementById('input_rod').value == null){
            alert("Please enter the rate of depreciation")
            return false
        }else if(document.getElementById("input_total_years") == null){
            alert("Please select the number of years of accounts needed")
            return false
        }else if(document.getElementById('input_rod').value == 0 || document.getElementById('input_rod').value >= 100){
            alert("Please enter a valid depreciation rate")
            return false
        }else{
            return true
        }
    },

    getAPMDec: function(date){
        let apm
        switch(date){
            case "1st January": apm = 0; break
            case "31st January":
            case "1st February": apm = 1; break
            case "28th February":
            case "1st March": apm = 2; break
            case "31st March":
            case "1st April": apm = 3; break
            case "30th April":
            case "1st May": apm = 4; break
            case "31st May":
            case "1st June": apm = 5; break
            case "30th June":
            case "1st July": apm = 6; break
            case "31st July":
            case "1st August": apm = 7; break
            case "31st August":
            case "1st Sepetember": apm = 8; break
            case "30th Sepetember":
            case "1st October": apm = 9; break
            case "31st October":
            case "1st Novemeber": apm = 10; break
            case "30th Novemeber":
            case "1st December": apm = 11; break
            case "31st December": apm = 12; break
        }
        return apm
    },

    getAPMMar: function(date){
        let apm
        switch(date){
            case "1st January": apm = 9; break
            case "31st January":
            case "1st February": apm = 10; break
            case "28th February":
            case "1st March": apm = 11; break
            case "31st March": apm = 12; break
            case "1st April": apm = 0; break
            case "30th April":
            case "1st May": apm = 1; break
            case "31st May":
            case "1st June": apm = 2; break
            case "30th June":
            case "1st July": apm = 3; break
            case "31st July":
            case "1st August": apm = 4; break
            case "31st August":
            case "1st Sepetember": apm = 5; break
            case "30th Sepetember":
            case "1st October": apm = 6; break
            case "31st October":
            case "1st Novemeber": apm = 7; break
            case "30th Novemeber":
            case "1st December": apm = 8; break
            case "31st December": apm = 9; break
        }
        return apm
    },

    createVariables: function(){
        var that = this
        var purchase = {
            'ac': [],
            'aac': [],
            'apy': [],
            'atc': [],
            'apm': [],
            'apdp': [],
            'ayopd': [],
            'ayopcb': [],
            'ac2': []
        }


        var sales = {
            gs: [], gsy: [], gsc: [], gspy: [], gspm: [], gspdp: [], gsyopd: [], gsyopcb: [],
            gsm: [], gsdp: [], gsyosob: [], gsyosd: [], gsbv: [], gspl: [],
            as: [], asy: [], asm: [], asdp: [], ayosob: [], ayosd: [], asbv: [], aspl: [],
            aps: [], apsy: [], apsc: [], apsdp: [], ayopsob: [], ayopsd: [], apsbv: [], apspl: [], apyopd: [], apyopcb: [],
            gsc2: [], gsc7: [], asc5: [], apsm: [], apsc5: []
        }

        var scrapped = {
            gscr: [], gscry: [], gscrc: [], gscrpy: [], gscrpm: [], gscrpdp: [], gscryopd: [],
            gscryopcb: [], gscrm: [], gscrdp: [], gscryosob: [], gscryosd: [], gscrbv: [], gscrpl: [],
            ascr: [], ascry: [], ascrm: [], ascrdp: [], ayoscrob: [], ayoscrd: [], ascrbv: [], ascrpl: [],
            apscr: [], apscry: [], apscrm: [], apscrc: [], apscrdp: [], ayopscrob: [], ayopscrd: [], apscrbv: [], apscrpl: [], apscryopd: [], apscryopcb: [],
            gscrc2: [], gscrc7: [], ascrc5: [], apscrc5: []
        }

        var destroyed = {
            gtdy: [], gtdc: [], gtdpy: [], gtdi: [], gtdpm: [], gtdpdp: [], gtdyopd: [], gtdyopcb: [],
            gtdm: [], gtddp: [], gtdyotdob: [], gtdyotdd: [], gtdbv: [], gtdpl: [],
            atdi: [], atdy: [], atdm: [], atddp: [], ayotdob: [], ayotdd: [], atdbv: [], atdpl: [],
            aptdi: [], aptdy: [], aptdc: [], aptddp: [], ayoptdob: [], ayoptdd: [], aptdbv: [], aptdpl: [],
            gtdc2: [], gtdc7: [], atdc5: [], aptdc5: []
        }

        var addition = {
            name: [],
            ga: [], gay: [], gan: [], gam: [], gadp: [], gayoad: [], gayoacb: [],
            aa: [], aay: [], aan: [], aam: [], aadp: [], ayoad: [], ayoacb: [],
            gac5: [], aac5: []
        }

        var replacement = {
            name: [],
            grc: [], gry: [], grm: [], grdp: [], gryord: [], gryorcb: [],
            arc: [], ary: [], arm: [], ardp: [], ayord: [], ayorcb: [],
            aprc: [], apry: [], aprn: [], aprm: [], aprdp: [], ayoprd: [], ayoprcb: [],
            grc5: [], arc5: [], aprc: []
        }


        let closing_date = localStorage.getItem('closingDate')

        let opening_date
        if(closing_date == '31st December'){
            opening_date = '1st January'
        }else{
            opening_date = '1st April'
        }

        let D = document.getElementById('input_rod').value
        let d = parseFloat(D) / 100
        let total_years = document.getElementById('input_total_years').value

        this.schedules.purchase = []
        for(i=0;i<this.transactionObject[1].values.length;i++){
            let obj = this.transactionObject[1].values[i]
            purchase.ac.push(parseFloat(obj.cost))
            purchase.aac.push(parseFloat(obj.additional_costs))
            purchase.apy.push(parseInt(obj.year_of_purchase))
            var atc = parseFloat(obj.cost) + parseFloat(obj.additional_costs)
            purchase.atc.push(parseFloat(atc))
            if(closing_date == '31st December'){
                purchase.apm.push(that.getAPMDec(this.transactionObject[1].values[i].date_of_purchase))
            }else{
                purchase.apm.push(that.getAPMMar(this.transactionObject[1].values[i].date_of_purchase))
            }
            if(obj.date_of_purchase.includes("January") || obj.date_of_purchase.includes("February") || obj.date_of_purchase.includes("March")){
                purchase.ac2.push(parseInt(obj.year_of_purchase)-1)                    
            }else{
                purchase.ac2.push(parseInt(obj.year_of_purchase))
            }
            purchase.apdp.push(12 - purchase.apm[i])
            purchase.ayopd.push(purchase.atc[i] * d * purchase.apdp[i] / 12)
            purchase.ayopcb.push(purchase.atc[i] - purchase.ayopd[i])
            this.createPurchaseSchedule(closing_date, d, opening_date, purchase, i, total_years)
        }
        this.transactionVariables.purchase = purchase

        for(i=0;i<this.transactionObject[2].values.length;i++){
            var obj = this.transactionObject[2].values[i].values
            if(this.transactionObject[2].values[i].asset == "General / Other"){
                sales.gs.push(parseFloat(obj.sale_proceeds))
                sales.gsy.push(parseInt(obj.year_of_sale))
                sales.gsc.push(parseFloat(obj.purchase_cost))  
                sales.gspy.push(parseInt(obj.year_of_purchase))      
                if(closing_date == '31st December'){
                    sales.gspm.push(that.getAPMDec(obj.date_of_purchase))        
                    sales.gsm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    sales.gspm.push(that.getAPMMar(obj.date_of_purchase))
                    sales.gsm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_purchase.includes("January") || obj.date_of_purchase.includes("February") || obj.date_of_purchase.includes("March")){
                    sales.gsc2.push(parseInt(obj.year_of_purchase)-1)                    
                }else{
                    sales.gsc2.push(parseInt(obj.year_of_purchase))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    sales.gsc7.push(parseInt(obj.year_of_sale))                    
                }else{
                    sales.gsc7.push(parseInt(obj.year_of_sale)+1)
                }
                sales.gspdp.push(12 - sales.gspm[i])
                sales.gsyopd.push(sales.gsc[i] * d * sales.gspdp[i] / 12)
                sales.gsyopcb.push(sales.gsc[i] - sales.gsyopd[i])
                sales.gsdp.push(sales.gsm[i])
                let gsyosob = this.createSaleSchedule(closing_date, d, opening_date, sales, i)
                sales.gsyosob.push(gsyosob)
                sales.gsyosd.push(sales.gsyosob[i] * d * sales.gsdp[i] / 12)
                sales.gsbv.push(sales.gsyosob[i] - sales.gsyosd[i])
                sales.gspl.push(sales.gsbv[i] - sales.gs[i])
            }else if(obj.extent_of_sale.includes("whole")){
                sales.as.push(parseFloat(obj.sale_proceeds))
                sales.asy.push(parseInt(obj.year_of_sale))
                if(closing_date == '31st December'){
                    sales.asm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    sales.asm.push(that.getAPMMar(obj.date_of_sale))
                }
                sales.asdp.push(sales.asm[i])
                let asset_number = parseInt(this.transactionObject[2].values[i].asset.split(" ")[1]) -1
                let ayosob
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    sales.asc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    sales.asc5.push(parseInt(obj.year_of_sale)+1)
                }
                if(closing_date == '31st December'){
                    ayosob = this.stopPurchaseScheduleStart(asset_number, parseInt(obj.year_of_sale))                    
                }else{
                    ayosob = this.stopPurchaseScheduleEnd(asset_number, parseInt(sales.asc5[i]))
                }
                sales.ayosob.push(ayosob)
                sales.ayosd.push(sales.ayosob[i] * d * sales.asdp[i] / 12)
                sales.asbv.push(sales.ayosob[i] - sales.ayosd[i])
                sales.aspl.push(sales.asbv[i] - sales.as[i])
                
            }else{
                sales.aps.push(parseFloat(obj.sale_proceeds))
                sales.apsy.push(parseInt(obj.year_of_sale))
                sales.apsc.push(parseFloat(obj.purchase_cost))
                if(closing_date == '31st December'){
                    sales.apsm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    sales.apsm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    sales.apsc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    sales.apsc5.push(parseInt(obj.year_of_sale)+1)
                }
                sales.apsdp.push(sales.apsm[i])
                let asset_number = parseInt(this.transactionObject[2].values[i].asset.split(" ")[1]) -1
                let ayopsob = this.createAssetPartSaleSchedule(closing_date, d, opening_date, sales, i, asset_number)
                sales.ayopsob.push(ayopsob)
                sales.ayopsd.push(sales.ayopsob[i] * d * sales.apsdp[i] / 12)
                sales.apsbv.push(sales.ayopsob[i] - sales.ayopsd[i])
                sales.apspl.push(sales.apsbv[i] - sales.aps[i])
                sales.apyopd.push(sales.apsc[i] * d * purchase.apdp[i] / 12)
                sales.apyopcb.push(sales.apsc[i] - sales.apyopd[i])
                this.updatePurchaseScheduleSalePart(this.transactionObject[2].values[i].asset, sales, i, closing_date)
            }
        }
        this.transactionVariables.sales = sales

        for(i=0;i<this.transactionObject[3].values.length;i++){
            var obj = this.transactionObject[3].values[i].values
            if(this.transactionObject[3].values[i].asset == "General / Other"){
                scrapped.gscr.push(parseFloat(obj.sale_proceeds))
                scrapped.gscry.push(parseInt(obj.year_of_sale))
                scrapped.gscrc.push(parseFloat(obj.purchase_cost))  
                scrapped.gscrpy.push(parseInt(obj.year_of_purchase))      
                if(closing_date == '31st December'){
                    scrapped.gscrpm.push(that.getAPMDec(obj.date_of_purchase))        
                    scrapped.gscrm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    scrapped.gscrpm.push(that.getAPMMar(obj.date_of_purchase))
                    scrapped.gscrm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_purchase.includes("January") || obj.date_of_purchase.includes("February") || obj.date_of_purchase.includes("March")){
                    scrapped.gscrc2.push(parseInt(obj.year_of_purchase)-1)                    
                }else{
                    scrapped.gscrc2.push(parseInt(obj.year_of_purchase))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    scrapped.gscrc7.push(parseInt(obj.year_of_sale))                    
                }else{
                    scrapped.gscrc7.push(parseInt(obj.year_of_sale)+1)
                }
                scrapped.gscrpdp.push(12 - scrapped.gscrpm[i])
                scrapped.gscryopd.push(scrapped.gscrc[i] * d * scrapped.gscrpdp[i] / 12)
                scrapped.gscryopcb.push(scrapped.gscrc[i] - scrapped.gscryopd[i])
                scrapped.gscrdp.push(scrapped.gscrm[i])
                let gscryosob = this.createScrapSchedule(closing_date, d, opening_date, scrapped, i)
                scrapped.gscryosob.push(gscryosob)
                scrapped.gscryosd.push(scrapped.gscryosob[i] * d * scrapped.gscrdp[i] / 12)
                scrapped.gscrbv.push(scrapped.gscryosob[i] - scrapped.gscryosd[i])
                scrapped.gscrpl.push(scrapped.gscrbv[i] - scrapped.gscr[i])
            }else if(obj.extent_of_sale.includes("whole")){
                scrapped.ascr.push(parseFloat(obj.sale_proceeds))
                scrapped.ascry.push(parseInt(obj.year_of_sale))
                if(closing_date == '31st December'){
                    scrapped.ascrm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    scrapped.ascrm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    scrapped.ascrc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    scrapped.ascrc5.push(parseInt(obj.year_of_sale)+1)
                }
                scrapped.ascrdp.push(scrapped.ascrm[i])
                let asset_number = parseInt(this.transactionObject[3].values[i].asset.split(" ")[1]) -1
                let ayoscrob
                if(closing_date == '31st December'){
                    ayoscrob = this.stopPurchaseScheduleStart(asset_number, parseInt(obj.year_of_sale))
                }else{
                    ayoscrob = this.stopPurchaseScheduleEnd(asset_number, parseInt(scrapped.ascrc5[i]))
                }
                scrapped.ayoscrob.push(ayoscrob)
                scrapped.ayoscrd.push(scrapped.ayoscrob[i] * d * scrapped.ascrdp[i] / 12)
                scrapped.ascrbv.push(scrapped.ayoscrob[i] - scrapped.ayoscrd[i])
                scrapped.ascrpl.push(scrapped.ascrbv[i] - scrapped.ascr[i])
            }else{
                scrapped.apscr.push(parseFloat(obj.sale_proceeds))
                scrapped.apscry.push(parseInt(obj.year_of_sale))
                scrapped.apscrc.push(parseFloat(obj.purchase_cost))
                if(closing_date == '31st December'){
                    scrapped.apscrm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    scrapped.apscrm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    scrapped.apscrc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    scrapped.apscrc5.push(parseInt(obj.year_of_sale)+1)
                }
                scrapped.apscrdp.push(scrapped.apscrm[i])
                let asset_number = parseInt(this.transactionObject[3].values[i].asset.split(" ")[1]) -1
                let ayopscrob = this.createAssetPartScrapSchedule(closing_date, d, opening_date, scrapped, i, asset_number)
                scrapped.ayopscrob.push(ayopscrob)
                scrapped.ayopscrd.push(scrapped.ayopscrob[i] * d * scrapped.apscrdp[i] / 12)
                scrapped.apscrbv.push(scrapped.ayopscrob[i] - scrapped.ayopscrd[i])
                scrapped.apscrpl.push(scrapped.apscrbv[i] - scrapped.apscr[i])
                scrapped.apscryopd.push(scrapped.apscrc[i] * d * purchase.apdp[i] / 12)
                scrapped.apscryopcb.push(scrapped.apscr[i] - scrapped.apscryopd[i])
                this.updatePurchaseScheduleScrapPart(this.transactionObject[3].values[i].asset, scrapped, i, closing_date)
            }
        }
        this.transactionVariables.scrapped = scrapped


        for(i=0;i<this.transactionObject[4].values.length;i++){
            var obj = this.transactionObject[4].values[i].values
            if(this.transactionObject[4].values[i].asset == "General / Other"){
                destroyed.gtdi.push(parseFloat(obj.sale_proceeds))
                destroyed.gtdy.push(parseInt(obj.year_of_sale))
                destroyed.gtdc.push(parseInt(obj.purchase_cost))
                destroyed.gtdpy.push(parseInt(obj.year_of_purchase))      
                if(closing_date == '31st December'){
                    destroyed.gtdpm.push(that.getAPMDec(obj.date_of_purchase))        
                    destroyed.gtdm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    destroyed.gtdpm.push(that.getAPMMar(obj.date_of_purchase))
                    destroyed.gtdm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_purchase.includes("January") || obj.date_of_purchase.includes("February") || obj.date_of_purchase.includes("March")){
                    destroyed.gtdc2.push(parseInt(obj.year_of_purchase)-1)                    
                }else{
                    destroyed.gtdc2.push(parseInt(obj.year_of_purchase))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    destroyed.gtdc7.push(parseInt(obj.year_of_sale))                    
                }else{
                    destroyed.gtdc7.push(parseInt(obj.year_of_sale)+1)
                }
                destroyed.gtdpdp.push(12 - destroyed.gtdpm[i])
                destroyed.gtdyopd.push(destroyed.gtdc[i] * d * destroyed.gtdpdp[i] / 12)
                destroyed.gtdyopcb.push(destroyed.gtdc[i] - destroyed.gtdyopd[i])
                destroyed.gtddp.push(destroyed.gtdm[i])
                let gtdyotdob = this.createTheftSchedule(closing_date, d, opening_date, destroyed, i)
                destroyed.gtdyotdob.push(gtdyotdob)
                destroyed.gtdyotdd.push(destroyed.gtdyotdob[i] * d * destroyed.gtddp[i] / 12)
                destroyed.gtdbv.push(destroyed.gtdyotdob[i] - destroyed.gtdyotdd[i])
                destroyed.gtdpl.push(destroyed.gtdbv[i] - destroyed.gtdi[i])
            }else if(obj.extent_of_sale.includes("whole")){
                destroyed.atdi.push(parseFloat(obj.sale_proceeds))
                destroyed.atdy.push(parseInt(obj.year_of_sale))
                if(closing_date == '31st December'){
                    destroyed.atdm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    destroyed.atdm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    destroyed.atdc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    destroyed.atdc5.push(parseInt(obj.year_of_sale)+1)
                }
                destroyed.atddp.push(destroyed.asm[i])
                let asset_number = parseInt(this.transactionObject[4].values[i].asset.split(" ")[1]) - 1
                let ayotdob
                if(closing_date == '31st December'){
                    ayotdob = this.stopPurchaseScheduleStart(asset_number, parseInt(obj.year_of_sale))
                }else{
                    ayotdob = this.stopPurchaseScheduleEnd(asset_number, parseInt(destroyed.atdc[i]))
                }
                destroyed.ayotdob.push(ayotdob)
                destroyed.ayotdd.push(destroyed.ayotdob[i] * d * destroyed.atddp[i] / 12)
                destroyed.atdbv.push(destroyed.ayotdob[i] - destroyed.ayotdd[i])
                destroyed.atdpl.push(destroyed.atdbv[i] - destroyed.atdi[i])
            }else{
                destroyed.aptdi.push(parseFloat(obj.sale_proceeds))
                destroyed.aptdy.push(parseInt(obj.year_of_sale))
                destroyed.aptdc.push(parseFloat(obj.purchase_cost))
                if(closing_date == '31st December'){
                    destroyed.aptdm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    destroyed.aptdm.push(that.getAPMMar(obj.date_of_sale))
                }
                 if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    destroyed.aptdc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    destroyed.aptdc5.push(parseInt(obj.year_of_sale)+1)
                }
                destroyed.aptddp.push(destroyed.aptdm[i])
                let asset_number = parseInt(this.transactionObject[4].values[i].asset.split(" ")[1]) -1
                let ayoptdob = this.createAssetPartTheftSchedule(closing_date, d, opening_date, destroyed, i, asset_number)
                destroyed.ayoptdob.push(ayoptdob)
                destroyed.ayoptdd.push(destroyed.ayoptdob[i] * d * destroyed.aptddp[i] / 12)
                destroyed.aptdpbv.push(destroyed.ayoptdob[i] - destroyed.ayoptdd[i])
                destroyed.aptdpl.push(destroyed.aptdbv[i] - destroyed.aptd[i])
                destroyed.aptdyopd.push(destroyed.aptdc[i] * d * purchase.apdp[i] / 12)
                destroyed.aptdyopcb.push(destroyed.aptdc[i] - destroyed.aptdyopd[i])
                this.updatePurchaseScheduleTheftPart(this.transactionObject[4].values[i].asset, destroyed, i, closing_date)
            }
        }
        this.transactionVariables.destroyed = destroyed

        for(i=0;i<this.transactionObject[5].values.length;i++){
            var obj = this.transactionObject[5].values[i].values
            if(this.transactionObject[5].values[i].asset == "General / Other"){
                addition.ga.push(parseFloat(obj.sale_proceeds))
                addition.gay.push(parseInt(obj.year_of_sale))
                addition.gan.push(parseFloat(obj.extent_of_sale))  
                if(closing_date == '31st December'){
                    addition.gam.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    addition.gam.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    addition.gac5.push(parseInt(obj.year_of_sale))                    
                }else{
                    addition.gac5.push(parseInt(obj.year_of_sale)+1)
                }
                addition.gadp.push(12 - addition.gam[i])
                addition.gayoad.push(addition.ga[i] * d * addition.gadp[i] / 12)
                addition.gayoacb.push(addition.ga[i] - addition.gayoad[i])
            }else{
                addition.aa.push(parseFloat(obj.sale_proceeds))
                addition.aay.push(parseInt(obj.year_of_sale))
                addition.aan.push(parseFloat(obj.extent_of_sale))  
                if(closing_date == '31st December'){
                    addition.aam.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    addition.aam.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    addition.aac5.push(parseInt(obj.year_of_sale))                    
                }else{
                    addition.aac5.push(parseInt(obj.year_of_sale)+1)
                }
                addition.aadp.push(12 - addition.aam[i])
                addition.ayoad.push(addition.aa[i] * d * addition.aadp[i] / 12)
                addition.ayoacb.push(addition.aa[i] - addition.ayoad[i])
                this.updatePurchaseScheduleAdd(this.transactionObject[5].values[i].asset, addition, i, closing_date)
            }
        }
        this.transactionVariables.addition = addition

        for(i=0;i<this.transactionObject[6].values.length;i++){
            var obj = this.transactionObject[6].values[i].values
            if(this.transactionObject[6].values[i].asset == "General / Other"){
                replacement.grc.push(parseFloat(obj.sale_proceeds))
                replacement.gry.push(parseInt(obj.year_of_sale))
                if(closing_date == '31st December'){
                    replacement.grm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    replacement.grm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    replacement.grc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    replacement.grc5.push(parseInt(obj.year_of_sale)+1)
                }
                replacement.grdp.push(12 - replacement.grm[i])
                replacement.gryord.push(replacement.grc[i] * d * replacement.grdp[i] / 12)
                replacement.gryorcb.push(replacement.grc[i] - replacement.gryord[i])
            }else if(obj.extent_of_sale.includes("whole")){
                replacement.name.push(this.transactionObject[6].values[i].asset)
                replacement.arc.push(parseFloat(obj.sale_proceeds))
                replacement.ary.push(parseInt(obj.year_of_sale))
                if(closing_date == '31st December'){
                    replacement.arm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    replacement.arm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    replacement.arc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    replacement.arc5.push(parseInt(obj.year_of_sale)+1)
                }
                replacement.ardp.push(12 - replacement.arm[i])
                replacement.ayord.push(replacement.arc[i] * d * replacement.ardp[i] / 12)
                replacement.ayorcb.push(replacement.arc[i] - replacement.ayord[i])
                this.updatePurchaseScheduleReplaceWhole(this.transactionObject[6].values[i].asset, replacement, i, closing_date)
            }else{
                replacement.name.push(this.transactionObject[6].values[i].asset)
                replacement.aprc.push(parseFloat(obj.sale_proceeds))
                replacement.apry.push(parseInt(obj.year_of_sale))
                replacement.aprn.push(obj.extent_of_sale)
                if(closing_date == '31st December'){
                    replacement.aprm.push(that.getAPMDec(obj.date_of_sale))
                }else{
                    replacement.aprm.push(that.getAPMMar(obj.date_of_sale))
                }
                if(obj.date_of_sale.includes("January") || obj.date_of_sale.includes("February") || obj.date_of_sale.includes("March")){
                    replacement.aprc5.push(parseInt(obj.year_of_sale))                    
                }else{
                    replacement.aprc5.push(parseInt(obj.year_of_sale)+1)
                }
                replacement.aprdp.push(12 - replacement.aprm[i])
                replacement.ayoprd.push(replacement.aprc[i] * d * replacement.aprdp[i] / 12)
                replacement.ayoprcb.push(replacement.aprc[i] - replacement.ayoprd[i])
                if(obj.extent_of_sale == "Significant"){
                    this.updatePurchaseScheduleReplacePart(this.transactionObject[6].values[i].asset, replacement, i, closing_date)
                }
            }
        }
        this.transactionVariables.replacement = replacement

        console.log(this.transactionVariables, "transactionVariables")
        this.createBalanceSchedule(closing_date, d, opening_date, total_years)
        this.createTotalAssetsBlockSchedule(closing_date)
        console.log(this.schedules, "schedules")
        this.createAssetAccount(closing_date, opening_date, d)
    },

    createSaleSchedule: function(closing_date, d, opening_date, obj, pos){
        var schedule = []
        var i = 1
        var max = obj.gsy[pos]
        var sale = {
            opening_date : opening_date,
            year_begining: obj.gspy[pos],
            opening_balance: null,
            depreciation: null,
            closing_balance: obj.gsyopcb[pos],
            closing_date: closing_date,
            year_end: obj.gspy[pos],
        }  
        if(closing_date == '31st March'){
            sale.year_begining = obj.gsc2[pos]
            sale.year_end = obj.gsc2[pos]+1
            max = obj.gsc7[pos]
        }
        schedule.push(sale)
        for(j=schedule[i-1].year_begining + 1;j<=max;j++){
            var sale = {
                opening_date : opening_date,
                year_begining: schedule[i-1].year_begining + 1,
                opening_balance: schedule[i-1].closing_balance,
                depreciation: schedule[i-1].closing_balance * d,
                closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                closing_date: closing_date,
                year_end: schedule[i-1].year_begining + 1,
            }
            if(closing_date == '31st March'){
                sale.year_end += 1
            }
            schedule.push(sale)
            i++
        }
        this.schedules.sales.push(schedule)
        return schedule[schedule.length - 1].opening_balance
    },

    createScrapSchedule: function(closing_date, d, opening_date, obj, pos){
        var schedule = []
        var i = 1, max = obj.gscry[pos]
        var scrap = {
            opening_date : opening_date,
            year_begining: obj.gscrpy[pos],
            opening_balance: null,
            depreciation: null,
            closing_balance: obj.gscryopcb[pos],
            closing_date: closing_date,
            year_end: obj.gscrpy[pos],
        }  
        if(closing_date == '31st March'){
            scrap.year_begining = obj.gscrc2[pos]
            scrap.year_end = obj.gscrc2[pos] + 1
            max = obj.gscrc7[pos]
        }
        schedule.push(scrap)
        for(j=schedule[i-1].year_begining + 1;j<=max;j++){
            var scrap = {
                opening_date : opening_date,
                year_begining: schedule[i-1].year_begining + 1,
                opening_balance: schedule[i-1].closing_balance,
                depreciation: schedule[i-1].closing_balance * d,
                closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                closing_date: closing_date,
                year_end: schedule[i-1].year_begining + 1,
            }
            if(closing_date == '31st March'){
                scrap.year_end += 1
            }
            schedule.push(scrap)
            i++
        }
        this.schedules.scraps.push(schedule)
        return schedule[schedule.length - 1].opening_balance
    },

    createTheftSchedule: function(closing_date, d, opening_date, obj, pos){
        var schedule = []
        var i = 1, max = obj.gtdy[pos]
        var theft = {
            opening_date : opening_date,
            year_begining: obj.gtdpy[pos],
            opening_balance: null,
            depreciation: null,
            closing_balance: obj.gtdyopcb[pos],
            closing_date: closing_date,
            year_end: obj.gtdpy[pos],
        }  
        if(closing_date == '31st March'){
            theft.year_begining = obj.gtdc2[pos]
            theft.year_end = obj.gtdc2[pos] + 1
            max = obj.gtdc7[pos]
        }
        schedule.push(theft)
        for(j=schedule[i-1].year_begining + 1;j<=max;j++){
            var theft = {
                opening_date : opening_date,
                year_begining: schedule[i-1].year_begining + 1,
                opening_balance: schedule[i-1].closing_balance,
                depreciation: schedule[i-1].closing_balance * d,
                closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                closing_date: closing_date,
                year_end: schedule[i-1].year_begining + 1,
            }
            if(closing_date == '31st March'){
                theft.year_end += 1
            }
            schedule.push(theft)
            j++
        }
        this.schedules.thefts.push(schedule)
        return schedule[schedule.length - 1].opening_balance
    },

    createBalanceSchedule: function(closing_date, d, opening_date, total_years){
        let obj = this.transactionVariables
        if(obj.goby){
            var schedule = [], max = parseInt(obj.goby)+parseInt(total_years)-1
            var balance = {
                opening_date : opening_date,
                year_begining: obj.goby,
                opening_balance: obj.gob,
                depreciation: obj.gob * d,
                closing_balance: obj.gob - (obj.gob * d),
                closing_date: closing_date,
                year_end: obj.goby,
            }  
            if(closing_date == '31st March'){
                balance.year_begining = obj.goby
                balance.year_end = obj.goby+1
                max = parseInt(obj.goby)+parseInt(total_years)
            }
            schedule.push(balance)
            var i = 1
            for(j=schedule[i-1].year_end+1;j<=max;j++){
                var balance = {
                    opening_date : opening_date,
                    year_begining: schedule[i-1].year_begining + 1,
                    opening_balance: schedule[i-1].closing_balance,
                    depreciation: schedule[i-1].closing_balance * d,
                    closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                    closing_date: closing_date,
                    year_end: schedule[i-1].year_begining + 1,
                }
                if(closing_date == '31st March'){
                    balance.year_end += 1
                }
                schedule.push(balance)
                if(balance.closing_balance == 0){
                    j = max
                }
                i++
            }
            this.schedules.balance = schedule
            for(j=0;j<this.schedules.balance.length;j++){
                let schedule = this.schedules.balance[j]
                for(var i=0;i<obj.sales.gsyosob.length;i++){
                    if(schedule.year_begining == ((closing_date == '31st March')?obj.sales.gsc7[i]-1:obj.sales.gsy[i])){
                        this.schedules.balance[j].opening_balance -= obj.sales.gsyosob[i]                        
                    }
                }
                for(var i=0;i<obj.scrapped.gscryosob.length;i++){
                    if(schedule.year_begining == ((closing_date == '31st March')?obj.scrapped.gscrc7[i]-1:obj.scrapped.gscry[i])){
                        this.schedules.balance[j].opening_balance -= obj.scrapped.gscryosob[i]                        
                    }
                }
                for(var i=0;i<obj.destroyed.gtdyotdob.length;i++){
                    if(schedule.year_begining == ((closing_date == '31st March')?obj.destroyed.gtdc7[pos]-1:obj.destroyed.gtdy[i])){
                        this.schedules.balance[j].opening_balance -= obj.destroyed.gtdyotdob[i]                        
                    }
                }
                for(var i=0;i<obj.addition.gayoacb.length;i++){
                    if(obj.gan[i] == 'Significant' && schedule.year_begining == ((closing_date == '31st March')?obj.addition.gac5[pos]:obj.addition.gay[i])){
                        this.schedules.balance[j].closing_balance += obj.addition.gayoacb[i]                        
                    }
                }
                for(var i=0;i<obj.replacement.gryorcb.length;i++){
                    if(schedule.year_begining == ((closing_date == '31st March')?obj.replacement.grc5[pos]:obj.replacement.gry[i])){
                        this.schedules.balance[j].closing_balance += obj.replacement.gryorcb[i]                        
                    }
                }
            }
        }
    },
    createPurchaseSchedule: function(closing_date, d, opening_date, obj, pos, total_years){
        var schedule = []
        var i = 1, max = obj.apy[pos]
        var purchase = {
            opening_date : opening_date,
            year_begining: obj.apy[pos],
            opening_balance: null,
            depreciation: null,
            closing_balance: obj.ayopcb[pos],
            closing_date: closing_date,
            year_end: obj.apy[pos],
        }  
        if(closing_date == '31st March'){
            purchase.year_begining = obj.ac2[pos]
            purchase.year_end = obj.ac2[pos] + 1
        }
        schedule.push(purchase)
        for(j=schedule[i-1].year_begining + 1;j<parseInt(max)+parseInt(total_years);j++){
            var purchase = {
                opening_date : opening_date,
                year_begining: schedule[i-1].year_begining + 1,
                opening_balance: schedule[i-1].closing_balance,
                depreciation: schedule[i-1].closing_balance * d,
                closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                closing_date: closing_date,
                year_end: schedule[i-1].year_begining + 1,
            }
            if(closing_date == '31st March'){
                purchase.year_end += 1
            }
            if(purchase.closing_balance == 0){
                j = parseInt(obj.apy[pos])+parseInt(total_years)-1
            }else if(closing_date =='31st December' && (purchase.year_end == (obj.apy[pos]+total_years-1))){
                j = parseInt(obj.apy[pos])+parseInt(total_years)-1
            }else if(closing_date == '31st March' && (purchase.year_end == (obj.ac2[pos]+total_years-1))){
                j = parseInt(obj.ac2[pos])+parseInt(total_years)-1
            }
            schedule.push(purchase)
            i++
        }
        this.schedules.purchase.push(schedule)
    },
    updatePurchaseScheduleAdd: function(asset, addition, pos, closing_date){
        let asset_number = parseInt(asset.split(" ")[1])-1
        for(i=0;i<this.schedules.purchase[asset_number].length;i++){
            let obj = this.schedules.purchase[asset_number][i]
            if(addition.aan[pos] == 'Significant' && obj.year_begining ==  ((closing_date == '31st March')?addition.aac5[pos]:addition.aay[pos])){
                this.schedules.purchase[asset_number][i].closing_balance += addition.ayoacb[pos]
            }
        }
    },
    updatePurchaseScheduleReplaceWhole: function(asset, replacement, pos, closing_date){
        let asset_number = parseInt(asset.split(" ")[1])-1
        for(i=0;i<this.schedules.purchase[asset_number].length;i++){
            let obj = this.schedules.purchase[asset_number][i]
            if(obj.year_begining == ((closing_date == '31st March')?replacement.arc5[pos]:replacement.ary[pos])){
                this.schedules.purchase[asset_number][i].closing_balance += replacement.ayorcb[pos]
            }
        }
    },
    updatePurchaseScheduleReplacePart: function(asset, replacement, pos, closing_date){
        let asset_number = parseInt(asset.split(" ")[1])-1
        for(i=0;i<this.schedules.purchase[asset_number].length;i++){
            let obj = this.schedules.purchase[asset_number][i]
            if(obj.year_begining == ((closing_date == '31st March')?replacement.aprc5[pos]:replacement.apry[pos])){
                this.schedules.purchase[asset_number][i].closing_balance += replacement.ayoprcb[pos]
            }
        }
    },
    updatePurchaseScheduleSalePart: function(asset, sale, pos, closing_date){
        let asset_number = parseInt(asset.split(" ")[1])-1
        for(i=0;i<this.schedules.purchase[asset_number].length;i++){
            let obj = this.schedules.purchase[asset_number][i]
            if(obj.year_begining == ((closing_date == '31st March')?sale.apsc5[pos]-1:sale.apsy[pos])){
                this.schedules.purchase[asset_number][i].opening_balance -= sale.ayopsob[pos]
            }
        }
    },
    updatePurchaseScheduleScrapPart: function(asset, scrap, pos, closing_date){
        let asset_number = parseInt(asset.split(" ")[1])-1
        for(i=0;i<this.schedules.purchase[asset_number].length;i++){
            let obj = this.schedules.purchase[asset_number][i]
            if(obj.year_begining == ((closing_date == '31st March')?scrap.apscrc5[pos]-1:scrap.apscry[pos])){
                this.schedules.purchase[asset_number][i].opening_balance -= sale.ayopscrob[pos]
            }
        }
    },
    updatePurchaseScheduleTheftPart: function(asset, theft, pos, closing_date){
        let asset_number = parseInt(asset.split(" ")[1])-1
        for(i=0;i<this.schedules.purchase[asset_number].length;i++){
            let obj = this.schedules.purchase[asset_number][i]
            if(obj.year_begining == ((closing_date == '31st March')?theft.aptdc5[pos]-1:theft.aptdy[pos])){
                this.schedules.purchase[asset_number][i].opening_balance -= theft.ayoptdob[pos]
            }
        }
    },
    stopPurchaseScheduleStart: function(asset_number, last){
        var new_schedule = []
        var old_schedule = this.schedules.purchase[asset_number]
        console.log("stopPurchaseSchedule", "last", last, "asset_number", asset_number)
        console.log("old_schedule", old_schedule)
        var i = 1
        for(j=parseInt(old_schedule[0].year_begining);j<=parseInt(last);j++){
            new_schedule.push(old_schedule[i-1])
            i++
        }
        this.schedules.purchase[asset_number] = new_schedule
        console.log("new_schedule", new_schedule)
        return new_schedule[new_schedule.length-1].opening_balance
    },
    stopPurchaseScheduleEnd: function(asset_number, last){
        var new_schedule = []
        var old_schedule = this.schedules.purchase[asset_number]
        console.log("stopPurchaseSchedule", "last", last, "asset_number", asset_number)
        console.log("old_schedule", old_schedule)
        var i = 1
        for(j=parseInt(old_schedule[0].year_end);j<=parseInt(last);j++){
            new_schedule.push(old_schedule[i-1])
            i++
        }
        this.schedules.purchase[asset_number] = new_schedule
        console.log("new_schedule", new_schedule)
        return new_schedule[new_schedule.length-1].opening_balance
    },
    createAssetPartSaleSchedule: function(closing_date, d, opening_date, obj, pos, asset_number){
        this.schedules.part_sale = []
        console.log(this.schedules.purchase, asset_number)
        var schedule = []
        var i = 1, max = obj.apsy[pos]
        var part_sale = {
            opening_date : opening_date,
            year_begining: this.transactionVariables.purchase.apy[asset_number],
            opening_balance: null,
            depreciation: null,
            closing_balance: obj.apyopcb[pos],
            closing_date: closing_date,
            year_end: this.transactionVariables.purchase.apy[asset_number],
        }  
        if(closing_date == '31st March'){
            part_sale.year_begining = obj.ac2[pos]
            part_sale.year_end = obj.ac2[pos] + 1
            max = obj.apsc5[pos]
        }
        schedule.push(part_sale)
        for(j=schedule[i-1].year_begining + 1;j<=max;j++){
            var purchase = {
                opening_date : opening_date,
                year_begining: schedule[i-1].year_begining + 1,
                opening_balance: schedule[i-1].closing_balance,
                depreciation: schedule[i-1].closing_balance * d,
                closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                closing_date: closing_date,
                year_end: schedule[i-1].year_begining + 1,
            }
            schedule.push(part_sale)
            i++
        }
        this.schedules.part_sale.push(schedule)
        return schedule[schedule.length-1].opening_balance
    },
    createAssetPartScrapSchedule: function(closing_date, d, opening_date, obj, pos, asset_number){
        this.schedules.part_scrap = []
        var schedule = []
        var i = 1, max = obj.apscry[pos]
        var part_scrap = {
            opening_date : opening_date,
            year_begining: this.transactionVariables.purchase.apy[asset_number],
            opening_balance: null,
            depreciation: null,
            closing_balance: obj.apscryopcb[pos],
            closing_date: closing_date,
            year_end: this.transactionVariables.purchase.apy[asset_number],
        }  
        if(closing_date == '31st March'){
            part_scrap.year_begining = obj.ac2[pos]
            part_scrap.year_end= obj.ac2[pos]+1
            max = apscrc5[pos]
        }
        schedule.push(part_scrap)
        for(j=schedule[i-1].year_begining + 1;j<=max;j++){
            var purchase = {
                opening_date : opening_date,
                year_begining: schedule[i-1].year_begining + 1,
                opening_balance: schedule[i-1].closing_balance,
                depreciation: schedule[i-1].closing_balance * d,
                closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                closing_date: closing_date,
                year_end: schedule[i-1].year_begining + 1,
            }
            schedule.push(part_scrap)
            i++
        }
        this.schedules.part_scrap.push(schedule)
        return schedule[schedule.length-1].opening_balance
    },
    createAssetPartTheftSchedule: function(closing_date, d, opening_date, obj, pos, asset_number){
        this.schedules.part_theft = []
        var schedule = []
        var i = 1, max = obj.aptdy[pos]
        var part_theft = {
            opening_date : opening_date,
            year_begining: this.transactionVariables.purchase.apy[asset_number],
            opening_balance: null,
            depreciation: null,
            closing_balance: obj.aptdyopcb[pos],
            closing_date: closing_date,
            year_end: this.transactionVariables.purchase.apy[asset_number],
        }  
        if(closing_date == '31st March'){
            part_theft.year_begining = obj.ac2[pos]
            part_theft.year_end = obj.ac2[pos]+1
            max = obj.aptdc5[pos]
        }
        schedule.push(part_theft)
        for(j=schedule[i-1].year_begining + 1;j<=max;j++){
            var purchase = {
                opening_date : opening_date,
                year_begining: schedule[i-1].year_begining + 1,
                opening_balance: schedule[i-1].closing_balance,
                depreciation: schedule[i-1].closing_balance * d,
                closing_balance: schedule[i-1].closing_balance - (schedule[i-1].closing_balance * d),
                closing_date: closing_date,
                year_end: schedule[i-1].year_begining + 1,
            }
            schedule.push(part_theft)
            i++
        }
        this.schedules.part_theft.push(schedule)
        return schedule[schedule.length-1].opening_balance
    },
    createTotalAssetsBlockSchedule: function(closing_date){
        let new_schedule = JSON.parse(JSON.stringify(this.schedules.balance))
        console.log("Balance Schedule", this.schedules.balance)
        console.log("Purchase Schedule", this.schedules.purchase)
        var k = 0;
        if(this.schedules.balance.length == 0){
            new_schedule = JSON.parse(JSON.stringify(this.schedules.purchase[0]))
            k = 1
        }
        for(var i=k;i<this.schedules.purchase.length;i++){
            // Asset Schedule - I
            let obj2 = this.schedules.purchase[i]
            new_schedule = this.addTwoSchedules(new_schedule, obj2, new_schedule)
        }
        // for(var i=0;i<new_schedule.length;i++){
        //     for(var j=0;j<this.transactionVariables.purchase.apy.length;j++){
        //         if(closing_date == '31st December' && (this.transactionVariables.purchase.apy[j] == new_schedule[i].year_begining)){
        //             new_schedule[i].closing_balance += this.transactionVariables.purchase.ayopcb[j]
        //         }else if(closing_date == '31st March' && ((this.transactionVariables.purchase.ac2[j]-1) == new_schedule[i].year_begining)){
        //             new_schedule[i].closing_balance += this.transactionVariables.purchase.ayopcb[j]
        //         }
        //     }
        // }
        console.log("Total Assets Block Schedule", new_schedule)
    },
    addTwoSchedules: function(obj1, obj2, new_schedule){
        for(var i=0;i<obj1.length;i++){
            for(var j=0;j<obj2.length-1;j++){
                if(obj1[i].year_begining == obj2[j].year_begining){
                    let schedule = new_schedule[i]
                    schedule.opening_balance += obj2[j].opening_balance
                    schedule.closing_balance += obj2[j].closing_balance
                    schedule.depreciation += obj2[j].depreciation
                    if(new_schedule.length-1 >= i){
                        new_schedule[i] = schedule
                    }else{
                        new_schedule.push(schedule)
                    }
                }
            }
        }
        return new_schedule
    },
    getShortDate: function(date){
        switch(date){
            case "1st January": return "01/01/"
            case "31st January": return "31/01/"
            case "1st February": return "01/02/"
            case "28th February": return "28/02/"
            case "1st March": return "01/03/"
            case "31st March": return "31/03/"
            case "1st April": return "01/04/"
            case "30th April": return "30/04/"
            case "1st May": return "01/05/"
            case "31st May": return "31/05/"
            case "1st June": return "01/06/"
            case "30th June": return "30/06/"
            case "1st July": return "01/07/"
            case "31st July": return "31/07/"
            case "1st August": return "01/08/"
            case "31st August": return "31/08/"
            case "1st Sepetember": return "01/09/"
            case "30th Sepetember": return "30/09/"
            case "1st October": return "01/10/"
            case "31st October": return "31/10/"
            case "1st Novemeber": return "01/11/"
            case "30th Novemeber": return "30/11/"
            case "1st December": return "01/12/"
            case "31st December": return "31/12/"
        }
    },
    createAssetAccount: function(closing_date, opening_date, d){
        localStorage.removeItem('assetAccount')
        localStorage.removeItem('depreciationAccount')
        localStorage.removeItem('pnlAccount')

        let depreciation_account = {
            "account_name": "depreciation_account",
            "debit": [],
            "credit": []
        }
        let pnl_account = {
            "account_name": "pnl_account",
            "debit": [],
            "credit": []
        }
        let obj = {
            "account_name": "asset_account",
            "debit": [],
            "credit": []
        }

        if(this.transactionVariables.gob){
              obj.debit.push({
                "date": "1/1/"+this.transactionVariables.goby,
                "particulars": "To balance b/d",
                "extra": "",
                "amount": parseFloat(this.transactionVariables.gob.toFixed(2)),
                "form": "Opening Balance (Form 1)",
                "title": "Opening Balance",
                "more": null
            })
        }

        for(var i=0;i<this.transactionVariables.purchase.apm.length;i++){
            let acc = {
                "date": this.getShortDate(this.transactionObject[1].values[i].date_of_purchase) + this.transactionVariables.purchase.apy[i],
                "particulars": `To bank a/c`,
                "extra": `(${this.currentAsset} ${i+1})`,
                "amount": parseFloat(this.transactionVariables.purchase.atc[i].toFixed(2)),
                "form": "Purchase (Form 2)",
                "title": "Purchase",
                "more": null
            }
            obj.debit.push(acc)

            acc = {
                "date": this.getShortDate(closing_date) + this.transactionVariables.purchase.apy[i],
                "particulars": `By depreciation a/c`,
                "extra": `(On ${this.currentAsset} ${i+1})`,
                "amount": parseFloat(this.transactionVariables.purchase.ayopd[i].toFixed(2)),
                "form": "Purchase (Form 2)",
                "title": "Depreciation",
                "more": this.getDepreciationOfAssetPurchase(i, d, closing_date)
            }

            obj.credit.push(acc)
            depreciation_account.credit.push(acc)

            // Sales - Asset Account
            if(this.transactionObject[2].values.length > 0 && this.transactionObject[2].values[i].asset == "General / Other"){
                acc = {
                    "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.gsy[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} sold)`,
                    "amount": parseFloat(this.transactionVariables.sales.gsyosd[i].toFixed(2)),
                    "form": "Sale (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "sales", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                obj.credit.push({
                    "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.gsy[i],
                    "particulars": `By bank a/c`,
                    "extra": `(Sales)`,
                    "amount": parseFloat(this.transactionVariables.sales.gsyosd[i].toFixed(2)),
                    "form": "Sale (Form 3)",
                    "title": "Sale",
                    "more": null
                })

                if(this.transactionVariables.sales.gspl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.gsy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss on Sale)`,
                        "amount": parseFloat(this.transactionVariables.sales.gspl[i].toFixed(2)),
                        "form": "Sale (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "sales", false, true, false, false)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.sales.gspl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.gsy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Profit on Sale)`,
                        "amount": parseFloat((this.transactionVariables.sales.gspl[i] * -1).toFixed(2)),
                        "form": "Sale (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "sales", true, true, false, false)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }

            }else if(this.transactionObject[2].values.length > 0 && this.transactionObject[2].values[i].values.extent_of_sale.includes("whole")){
                acc = {
                    "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.asy[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} sold)`,
                    "amount": parseFloat(this.transactionVariables.sales.ayosd[i].toFixed(2)),
                    "form": "Sale (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "sales", false, true, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                obj.credit.push({
                    "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.asy[i],
                    "particulars": `By bank a/c`,
                    "extra": `(Sale of ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.sales.as[i].toFixed(2)),
                    "form": "Sale (Form 3)",
                    "title": "Sale",
                    "more": null
                })

                if(this.transactionVariables.sales.aspl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.asy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss on Sale)`,
                        "amount": parseFloat(this.transactionVariables.sales.aspl[i].toFixed(2)),
                        "form": "Sale (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "sales", false, false, true, false)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.sales.aspl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.asy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Profit on Sale)`,
                        "amount": parseFloat((this.transactionVariables.sales.aspl[i] * -1).toFixed(2)),
                        "form": "Sale (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "sales", true, false, true, false)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }

            }else if(this.transactionObject[2].values.length > 0){
                acc = {
                    "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.apsy[i],
                    "particulars": `By depreciation a/c`,
                    "extra": ``,
                    "amount": parseFloat(this.transactionVariables.sales.ayopsd[i].toFixed(2)),
                    "form": "Sale (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "sales", false, false, true)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                obj.credit.push({
                    "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.apsy[i],
                    "particulars": `By bank a/c`,
                    "extra": `(Part Sale of ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.sales.aps[i].toFixed(2)),
                    "form": "Sale (Form 3)",
                    "title": "Sale",
                    "more": null
                })

                if(this.transactionVariables.sales.apspl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.apsy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss on Sale)`,
                        "amount": parseFloat(this.transactionVariables.sales.apspl[i].toFixed(2)),
                        "form": "Sale (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "sales", false, false, false, true)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.sales.apspl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[2].values[i].values.date_of_sale) + this.transactionVariables.sales.apsy[i],
                        "particulars": `By P&L a/c`,
                        "extra": "(Profit on Sale)",
                        "amount": parseFloat((this.transactionVariables.sales.apspl[i] * -1).toFixed(2)),
                        "form": "Sale (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "sales", true, false, false, true)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }
            }

            //Scrapping - Asset Account
            if(this.transactionObject[3].values.length > 0 && this.transactionObject[3].values[i].asset == "General / Other"){
                acc = {
                    "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.gscry[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} scrapped)`,
                    "amount": parseFloat(this.transactionVariables.scrapped.gscryosd[i].toFixed(2)),
                    "form": "Scrap (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "scrapped", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                obj.credit.push({
                    "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.gscry[i],
                    "particulars": `By bank a/c`,
                    "extra": `(Scrap value realised)`,
                    "amount": parseFloat(this.transactionVariables.scrapped.gscryosd[i].toFixed(2)),
                    "form": "Scrap (Form 3)",
                    "title": "Scrapped",
                    "more": null
                })

                if(this.transactionVariables.scrapped.gscrpl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.gscry[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss on Scrap)`,
                        "amount": parseFloat(this.transactionVariables.scrapped.gscrpl[i].toFixed(2)),
                        "form": "Scrap (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "scrapped", false, true, false, false)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.scrapped.gscrpl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.gscry[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Profit on Scrap)`,
                        "amount": parseFloat((this.transactionVariables.scrapped.gscrpl[i] * -1).toFixed(2)),
                        "form": "Scrap (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "scrapped", true, true, false, false)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }

            }else if(this.transactionObject[3].values.length > 0 && this.transactionObject[3].values[i].values.extent_of_sale.includes("whole")){
                acc = {
                    "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.ascry[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} scrapped)`,
                    "amount": parseFloat(this.transactionVariables.scrapped.aycrosd[i].toFixed(2)),
                    "form": "Scrap (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "scrapped", false, true, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                obj.credit.push({
                    "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.ascry[i],
                    "particulars": `By bank a/c`,
                    "extra": `(Scrap of ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.scrapped.ascr[i].toFixed(2)),
                    "form": "Scrap (Form 3)",
                    "title": "Scrap",
                    "more": null
                })

                if(this.transactionVariables.scrapped.ascrpl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.ascry[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss on Scrap)`,
                        "amount": parseFloat(this.transactionVariables.scrapped.ascrpl[i].toFixed(2)),
                        "form": "Scrap (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "scrapped", false, false, true, false)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.scrapped.ascrpl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.ascry[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Profit on Scrap)`,
                        "amount": parseFloat((this.transactionVariables.scrapped.ascrpl[i] * -1).toFixed(2)),
                        "form": "Scrap (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "scrapped", true, false, true, false)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }

            }else if(this.transactionObject[3].values.length > 0){
                acc = {
                    "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.apscry[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On part of ${this.currentAsset} ${i+1} scrapped`,
                    "amount": parseFloat(this.transactionVariables.scrapped.ayopscrd[i].toFixed(2)),
                    "form": "Scrap (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "scrapped", false, false, true)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                obj.credit.push({
                    "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.apscry[i],
                    "particulars": `By bank a/c`,
                    "extra": `Scrap value realised`,
                    "amount": parseFloat(this.transactionVariables.scrapped.apscr[i].toFixed(2)),
                    "form": "Scrap (Form 3)",
                    "title": "Scrap",
                    "more": null
                })

                if(this.transactionVariables.scrapped.apscrpl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.apscry[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss on part scrapped)`,
                        "amount": parseFloat(this.transactionVariables.scrapped.apscrpl[i].toFixed(2)),
                        "form": "Scrap (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "scrapped", false, false, false, true)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.scrapped.apscrpl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[3].values[i].values.date_of_sale) + this.transactionVariables.scrapped.apscry[i],
                        "particulars": `By P&L a/c`,
                        "extra": "(Profit on part scrapped)",
                        "amount": parseFloat((this.transactionVariables.scrapped.apspl[i] * -1).toFixed(2)),
                        "form": "Scrap (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "scrapped", true, false, false, true)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }
            }

            //Theft/Destruction - Asset Account
            if(this.transactionObject[4].values.length > 0 && this.transactionObject[4].values[i].asset == "General / Other"){
                acc = {
                    "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.gtdy[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} destroyed)`,
                    "amount": parseFloat(this.transactionVariables.destroyed.gtdyotdd[i].toFixed(2)),
                    "form": "Destroyed (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "destroyed", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                if(this.transactionVariables.destroyed.gtdpl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.gtdy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss)`,
                        "amount": parseFloat(this.transactionVariables.destroyed.gtdpl[i].toFixed(2)),
                        "form": "Destroyed (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "destroyed", false, true, false, false)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.destroyed.gtdpl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.gtdy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Profit on insurance settlement)`,
                        "amount": parseFloat((this.transactionVariables.destroyed.gtdpl[i] * -1).toFixed(2)),
                        "form": "Destroyed (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "destroyed", true, true, false, false)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }

            }else if(this.transactionObject[4].values.length > 0 && this.transactionObject[4].values[i].values.extent_of_sale.includes("whole")){
                acc = {
                    "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.atdy[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} destroyed)`,
                    "amount": parseFloat(this.transactionVariables.scrapped.aycrosd[i].toFixed(2)),
                    "form": "Destroyed (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "destroyed", false, true, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                if(this.transactionVariables.destroyed.atdpl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.atdy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss)`,
                        "amount": parseFloat(this.transactionVariables.destroyed.ayotdd[i].toFixed(2)),
                        "form": "Destroyed (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "destroyed", false, false, true, false)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.destroyed.atdpl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.atdy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Profit on insurance settlement)`,
                        "amount": parseFloat((this.transactionVariables.destroyed.ayotdd[i] * -1).toFixed(2)),
                        "form": "Destroyed (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "destroyed", true, false, true, false)
                    }
                    obj.debit.push(acc)
                    pnl_account.debit.push(acc)
                }

            }else if(this.transactionObject[4].values.length > 0){
                acc = {
                    "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.aptdy[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On part of ${this.currentAsset} ${i+1} destroyed`,
                    "amount": parseFloat(this.transactionVariables.destroyed.ayoptdd[i].toFixed(2)),
                    "form": "Destroyed (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "destroyed", false, false, true)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

                if(this.transactionVariables.destroyed.aptdpl[i] > 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.aptdy[i],
                        "particulars": `By P&L a/c`,
                        "extra": `(Loss)`,
                        "amount": parseFloat(this.transactionVariables.destroyed.aptdpl[i].toFixed(2)),
                        "form": "Destroyed (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "destroyed", false, false, false, true)
                    }
                    obj.credit.push(acc)
                    pnl_account.credit.push(acc)
                }else if(this.transactionVariables.destroyed.aptdpl[i] < 0){
                    acc = {
                        "date": this.getShortDate(this.transactionObject[4].values[i].values.date_of_sale) + this.transactionVariables.destroyed.aptdy[i],
                        "particulars": `By P&L a/c`,
                        "extra": "(Profit on insurance settlement)",
                        "amount": parseFloat((this.transactionVariables.destroyed.aptdpl[i] * -1).toFixed(2)),
                        "form": "Destroyed (Form 3)",
                        "title": "P&L",
                        "more": this.getProfitOrLossOnMethod(i, d, closing_date, opening_date, "destroyed", true, false, false, true)
                    }
                    obj.debit.push(acc)
                    pnl_account.credit.push(acc)
                }
            }

            //Addition - Asset Account
            if(this.transactionObject[5].values.length > 0 && this.transactionObject[5].values[i].asset == "General / Other" && this.transactionObject[5].values[i].values.extent_of_sale == "Significant"){

                obj.debit.push({
                    "date": this.getShortDate(this.transactionObject[5].values[i].values.date_of_sale) + this.transactionVariables.addition.gay[i],
                    "particulars": `To bank a/c`,
                    "extra": `(Addition to ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.addition.ga[i].toFixed(2)),
                    "form": "Addition (Form 3)",
                    "title": "Addition",
                    "more": null
                })

                acc = {
                    "date": this.getShortDate(closing_date) + this.transactionVariables.addition.gay[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On addition to ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.addition.gayoad[i].toFixed(2)),
                    "form": "Addition (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "addition", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

            }else if(this.transactionObject[5].values.length > 0 && this.transactionObject[5].values[i].asset == "General / Other" && this.transactionObject[5].values[i].values.extent_of_sale == "Negligible"){
                pnl_account.debit.push({
                    "date": this.transactionVariables.addition.gay[i],
                    "particulars": `To additions to ${this.currentAsset}`,
                    "extra": ``,
                    "amount": parseFloat(this.transactionVariables.addition.ga[i].toFixed(2)),
                    "form": "Addition (Form 3)",
                    "title": "Addition",
                    "more": null
                })
            }else if(this.transactionObject[5].values.length > 0 && this.transactionObject[5].values[i].values.extent_of_sale == "Significant"){
                obj.debit.push({
                    "date": this.getShortDate(this.transactionObject[5].values[i].values.date_of_sale) + this.transactionVariables.addition.aay[i],
                    "particulars": `To bank a/c`,
                    "extra": `(Addition to ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.addition.aa[i].toFixed(2)),
                    "form": "Addition (Form 3)",
                    "title": "Addition",
                    "more": null
                })

                acc = {
                    "date": this.getShortDate(closing_date) + this.transactionVariables.addition.aay[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On addition to ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.addition.ayoad[i].toFixed(2)),
                    "form": "Addition (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "addition", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

            }else if(this.transactionObject[5].values.length > 0 && this.transactionObject[5].values[i].values.extent_of_sale == "Negligible"){
                pnl_account.push({
                    "date": this.transactionVariables.addition.aay[i],
                    "particulars": `To bank a/c`,
                    "extra": `(To additions to ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.addition.aa[i].toFixed(2)),
                    "form": "Addition (Form 3)",
                    "title": "Addition",
                    "more": null
                })
            }

            //Replacement - Asset Account
            if(this.transactionObject[6].values.length > 0 && this.transactionObject[6].values[i].asset == "General / Other" && this.transactionObject[6].values[i].values.extent_of_sale == "Significant"){

                obj.debit.push({
                    "date": this.getShortDate(this.transactionObject[6].values[i].values.date_of_sale) + this.transactionVariables.replacement.gry[i],
                    "particulars": `To bank a/c`,
                    "extra": `(Cost of replacement)`,
                    "amount": parseFloat(this.transactionVariables.replacement.grc[i].toFixed(2)),
                    "form": "Replacement (Form 3)",
                    "title": "Replacement",
                    "more": null
                })

                acc = {
                    "date": this.getShortDate(closing_date) + this.transactionVariables.replacement.gry[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} replaced)`,
                    "amount": parseFloat(this.transactionVariables.replacement.gryord[i].toFixed(2)),
                    "form": "Replacement (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "replacement", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

            }else if(this.transactionObject[6].values.length > 0 && this.transactionObject[6].values[i].extent_of_sale.includes("whole") && this.transactionObject[6].values[i].values.extent_of_sale == "Significant"){
                
                obj.debit.push({
                    "date": this.getShortDate(this.transactionObject[6].values[i].values.date_of_sale) + this.transactionVariables.replacement.ary[i],
                    "particulars": `To bank a/c`,
                    "extra": `(Cost of replacement of ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.replacement.arc[i].toFixed(2)),
                    "form": "Replacement (Form 3)",
                    "title": "Replacement",
                    "more": null
                })

                acc = {
                    "date": this.getShortDate(closing_date) + this.transactionVariables.replacement.ary[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} replaced)`,
                    "amount": parseFloat(this.transactionVariables.replacement.ayord[i].toFixed(2)),
                    "form": "Replacement (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "replacement", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

            }else if(this.transactionObject[6].values.length > 0 && this.transactionObject[6].values[i].extent_of_sale.includes("part") && this.transactionObject[6].values[i].values.extent_of_sale == "Significant"){
                
                obj.debit.push({
                    "date": this.getShortDate(this.transactionObject[6].values[i].values.date_of_sale) + this.transactionVariables.replacement.apry[i],
                    "particulars": `To bank a/c`,
                    "extra": `(Cost of replacement of ${this.currentAsset} ${i+1})`,
                    "amount": parseFloat(this.transactionVariables.replacement.aprc[i].toFixed(2)),
                    "form": "Replacement (Form 3)",
                    "title": "Replacement",
                    "more": null
                })

                acc = {
                    "date": this.getShortDate(closing_date) + this.transactionVariables.replacement.apry[i],
                    "particulars": `By depreciation a/c`,
                    "extra": `(On ${this.currentAsset} ${i+1} replaced)`,
                    "amount": parseFloat(this.transactionVariables.replacement.ayoprd[i].toFixed(2)),
                    "form": "Replacement (Form 3)",
                    "title": "Depreciation",
                    "more": this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, "replacement", true, false, false)
                }
                obj.credit.push(acc)
                depreciation_account.credit.push(acc)

            }else if(this.transactionObject[6].values.length > 0 && this.transactionObject[6].values[i].extent_of_sale.includes("part") && this.transactionObject[6].values[i].values.extent_of_sale == "Negligible"){
                pnl_account.push({
                    "date": this.transactionVariables.replacement.apry[i],
                    "particulars": `To repairs a/c`,
                    "extra": ``,
                    "amount": parseFloat(this.transactionVariables.replacement.aprc[i].toFixed(2)),
                    "form": "Replacement (Form 3)",
                    "title": "Replacement",
                    "more": null
                })
            }
        }
        console.log("Asset Account", obj)
        console.log("Depreciation Account", depreciation_account)
        console.log("PnL Account", pnl_account)

        localStorage.setItem('assetAccount', JSON.stringify(obj))
        localStorage.setItem('depreciationAccount', JSON.stringify(depreciation_account))
        localStorage.setItem('pnlAccount', JSON.stringify(pnl_account))
    },
    getDepreciationOfAssetPurchase: function(i, d, closing_date){
        let obj = [
           `Depreciation\t= Cost of asset x Rate of Depreciation x No. of months / 12`,
           `= ${this.transactionVariables.purchase.atc[i]} x ${d} x ${this.transactionVariables.purchase.apdp[i]} / 12`,
           `= ${this.transactionVariables.purchase.ayopd[i]}`
        ]
        return obj
    },
    getDepreciationOfAssetAddition: function(i, d, closing_date, is_asset, is_whole, is_part){
        if(!is_part){
            let obj = [
               `Depreciation = Amount on addition x Rate of Depreciation x No. of months / 12`,
               `             = ${this.transactionVariables.addition.ga[i]} x ${d} x ${this.transactionVariables.addition.gadp[i]} / 12`,
               `             = ${this.transactionVariables.addition.gayoad[i]}`
            ]
            return obj
        }else{
            let obj = [
               `Depreciation = Amount on addition x Rate of Depreciation x No. of months / 12`,
               `             = ${this.transactionVariables.addition.aa[i]} x ${d} x ${this.transactionVariables.addition.aadp[i]} / 12`,
               `             = ${this.transactionVariables.addition.ayoad[i]}`
            ]
            return obj
        }
    },
    getDepreciationOfAssetReplacement: function(i, d, closing_date, is_asset, is_whole, is_part){
        if(is_asset){
            let obj = [
               `Depreciation = Cost of replacement x Rate of Depreciation x No. of months / 12`,
               `             = ${this.transactionVariables.replacement.grc[i]} x ${d} x ${this.transactionVariables.replacement.grdp[i]} / 12`,
               `             = ${this.transactionVariables.replacement.gryord[i]}`
            ]
            return obj
        }else if(is_whole){
            let obj = [
               `Depreciation = Cost of replacement x Rate of Depreciation x No. of months / 12`,
               `             = ${this.transactionVariables.replacement.arc[i]} x ${d} x ${this.transactionVariables.replacement.ardp[i]} / 12`,
               `             = ${this.transactionVariables.replacement.ayord[i]}`
            ]
            return obj
        }else{
            let obj = [
               `Depreciation = Cost of part replacement x Rate of Depreciation x No. of months / 12`,
               `             = ${this.transactionVariables.replacement.aprc[i]} x ${d} x ${this.transactionVariables.replacement.aprdp[i]} / 12`,
               `             = ${this.transactionVariables.replacement.ayoprd[i]}`
            ]
            return obj
        }
    },
    getDepreciationOfAssetMethod: function(i, d, closing_date, opening_date, method, is_asset, is_whole, is_part){
        console.log("getDepreciationOfAssetMethod",i, d, closing_date, opening_date, method, is_asset, is_whole, is_part)
        let def, rows
        if(method == 'sales'){
            if(is_asset){
                def = {
                    var1: this.transactionVariables.sales.gspm[i],
                    var2: this.transactionVariables.sales.gspy[i],
                    var3: this.transactionVariables.sales.gsc[i],
                    var4: this.transactionVariables.sales.gspy[i],
                    var5: this.transactionVariables.sales.gsc[i],
                    var6: this.transactionVariables.sales.gspdp[i],
                    var7: this.transactionVariables.sales.gsyopd[i],
                    var8: this.transactionVariables.sales.gsy[i],
                    var9: this.transactionVariables.sales.gsyosob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.sales.gsy[i]:this.transactionVariables.sales.gsc7[i],
                    var11: this.transactionVariables.sales.gsyosob[i],
                    var12: this.transactionVariables.sales.gsdp[i],
                    var13: this.transactionVariables.sales.gsyosd[i],
                }
                rows = this.schedules.sales[i]
            }else if(is_whole){
                def = {
                    var1: this.transactionVariables.purchase.apm[i],
                    var2: this.transactionVariables.purchase.apy[i],
                    var3: this.transactionVariables.purchase.atc[i],
                    var4: this.transactionVariables.purchase.apy[i],
                    var5: this.transactionVariables.purchase.atc[i],
                    var6: this.transactionVariables.purchase.apdp[i],
                    var7: this.transactionVariables.purchase.ayopd[i],
                    var8: this.transactionVariables.sales.asy[i],
                    var9: this.transactionVariables.sales.ayosob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.sales.asy[i]:this.transactionVariables.sales.asc5[i],
                    var11: this.transactionVariables.sales.ayosd[i],
                    var12: this.transactionVariables.sales.ayosob[i],
                    var13: this.transactionVariables.sales.ayosd[i]
                }
                rows = this.schedules.purchase[i]
            }else{
                def = {
                    var1: this.transactionVariables.purchase.apm[i],
                    var2: this.transactionVariables.purchase.apy[i],
                    var3: this.transactionVariables.sales.apsc[i],
                    var4: (closing_date == '31st December')?this.transactionVariables.purchase.apy[i]:this.transactionVariables.purchase.ac2[i],
                    var5: this.transactionVariables.sales.apsc[i],
                    var6: this.transactionVariables.purchase.apdp[i],
                    var7: this.transactionVariables.sales.apyopd[i],
                    var8: (closing_date == '31st Decemebr')?this.transactionVariables.sales.apsy[i]:this.transactionVariables.sales.apsc5[i],
                    var9: this.transactionVariables.sales.ayopsob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.sales.apsy[i]:this.transactionVariables.sales.apsc5[i],
                    var11: this.transactionVariables.sales.ayopsob[i],
                    var12: this.transactionVariables.sales.apsdp[i],
                    var13: this.transactionVariables.sales.ayopsd[i],
                }
                rows = this.schedules.purchase[i]
            }
        }else if(method == 'scrapped' && !is_part){
            if(is_asset){
                def = {
                    var1: this.transactionVariables.scrapped.gscrpm[i],
                    var2: this.transactionVariables.scrapped.gscrpy[i],
                    var3: this.transactionVariables.scrapped.gscrc[i],
                    var4: (closing_date == '31st Decemeber')?this.transactionVariables.scrapped.gscrpy[i]:this.transactionVariables.scrapped.gscrc2[i],
                    var5: this.transactionVariables.scrapped.gscrc[i],
                    var6: this.transactionVariables.scrapped.gscrpdp[i],
                    var7: this.transactionVariables.scrapped.gscryopd[i],
                    var8: (closing_date == '31st December')?this.transactionVariables.scrapped.gscry[i]:this.transactionVariables.scrapped.gscrc7[i],
                    var9: this.transactionVariables.scrapped.gscryosob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.scrapped.gscry[i]:this.transactionVariables.scrapped.gscrc7[i],
                    var11: this.transactionVariables.scrapped.gsyosob[i],
                    var12: this.transactionVariables.scrapped.gscrdp[i],
                    var13: this.transactionVariables.scrapped.gscryosd[i],
                }
                rows = this.schedules.scraps[i]
            }else if(is_whole){
                def = {
                    var1: this.transactionVariables.purchase.apm[i],
                    var2: this.transactionVariables.purchase.apy[i],
                    var3: this.transactionVariables.purchase.atc[i],
                    var4: (closing_date == '31st December')?this.transactionVariables.purchase.apy[i]:this.transactionVariables.scrapped.ac2[i],
                    var5: this.transactionVariables.purchase.atc[i],
                    var6: this.transactionVariables.purchase.apdp[i],
                    var7: this.transactionVariables.purchase.ayopd[i],
                    var8: (closing_date == '31st December')?this.transactionVariables.scrapped.ascry[i]:this.transactionVariables.scrapped.ascrc5[i],
                    var9: this.transactionVariables.scrapped.ayoscrob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.scrapped.ascry[i]:this.transactionVariables.scrapped.ascrc5[i],
                    var11: this.transactionVariables.scrapped.ayoscrob[i],
                    var12: this.transactionVariables.scrapped.ascrdp[i],
                    var13: this.transactionVariables.scrapped.ayoscrd[i]
                }
                rows = this.schedules.purchase[i]
            }else{
                def = {
                    var1: this.transactionVariables.purchase.apm[i],
                    var2: this.transactionVariables.purchase.apy[i],
                    var3: this.transactionVariables.purchase.apscrc[i],
                    var4: (closing_date == '31st December')?this.transactionVariables.purchase.apy[i]:this.transactionVariables.ac2[i],
                    var5: this.transactionVariables.purchase.apscrc[i],
                    var6: this.transactionVariables.purchase.apdp[i],
                    var7: this.transactionVariables.purchase.apscryopd[i],
                    var8: (closing_date == '31st December')?this.transactionVariables.purchase.apscry[i]:this.transactionVariables.purchase.apscrc5[i],
                    var9: this.transactionVariables.purchase.ayopscrob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.purchase.apscry[i]:this.transactionVariables.purchase.apscrc5[i],
                    var11: this.transactionVariables.purchase.ayopscrob[i],
                    var12: this.transactionVariables.purchase.apscrdp[i],
                    var13: this.transactionVariables.purchase.ayopscrd[i]
                }
                rows = this.schedules.purchase[i]
            }
        }else if(method == 'theft'){
            if(is_asset){
                def = {
                    var1 : this.transactionVariables.destroyed.gtdpm[i],
                    var2 : this.transactionVariables.destroyed.gtdpy[i],
                    var3 : this.transactionVariables.destroyed.gtdc[i],
                    var4 : (closing_date = '31st December')?this.transactionVariables.destroyed.gtdpy[i]:this.transactionVariables.destroyed.gtdc2[i],
                    var5 : this.transactionVariables.destroyed.gtdc[i],
                    var6 : this.transactionVariables.destroyed.gtdpdp[i],
                    var7 : this.transactionVariables.destroyed.gtdyopd[i],
                    var8 : (closing_date == '31st December')?this.transactionVariables.destroyed.gtdy[i]:this.transactionVariables.destroyed.gtdc7[i],
                    var9 : this.transactionVariables.destroyed.gtdyotdob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.destroyed.gtdy[i]:this.transactionVariables.destroyed.gtdc7[i],
                    var11: this.transactionVariables.destroyed.gtdyotdob[i],
                    var12: this.transactionVariables.destroyed.gtddp[i],
                    var13: this.transactionVariables.destroyed.gtdyotdd[i]
                }
                rows = this.schedules.thefts[i]
            }else if(is_whole){
                def = {
                    var1: this.transactionVariables.purchase.apm[i],
                    var2: this.transactionVariables.purchase.apy[i],
                    var3: this.transactionVariables.purchase.atc[i],
                    var4: (closing_date == '31st December')?this.transactionVariables.purchase.apy[i]:this.transactionVariables.ac2[i],
                    var5: this.transactionVariables.purchase.atc[i],
                    var6: this.transactionVariables.purchase.apdp[i],
                    var7: this.transactionVariables.purchase.ayopd[i],
                    var8: (closing_date == '31st December')?this.transactionVariables.purchase.atdy[i]:this.transactionVariables.purchase.atdc5[i],
                    var9: this.transactionVariables.purchase.ayotdob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.purchase.atdy[i]:this.transactionVariables.purchase.atdc5[i],
                    var11: this.transactionVariables.purchase.ayotdob[i],
                    var12: this.transactionVariables.purchase.atddp[i],
                    var13: this.transactionVariables.purchase.ayotdd[i]
                }
                rows = this.schedules.purchase[i]
            }else if(is_part){
                def = {
                    var1: this.transactionVariables.destroyed.apm[i],
                    var2: this.transactionVariables.destroyed.apy[i],
                    var3: this.transactionVariables.destroyed.aptdc[i],
                    var4: (closing_date == '31st December')?this.transactionVariables.destroyed.apy[i]:this.transactionVariables.destroyed.ac2[i],
                    var5: this.transactionVariables.destroyed.aptdc[i],
                    var6: this.transactionVariables.destroyed.apdp[i],
                    var7: this.transactionVariables.destroyed.aptdyopd[i],
                    var8: (closing_date == '31st December')?this.transactionVariables.destroyed.aptdy[i]:this.transactionVariables.destroyed.aptdc5[i],
                    var9: this.transactionVariables.destroyed.ayoptdob[i],
                    var10: (closing_date == '31st December')?this.transactionVariables.destroyed.aptdy[i]:this.transactionVariables.destroyed.aptdc5[i],
                    var11: this.transactionVariables.destroyed.ayoptdob[i],
                    var12: this.transactionVariables.destroyed.aptddp[i],
                    var13: this.transactionVariables.destroyed.ayoptdd[i]
                }
                rows = this.schedules.purchase[i]
            }
        }
        let depreciation = []
        let block = [{
            "desc": `Cost of ${this.currentAsset} sold as on ${def.var1.toFixed(2)}/${def.var2.toFixed(2)}`,
            "value": parseFloat(def.var3.toFixed(2))
        }]
        if(closing_date == '31st December'){
            block.push({
                "desc": `Less: Depreciation for ${def.var4.toFixed(2)}\n(${def.var5.toFixed(2)} x ${d} x ${def.var6.toFixed(2)} / 12)`,
                "value": parseFloat(def.var7.toFixed(2))
            })
        }else{
            block.push({
                "desc": `Less: Depreciation for ${parseFloat(def.var4.toFixed(2))-1} - ${def.var4}\n(${def.var5.toFixed(2)} x ${d} x ${def.var6.toFixed(2)} / 12)`,
                "value": parseFloat(def.var7.toFixed(2))
            })
        }
        depreciation.push(block)
        console.log("all rows", rows)
        for(var j=0;j<rows.length;j++){
            console.log("Rows", rows[j], rows.length)
            block = [{
                "desc": `WDV on ${opening_date} / ${rows[j].year_begining}`,
                "value": (rows[j].opening_balance)?parseFloat(rows[j].opening_balance.toFixed(2)):null
            }]
            if(closing_date == '31st December'){
                block.push({
                    "desc": `Less: Depreciation for ${rows[j].year_begining}\n(${rows[j].opening_balance} x ${d})`,
                    "value": (rows[j].depreciation)?parseFloat(rows[j].depreciation.toFixed(2)):null
                })
            }else{
                block.push({
                    "desc": `Less: Depreciation for ${rows[j].year_begining} - ${rows[j].year_end}\n(${rows[j].opening_balance} x ${d})`,
                    "value": (rows[j].depreciation)?parseFloat(rows[j].depreciation.toFixed(2)):null
                })
            }
            depreciation.push(block)
        }
        block = [{
                "desc": `WDV on ${opening_date} / ${def.var8.toFixed(2)}`,
                "value": parseFloat(def.var9.toFixed(2))
            }]
        if(closing_date == '31st December'){
            block.push({
                "desc": `Less: Depreciation for ${def.var10.toFixed(2)}\n(${def.var11.toFixed(2)} x ${d} x ${def.var12.toFixed(2)} / 12)`,
                "value": parseFloat(def.var13.toFixed(2))
            })
        }else{
            block.push({
                "desc": `Less: Depreciation for ${def.var10.toFixed(2)} - ${parseFloat(def.var10.toFixed(2))+1}\n(${def.var11.toFixed(2)} x ${d} x ${def.var12.toFixed(2)} / 12)`,
                "value": parseFloat(def.var13.toFixed(2))
            })
        }
        depreciation.push(block)
        return depreciation
    },
    getProfitOrLossOnMethod: function(i, d, closing_date, opening_date, method, is_profit, is_asset, is_whole, is_part){
        var def = {
            var1: 0, var2: 0, var3: 0
        }
        if(method == 'sales' && is_asset){
            def = {
                var1: this.transactionVariables.sales.gsbv[i],
                var2: this.transactionVariables.sales.gs[i],
                var3: this.transactionVariables.sales.gspl[i]
            }
        }else if(method == 'sales' && is_part){
            def = {
                var1: this.transactionVariables.sales.apsbv[i],
                var2: this.transactionVariables.sales.aps[i],
                var3: this.transactionVariables.sales.apspl[i]
            }
        }else if(method == 'purchase' && is_whole){
            def = {
                var1: this.transactionVariables.purchase.asbv[i],
                var2: this.transactionVariables.purchase.as[i],
                var3: this.transactionVariables.purchase.aspl[i]
            }
        }else if(method == 'scrapped' && is_asset){
            def = {
                var1 : this.transactionVariables.scrapped.gscrbv[i],
                var2 : this.transactionVariables.scrapped.gscr[i],
                var3: this.transactionVariables.scrapped.gscrpl[i]
            }
        }else if(method == 'scrapped' && is_whole){
            def = {
                var1 : this.transactionVariables.scrapped.ascrbv[i],
                var2 : this.transactionVariables.scrapped.ascr[i],
                var3 : this.transactionVariables.scrapped.ascrpl[i]
            }
        }else if(method == 'scrapped' && is_part){
            def = {
                var1 : this.transactionVariables.scrapped.apscrbv[i],
                var2 : this.transactionVariables.scrapped.apscr[i],
                var3 : this.transactionVariables.scrapped.apscrpl[i]
            }
        }else if(method == 'destroyed' && is_asset){
            def = {
                var1 : this.transactionVariables.destroyed.gtdbv[i],
                var2 : this.transactionVariables.destroyed.gtdi[i],
                var3 : this.transactionVariables.destroyed.gtdpl[i]
            }
        }else if(method == 'destroyed' && is_whole){
            def = {
                var1 : this.transactionVariables.destroyed.atdbv[i],
                var2: this.transactionVariables.destroyed.atdi[i],
                var3: this.transactionVariables.destroyed.atdpl[i]
            }
        }else if(method == 'destroyed' && is_part){
            def = {
                var1 : this.transactionVariables.destroyed.aptdbv[i],
                var2 : this.transactionVariables.destroyed.aptdi[i],
                var3 : this.transactionVariables.destroyed.aptdpl[i]
            }
        }
        let loss = this.getDepreciationOfAssetMethod(i, d, closing_date, opening_date, method, is_asset, is_whole, is_part)
        let block = [{
            "desc": "",
            "value": parseFloat(def.var1.toFixed(2))
        },{
            "desc": "Less: Sale proceeds",
            "value": parseFloat(def.var2.toFixed(2))
        }]
        loss.push(block)
        block = [{
            "desc": `${(is_profit)?'Profit':'Loss'} on sale of ${this.currentAsset}`,
            "value": (is_profit)?(-1*parseFloat(def.var3.toFixed(2))):parseFloat(def.var3.toFixed(2))
        }]
        loss.push(block)
        return loss
    },
};

app.initialize();
