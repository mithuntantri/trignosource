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
    totalAssetsBlockSchedule: null,
    openNoteIds: [],
    depreciationAmount: 0,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.baseUrl = localStorage.getItem('baseUrl')

        this.currentAccount = localStorage.getItem('currentAccount')
        
        var tutorials = localStorage.getItem('tutorials')
        this.tutorials = JSON.parse(tutorials).data
        console.log('tutorials', this.tutorials)

        var calculators = localStorage.getItem('calculators')
        this.calculators = JSON.parse(calculators).data

        this.currentAsset = localStorage.getItem('currentAsset')
        let name_elements = document.getElementsByClassName('asset_name')
        for(var i=0;i<name_elements.length;i++){
            name_elements[i].innerHTML = this.currentAsset
        }

        let assetAccount = localStorage.getItem('assetAccount')
        this.assetAccount = JSON.parse(assetAccount)

        let depreciationAccount = localStorage.getItem('depreciationAccount')
        this.depreciationAccount = JSON.parse(depreciationAccount)

        let pnlAccount = localStorage.getItem('pnlAccount')
        this.pnlAccount = JSON.parse(pnlAccount)

        let totalAssetsBlockSchedule = localStorage.getItem('totalAssetsBlockSchedule')
        this.totalAssetsBlockSchedule = JSON.parse(totalAssetsBlockSchedule)

        this.closing_date = localStorage.getItem('closingDate')
        this.depreciationAmounts = []
        this.currentAccountNum = 1
        this.currentAccount = this.depreciationAccount

        if(this.depreciationAccount.all.length>0){
            this.updateAccount()
            console.log("depreciationAmounts", this.depreciationAmounts)
        }
        
        let currentAccountNum = parseInt(localStorage.getItem('currentAccount'))
        if(currentAccountNum == 0){
            this.currentAccount = this.assetAccount
        }else if(currentAccountNum == 1){
            this.currentAccount = this.depreciationAccount
        }else{
            this.currentAccount = this.pnlAccount            
        }
        this.currentAccountNum = currentAccountNum
    
        if(this.currentAccountNum != 1){
            this.updateAccount()            
        }

        let that = this

        let startBtn = document.getElementById('start-btn')
        let nextBtn = document.getElementById('next-btn')

        this.debit_count = 0
        this.debit_rows = 0
        this.credit_count = 0
        this.credit_rows = 0
        this.debits_total = 0
        this.credits_total = 0
        this.total_count = this.currentAccount.all.length + 1
        if(this.currentAccountNum != 2){
            this.currentYear = parseInt(this.currentAccount.all[0].date.split("/")[2])            
        }else{
            this.currentYear = parseInt(this.currentAccount.all[0].date)
        }
        
        startBtn.addEventListener('click', function(){
            that.generateAccount()
        })

        nextBtn.addEventListener('click', function(){
            that.generateAccount()
        })

        var skip_btn = document.getElementById('skip_btn')
        skip_btn.addEventListener('click', function(){
            that.skipAll()
        })

        var view_other = document.getElementById('view_other')
        view_other.addEventListener('click', function () {
            window.location = 'accounts_page.html'
        })

        var learn_again = document.getElementById('learn_again')
        learn_again.addEventListener('click', function(){
            window.location = 'dr_cr_page.html'
        })

    },

    updateAccount: function(){
        var that = this
        this.currentAccount.all = _.sortBy(_.each(this.currentAccount.all, (all)=>{
            all.timestamp = moment(all.date, "DD/MM/YYYY").unix()
        }), 'timestamp')
        let currentYear
        if(this.currentAccountNum != 2){
        currentYear = parseInt(this.currentAccount.all[0].date.split("/")[2])
        }else{
        currentYear = parseInt(this.currentAccount.all[0].date)
        }
        let tempAll = _.clone(this.currentAccount.all)
        var total_inserted = 0
        var opening_date 
        if(that.closing_date == '31st December'){
            opening_date = '1st January'
        }else{
            opening_date = '1st April'
        }
        let debits_total = 0, depreciation_total = 0
        _.each(tempAll, (all, i)=>{
            for(var j=0;j<that.totalAssetsBlockSchedule.length;j++){
                if(that.totalAssetsBlockSchedule[j].year_begining == currentYear){
                    if(that.currentAccountNum == 0){
                        if(parseInt(all.date.split("/")[2]) != currentYear){
                            var dep_entry = {
                                "date": that.getShortDate(that.closing_date) + currentYear,
                                "particulars": "By depreciation a/c",
                                "extra": "",
                                "amount": that.totalAssetsBlockSchedule[j].depreciation,
                                "form": "Total Assets Block",
                                "title": "depreciation a/c",
                                "more": null,
                                "side": "credit"
                            }
                            if(dep_entry.amount){
                                this.currentAccount.all.splice(i+total_inserted, 0, dep_entry);
                                total_inserted++
                                this.currentAccount.all.join()
                            }
                            var bal_entry = {
                                "date": that.getShortDate(that.closing_date) + currentYear,
                                "particulars": "By balance c/d",
                                "extra": "",
                                "amount": parseFloat(that.totalAssetsBlockSchedule[j].closing_balance.toFixed(2)),
                                "form": "Total Assets Block",
                                "title": "balance c/d",
                                "more": null,
                                "side": "credit"
                            }
                            this.currentAccount.all.splice(i+total_inserted, 0, bal_entry)
                            total_inserted++
                            this.currentAccount.all.join()
                            currentYear++
                            if(i<tempAll.length){
                                var deb_entry = {
                                    "date": that.getShortDate(opening_date) + (currentYear),
                                    "particulars": "By balance c/d",
                                    "extra": "",
                                    "amount": parseFloat(that.totalAssetsBlockSchedule[j].closing_balance.toFixed(2)),
                                    "form": "Total Assets Block",
                                    "title": "balance c/d",
                                    "more": null,
                                    "side": "debit"
                                }
                                this.currentAccount.all.splice(i+total_inserted, 0, deb_entry)
                                total_inserted++
                                this.currentAccount.all.join()
                            }
                        }
                    }else if(that.currentAccountNum == 1){
                        console.log(all.side, all.date, currentYear)
                        if(all.side == 'debit' && parseInt(all.date.split("/")[2]) == currentYear){
                            debits_total += parseFloat(all.amount)
                            console.log(">>>>>>>>>>>", debits_total)
                        }
                        if(parseInt(all.date.split("/")[2]) != currentYear){
                            console.log(">>>>>>>>>>came here")
                            var dep_entry = {
                                "date": that.getShortDate(that.closing_date) + currentYear,
                                "particulars": "To "+that.currentAsset+" a/c",
                                "extra": "",
                                "amount": that.totalAssetsBlockSchedule[j].depreciation,
                                "form": "Total Assets Block",
                                "title": "depreciation a/c",
                                "more": null,
                                "side": "debit"
                            }
                            console.log("dep_entry", dep_entry)
                            if(dep_entry.amount){
                                debits_total += parseFloat(dep_entry.amount)
                                console.log("<<<<<<<<<<", debits_total)
                                this.currentAccount.all.splice(i+total_inserted, 0, dep_entry);
                                total_inserted++
                                this.currentAccount.all.join()
                            }
                            var pnl_entry = {
                                "date": that.getShortDate(that.closing_date) + currentYear,
                                "particulars": "By P&L c/d",
                                "extra": "",
                                "amount": debits_total,
                                "form": "Total Assets Block",
                                "title": "balance c/d",
                                "more": null,
                                "side": "credit"
                            }
                            console.log("pnl_entry", pnl_entry)
                            this.depreciationAmounts.push(debits_total)
                            this.currentAccount.all.splice(i+total_inserted, 0, pnl_entry)
                            total_inserted++
                            this.currentAccount.all.join()
                            debits_total = 0                                
                            currentYear++
                        }
                    }else if(that.currentAccountNum == 2){
                        depreciation_total += parseFloat(all.amount)
                        // console.log("depreciationAmounts", this.depreciationAmounts, j, currentYear, parseInt(all.date.split("/")[2]))
                        if(parseInt(all.date) != currentYear){
                            var dep_entry = {
                                "date": currentYear,
                                "particulars": "To depreciation a/c",
                                "extra": "",
                                "amount": that.depreciationAmounts[j],
                                "form": "Total Assets Block",
                                "title": "depreciation a/c",
                                "more": null,
                                "side": "debit"
                            }
                            if(dep_entry.amount){
                                this.currentAccount.all.splice(i+total_inserted, 0, dep_entry);
                                total_inserted++
                                this.currentAccount.all.join()
                            }
                            depreciation_total = 0
                            currentYear++
                        }
                    }
                }else if(that.totalAssetsBlockSchedule[j].year_begining < currentYear && that.currentAccountNum == 2){
                    var dep_entry = {
                        "date": that.totalAssetsBlockSchedule[j].year_begining,
                        "particulars": "To depreciation a/c",
                        "extra": "",
                        "amount": that.depreciationAmounts[j],
                        "form": "Total Assets Block",
                        "title": "depreciation a/c",
                        "more": null,
                        "side": "debit"
                    }
                    if(dep_entry.amount){
                        this.currentAccount.all.splice(i+total_inserted, 0, dep_entry);
                        total_inserted++
                        this.currentAccount.all.join()
                    }
                }
            }
        })
        console.log("updateAccount", this.currentAccount, currentYear)
        for(var i=0;i<that.totalAssetsBlockSchedule.length;i++){
            if(that.totalAssetsBlockSchedule[i].year_begining == currentYear){
                if(that.currentAccountNum == 0){
                    var dep_entry = {
                        "date": that.getShortDate(that.closing_date) + currentYear,
                        "particulars": "By depreciation a/c",
                        "extra": "",
                        "amount": that.totalAssetsBlockSchedule[i].depreciation,
                        "form": "Total Assets Block",
                        "title": "depreciation a/c",
                        "more": null,
                        "side": "credit"
                    }
                    var bal_entry = {
                        "date": that.getShortDate(that.closing_date) + currentYear,
                        "particulars": "By balance c/d",
                        "extra": "",
                        "amount": that.totalAssetsBlockSchedule[i].closing_balance,
                        "form": "Total Assets Block",
                        "title": "balance c/d",
                        "more": null,
                        "side": "credit"
                    }
                    if(dep_entry.amount)
                        this.currentAccount.all.push(dep_entry)                        
                    if(bal_entry.amount)
                        this.currentAccount.all.push(bal_entry)
                    currentYear++
                    if(i<that.totalAssetsBlockSchedule.length-1){
                        var deb_entry = {
                            "date": that.getShortDate(opening_date) + currentYear,
                            "particulars": "By balance c/d",
                            "extra": "",
                            "amount": that.totalAssetsBlockSchedule[i].closing_balance,
                            "form": "Total Assets Block",
                            "title": "balance c/d",
                            "more": null,
                            "side": "debit"
                        }
                        if(deb_entry.amount)
                            this.currentAccount.all.push(deb_entry)
                    }
                }else if(that.currentAccountNum == 1){
                     var dep_entry = {
                        "date": that.getShortDate(that.closing_date) + currentYear,
                        "particulars": "To "+that.currentAsset+" a/c",
                        "extra": "",
                        "amount": that.totalAssetsBlockSchedule[i].depreciation,
                        "form": "Total Assets Block",
                        "title": "depreciation a/c",
                        "more": null,
                        "side": "debit"
                    }
                    if(dep_entry.amount){
                        debits_total += that.totalAssetsBlockSchedule[i].depreciation
                        this.currentAccount.all.push(dep_entry)
                    }
                    var pnl_entry = {
                        "date": that.getShortDate(that.closing_date) + currentYear,
                        "particulars": "By P&L c/d",
                        "extra": "",
                        "amount": debits_total,
                        "form": "Total Assets Block",
                        "title": "balance c/d",
                        "more": null,
                        "side": "credit"
                    }
                    this.depreciationAmounts.push(debits_total)
                    if(pnl_entry.amount)
                        this.currentAccount.all.push(pnl_entry)
                    debits_total = 0
                    currentYear++
                }else if(that.currentAccountNum == 2){
                    var dep_entry = {
                        "date": currentYear,
                        "particulars": "To depreciation a/c",
                        "extra": "",
                        "amount": that.depreciationAmounts[i],
                        "form": "Total Assets Block",
                        "title": "depreciation a/c",
                        "more": null,
                        "side": "debit"
                    }
                    if(dep_entry.amount)
                        this.currentAccount.all.push(dep_entry)
                    currentYear++
                }
            }
        }
        console.log("updateAccount", this.currentAccount, currentYear)
    },

    skipAll: function(){
        let startBtn = document.getElementById('start-btn')
        let afterFirst = document.getElementById('after-first')
        let afterLast = document.getElementById('after-last')
        var that = this
        for(var i=0;i<this.total_count;i++){
            that.generateAccount()
        }
        startBtn.style.display ='none'
        afterFirst.style.display ='none'
        afterLast.style.display ='flex'
    },

    generateAccount: function(){
        var credit_count = this.credit_count
        var debit_count = this.debit_count
        var debit_rows = this.debit_rows
        var credit_rows = this.credit_rows

        console.log("rows", debit_rows, credit_rows)

        let startBtn = document.getElementById('start-btn')
        let afterFirst = document.getElementById('after-first')
        let afterLast = document.getElementById('after-last')
        let debitsBody = document.getElementById('debits-body')
        let creditsBody = document.getElementById('credits-body')
        var firstDebitRow = document.getElementById('first-debit-row')
        var firstCreditRow = document.getElementById('first-credit-row')
        var that = this
        var currentYear = this.currentYear
        var depreciationAmount = this.depreciationAmount
        console.log("currentYear", currentYear)

        var current_count = debit_count+credit_count
        let nextYear

        if(current_count < that.currentAccount.all.length && that.currentAccount.all[current_count].amount){
            let innerHTML
            if(that.currentAccount.all[current_count].side == 'debit'){
                innerHTML = debitsBody.innerHTML
                if(debit_count == 0){
                    innerHTML = ''                    
                }
            }else{
                innerHTML = creditsBody.innerHTML
                if(credit_count == 0){
                    innerHTML = ''
                }
            }
            innerHTML += `
                <div class="row-col">
                    <div class="date-body">${that.currentAccount.all[current_count].date}</div>
                    <div class="particulars-body">
                        <div class="particulars-title">${that.currentAccount.all[current_count].particulars}</div>
                        <div class="particulars-desc">
                        `
                        if(that.currentAccount.all[current_count].more != null){
                            innerHTML += `<span style="text-decoration: underline;" id="all_note_${current_count}">${that.currentAccount.all[current_count].extra}</span>`
                            that.openNoteIds.push(`all_note_${current_count}`)
                        }else{
                            innerHTML += `${that.currentAccount.all[current_count].extra}`
                        }
            innerHTML += `
                        </div>
                    </div>
                    <div class="amount-body">${that.currentAccount.all[current_count].amount.toFixed(2)}</div>
                </div>
            `
            if(that.currentAccount.all[current_count].side == 'debit'){
                that.debits_total += parseFloat(that.currentAccount.all[current_count].amount.toFixed(2))
                debitsBody.innerHTML = innerHTML
                debit_count++
                debit_rows++
            }else{
                that.credits_total += parseFloat(that.currentAccount.all[current_count].amount.toFixed(2))
                creditsBody.innerHTML = innerHTML
                credit_count++
                credit_rows++
            }
            current_count = debit_count + credit_count
            if(current_count == that.currentAccount.all.length){
                nextYear = null
            }else if(that.currentAccountNum != 2){
                nextYear = parseInt(that.currentAccount.all[current_count].date.split("/")[2])                
            }else{
                nextYear = parseInt(that.currentAccount.all[current_count].date)
            }
            console.log("nextYear", nextYear)
            if(nextYear != currentYear || !nextYear){
                that.balanceRows(debit_rows, credit_rows)

                let innerHTMLDebit = ''
                innerHTMLDebit += `<div class="row-col" style="max-height:45px;">
                        <div class="date-total"></div>
                        <div class="particulars-total"></div>
                        <div class="amount-total">${that.debits_total.toFixed(2)}</div>
                    </div>
                `
                let innerHTMLCredit = ''
                innerHTMLCredit += `
                    <div class="row-col" style="max-height:45px;">
                        <div class="date-total"></div>
                        <div class="particulars-total"></div>
                        <div class="amount-total">${that.credits_total.toFixed(2)}</div>
                    </div>
                `
                // else{
                    debitsBody.innerHTML = debitsBody.innerHTML + innerHTMLDebit                    
                // }
                // else{
                    creditsBody.innerHTML = creditsBody.innerHTML + innerHTMLCredit                    
                // }
                that.depreciationAmount += (that.debits_total + that.credits_total)
                that.debits_total = 0 
                that.credits_total = 0   
                credit_rows = 0
                debit_rows = 0
            }
        }
        for(var i=0;i<that.openNoteIds.length;i++){
            var expand_btn = document.getElementById(that.openNoteIds[i])
            var j = i
            expand_btn.addEventListener('click', function () {
                let pos = parseInt(that.openNoteIds[j].split("_")[2])
                that.openNote(pos)
            })
        }
        if((debit_count + credit_count) == (this.total_count-1)){
            startBtn.style.display ='none'
            afterFirst.style.display ='none'
            afterLast.style.display ='flex'
        }else{
            startBtn.style.display = 'none'
            afterFirst.style.display = 'flex'
            afterLast.style.display = 'none'
        }

        var total_steps = document.getElementById('total_steps')
        total_steps.innerHTML = `STEP ${debit_count + credit_count} (OF ${this.total_count})`
        this.credit_count = credit_count
        this.debit_count = debit_count
        this.credit_rows = credit_rows
        this.debit_rows = debit_rows

        this.currentYear = nextYear
        this.depreciationAmount = depreciationAmount
    },

    balanceRows: function(debit_rows, credit_rows){
        let debitsBody = document.getElementById('debits-body')
        let creditsBody = document.getElementById('credits-body')
        
        if(debit_rows < credit_rows){
            if(debitsBody.innerHTML.includes("first-debit-row")){
                debitsBody.innerHTML = ''
            }
            for(var i=0;i<(credit_rows-debit_rows);i++){
                debitsBody.innerHTML += `<div class="row-col">
                        <div class="date-body"></div>
                        <div class="particulars-body"></div>
                        <div class="amount-body"></div>
                    </div>`
            }
        }else if(credit_rows < debit_rows){
            if(creditsBody.innerHTML.includes("first-credit-row")){
                creditsBody.innerHTML = ''                    
            }
            for(var i=0;i<(debit_rows-credit_rows);i++){
                creditsBody.innerHTML += `<div class="row-col">
                        <div class="date-body"></div>
                        <div class="particulars-body"></div>
                        <div class="amount-body"></div>
                    </div>`
            }
        }
    },

    openNote: function(pos){
        let more = [], title
        console.log("open note", pos)
        title = this.currentAccount.all[pos].title
        more = this.currentAccount.all[pos].more
        var working_note_name = document.getElementById('working_note_name')
        working_note_name.innerHTML = title
        var working_note_container = document.getElementById('working_note_container')
        let innerHTML = ''
        for(var i=0;i<more.length;i++){
            if(Array.isArray(more[i])){
                for(var j=0;j<more[i].length;j++){
                    innerHTML += `
                        <div class="working_note_container_line">
                            <div class="working_note_container_part1">${more[i][j].desc}</div>
                            <div class="working_note_container_part2`
                    if(j == more[i].length-1){
                        innerHTML += ` underline`
                    }
                    innerHTML += `">${more[i][j].value}</div>
                        </div>
                    `
                }
            }else{
                if(i > 0){
                    more[i] = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + more[i]
                }
                innerHTML += `
                    <div class="working_note_container_line">${more[i]}</div>
                `
            }
        }
        working_note_container.innerHTML = innerHTML
        var modal = document.getElementById('dr_cr_modal')
        modal.style.display = 'flex'
        var close_modal = document.getElementById('close_modal')
        close_modal.addEventListener('click', function(){
            modal.style.display = 'none'
        })
    },

    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
        document.addEventListener("backbutton", function(){
            window.location = 'accounts_page.html'
        }, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

        screen.orientation.lock('landscape');
        
        var that = this
        // var next_btn = document.getElementById('next_btn');
        // next_btn.addEventListener('click', function(){
        //     that.nextButton()
        // })
        // var close_btn = document.getElementById('close_keyboard');
        // close_btn.addEventListener('click', function(){
        //     that.closeKeyboard()
        // })
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

    nextButton: function(i){

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
}

app.initialize();
