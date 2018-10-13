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

        localStorage.removeItem('currentAccount')
        
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

        var that = this

        var btn1 = document.getElementById('view-accounts-btn-1')
        btn1.addEventListener('click', function(){
            if((that.assetAccount.all.length) > 0){
                that.nextButton(0)                
            }else{
                that.showBottom('No accounts to view')
            }
        })

        var btn2 = document.getElementById('view-accounts-btn-2')
        btn2.addEventListener('click', function(){
            if((that.depreciationAccount.all.length) > 0){
                that.nextButton(1)                
            }else{
                that.showBottom('No accounts to view')
            }
        })
        
        var btn3 = document.getElementById('view-accounts-btn-3')
        btn3.addEventListener('click', function(){
            if((that.pnlAccount.all.length) > 0){
                that.nextButton(2)                
            }else{
                that.showBottom('No accounts to view')
            }
        })        

        var open_inputs = document.getElementById('open_inputs')
        open_inputs.addEventListener('click', function(){
            window.location ='transactions.html'
        })
    },

    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
        document.getElementById('back_arrow').addEventListener('click', function(e){
            window.location = 'final_inputs.html'
        })
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        screen.orientation.lock('portrait');

        var that = this

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
        this.currentAccount = i
        localStorage.setItem('currentAccount', this.currentAccount)
        console.log(this.schedules, "schedules")
        window.location = 'dr_cr_page.html'
    },

    showBottom: function(message) {
      window.plugins.toast.showWithOptions(
        {
          message: message,
          duration: "short",
          position: "bottom",
          addPixelsY: -40
        }
      );
    }
}

app.initialize();
