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

        let currentAccount = parseInt(localStorage.getItem('currentAccount'))
        if(currentAccount == 0){
            this.currentAccount = this.assetAccount
        }else if(currentAccount == 1){
            this.currentAccount = this.depreciationAccount
        }else{
            this.currentAccount = this.pnlAccount            
        }

        let that = this

        let startBtn = document.getElementById('start-btn')
        let nextBtn = document.getElementById('next-btn')

        this.is_debits = (this.currentAccount.debit.length > 0)?true:false
        this.debit_count = 0
        this.credit_count = 0
        this.debits_total = 0
        this.credits_total = 0
        this.total_count = this.currentAccount.debit.length + this.currentAccount.credit.length + 1
        
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
        var is_debits = this.is_debits

        let startBtn = document.getElementById('start-btn')
        let afterFirst = document.getElementById('after-first')
        let afterLast = document.getElementById('after-last')
        let debitsBody = document.getElementById('debits-body')
        let creditsBody = document.getElementById('credits-body')
        var firstDebitRow = document.getElementById('first-debit-row')
        var firstCreditRow = document.getElementById('first-credit-row')
        var that = this
        var ids = []
        if(is_debits && debit_count < that.currentAccount.debit.length){
            let innerHTML = debitsBody.innerHTML
            if(debit_count == 0){
                innerHTML = ``
            }
            that.debits_total += parseFloat(that.currentAccount.debit[debit_count].amount.toFixed(2))
            if(debit_count == that.currentAccount.debit.length-1){
                innerHTML += `
                    <div class="row-col" style="max-height:45px;">
                        <div class="date-total"></div>
                        <div class="particulars-total"></div>
                        <div class="amount-total">${that.debits_total.toFixed(2)}</div>
                    </div>
                `
            }
            innerHTML += `
                <div class="row-col">
                    <div class="date-body">${that.currentAccount.debit[debit_count].date}</div>
                    <div class="particulars-body">
                        <div class="particulars-title">${that.currentAccount.debit[debit_count].particulars}</div>
                        <div class="particulars-desc">
                        ${that.currentAccount.debit[debit_count].extra}
                        `
                        if(that.currentAccount.debit[debit_count].more != null){
                            innerHTML += `<span style="text-decoration: underline;" id="debit_note_${debit_count}"> - Click Here</span>`
                            ids.push(`debit_note_${debit_count}`)
                        }
            innerHTML += `
                        </div>
                    </div>
                    <div class="amount-body">${that.currentAccount.debit[debit_count].amount}</div>
                </div>
            `
            debitsBody.innerHTML = innerHTML
            if(credit_count != that.currentAccount.credit.length){
                is_debits = false
            }
            debit_count++
        }else if(!is_debits && credit_count < that.currentAccount.credit.length){
            let innerHTML = creditsBody.innerHTML
            if(credit_count == 0){
                innerHTML = ``
            }
            that.credits_total += parseFloat(that.currentAccount.credit[credit_count].amount.toFixed(2))
            innerHTML += `
                <div class="row-col">
                    <div class="date-body">${that.currentAccount.credit[credit_count].date}</div>
                    <div class="particulars-body">
                        <div class="particulars-title">${that.currentAccount.credit[credit_count].particulars}</div>
                        <div class="particulars-desc">
                        ${that.currentAccount.credit[credit_count].extra}
                        `
                        if(that.currentAccount.credit[credit_count].more != null){
                            innerHTML += `<span style="text-decoration: underline;" id="credit_note_${credit_count}"> - Click Here</span>`
                            ids.push(`credit_note_${credit_count}`)
                        }
            innerHTML += `</div>
                    </div>
                    <div class="amount-body">${that.currentAccount.credit[credit_count].amount}</div>
                </div>
            `
            if(credit_count == that.currentAccount.credit.length-1){
                innerHTML += `
                    <div class="row-col" style="max-height:45px;">
                        <div class="date-total"></div>
                        <div class="particulars-total"></div>
                        <div class="amount-total">${that.credits_total.toFixed(2)}</div>
                    </div>
                `
            }
            creditsBody.innerHTML = innerHTML
            if(debit_count != that.currentAccount.debit.length){
                is_debits = true                
            }
            credit_count++
        }
        for(var i=0;i<ids.length;i++){
            var expand_btn = document.getElementById(ids[i])
            var j = i
            expand_btn.addEventListener('click', function () {
                let is_debit = ids[j].split("_")[0]=='debit'?true:false
                let pos = parseInt(ids[j].split("_")[2])
                that.openNote(is_debit, pos)
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
        this.is_debits = is_debits
    },

    openNote: function(is_debit, pos){
        let more = [], title
        console.log("open note", is_debit, pos)
        if(is_debit){
            title = this.currentAccount.debit[pos].title
            more = this.currentAccount.debit[pos].more
        }else{
            title = this.currentAccount.credit[pos].title
            more = this.currentAccount.credit[pos].more
        }
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
        // document.getElementById('back_arrow').addEventListener('click', function(e){
        //     navigator.app.backHistory();
        // })
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

    }
}

app.initialize();
