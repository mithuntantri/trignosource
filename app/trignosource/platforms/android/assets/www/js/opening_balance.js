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
    transactionObject: null,
    transactionVariables: null,
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

        var transactionObject = localStorage.getItem('transactionObject')
        this.transactionObject = JSON.parse(transactionObject)

        var transactionVariables = localStorage.getItem('transactionVariables')
        this.transactionVariables = JSON.parse(transactionVariables)

        console.log(this.transactionObject, "transactionObject")
        var year_input = document.getElementById('opening_bal_year')
        var amount_input = document.getElementById('opening_bal_amt')

        if(this.transactionObject[0].status){
            year_input.value = this.transactionObject[0].year
            amount_input.value = this.transactionObject[0].amount
        }

        let name_elements = document.getElementsByClassName('asset_name')
        for(var i=0;i<name_elements.length;i++){
            name_elements[i].innerHTML = this.currentAsset
        }

        var final_html = ``
        for(var i=1990;i<=2030;i++){
            final_html += `<p id="dropdown_option_${i}">${i}</p>`
        }

        document.getElementById('dropdown_option').innerHTML = final_html

        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))
        this.currentCalculator = parseInt(localStorage.getItem('currentCalculator'))
        this.currentCalculators = this.calculators[parseInt(this.currentSubject)][parseInt(this.currentChapter)][parseInt(this.currentCalculator)]

        var final_html = ``
        var that = this

        var show = document.getElementById('select_tooltip_icon_show')
        var hide = document.getElementById('select_tooltip_icon_hide')

        show.addEventListener('click', function(){
            var select_dropdown = document.getElementById('select_dropdown')
            select_dropdown.style.display = 'block'
            show.style.display = 'none'
            hide.style.display = 'block'
        })


        hide.addEventListener('click', function(){
            var select_dropdown = document.getElementById('select_dropdown')
            select_dropdown.style.display = 'none'
            show.style.display = 'block'
            hide.style.display = 'none'
        })        

        for(var i=1990;i<=2030;i++){
            (function(){
                var j = i;
                var year = document.getElementById('dropdown_option_'+i)
                year.addEventListener('click', function(){
                    var select_dropdown = document.getElementById('select_dropdown')
                    var year_input = document.getElementById('opening_bal_year')
                    year_input.value = j
                    select_dropdown.style.display = 'none'
                    show.style.display = 'block'
                    hide.style.display = 'none'
                })
            })(i);
        }
    },

    listenClick: function(){
        var that = this
        that.currentArrayCount++
        var inner_html = document.getElementById('array_input').innerHTML
        inner_html += `<div class="input-container" id="array_input_${that.currentArrayCount}" style="position:relative">
                <div class="array-label">${that.currentCalculators.inputs[that.currentArrayPlace].column_name} ${that.currentArrayCount+1}</div>
                <div class="input-unit">${that.currentCalculators.inputs[that.currentArrayPlace].unit}</div>
                <input class="input-box" min="0" type="number" id="input_${that.currentArrayPlace}_${that.currentArrayCount}" />
                <img src="img/calculators/close_red.png" 
                    class="calculator-remove" id="remove_icon_${that.currentArrayCount}">
            </div>`
        document.getElementById('array_input').innerHTML = inner_html
        var add_btn = document.getElementById('add_btn')
        add_btn.addEventListener('click', function(){
            that.listenClick()
        })

        if(that.currentArrayCount == 0){
            document.getElementById('remove_icon_0').style.display = 'none'            
        }

        that.listenRemove();
    },

    listenRemove: function(){
        console.log("currentArrayCount", this.currentArrayCount)
        var that = this
        if(that.currentArrayCount == 0){
            document.getElementById('remove_icon_0').style.display = 'none'            
        }
        var remove_icon = document.getElementById('remove_icon_'+this.currentArrayCount);
        console.log(">>>>>> Remove Listener Added for", this.currentArrayCount, remove_icon)
        remove_icon.addEventListener('click', function(){
            console.log("Remove Cliked", that.currentArrayCount, remove_icon)
            document.getElementById('array_input_'+that.currentArrayCount).outerHTML = ""
            that.currentArrayCount--
            remove_icon = document.getElementById('remove_icon_'+that.currentArrayCount)
            if(that.currentArrayCount > 0){
                remove_icon.style.display = 'block'                
            }
            that.listenRemove()
        })
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
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
        // for(var i=0;i< this.videos.length;i++){
        //   (function(i){
        //     var j = i;
        //     var videos_card = document.getElementById('interactive-videos-'+i);
        //     console.log(videos_card, id)
        //     videos_card.addEventListener('click', function(){
        //       console.log('gotoVideos', j)
        //       localStorage.currentVideo = j
        //       window.location = 'page3.html'
        //     }, false);
        //   })(i);
        // }
        var that = this
        var create_btn = document.getElementById('create_btn');
        create_btn.addEventListener('click', function(){
            if(that.checkForm()){
                that.createOpeningBalance()                
            }
        })
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

    checkForm: function(){
        if(document.getElementById('opening_bal_amt').value == null || document.getElementById('opening_bal_amt').value == ''){
            alert("Please enter amount of opening balance")
            return false
        }else if(document.getElementById('opening_bal_amt').value == 0){
            alert("The amount of opening balance should not be zero. If there is no opening balance in the "+this.currentAsset+" account, then leave this form blank.")
            return false
        }else if(document.getElementById('opening_bal_year').value == null || document.getElementById('opening_bal_year').value == ''){
            alert("Please select the year of opening balance") 
            return false
        }else{
            return true
        }
    },

    createOpeningBalance: function(){
        var year_input = document.getElementById('opening_bal_year')
        var amount_input = document.getElementById('opening_bal_amt')
        if(year_input.value >= 1990 && year_input.value <= 2030 && amount_input.value > 0){
            this.transactionObject[0].amount = parseFloat(amount_input.value)
            this.transactionObject[0].year = parseInt(year_input.value)
            this.transactionObject[0].status = true
            this.createVariables(amount_input.value, year_input.value)
            localStorage.removeItem('transactionObject')
            localStorage.setItem('transactionObject', JSON.stringify(this.transactionObject))
            window.location = 'transactions.html'
            console.log(this.transactionObject)
        }else{
            this.transactionObject[0].status = false
        }
    },

    createVariables: function(amount, year){
        this.transactionVariables.gob = parseFloat(amount)
        this.transactionVariables.goby = parseInt(year)
        console.log(this.transactionVariables)
        localStorage.removeItem('transactionVariables')
        localStorage.setItem('transactionVariables', JSON.stringify(this.transactionVariables))
    },

    closeKeyboard: function(){
        Keyboard.hide();
    },

    nextButton: function(){

    },

    closeAllTooltips: function(){
        var that = this
        for(var k=0;k<that.currentCalculators.inputs.length;k++){
            if(!that.currentCalculators.inputs[k].array){
                var tooltip = document.getElementById('input_tooltip_'+k)
                var error_tooltip = document.getElementById('error_tooltip_'+k)
                tooltip.style.display = 'none'
                error_tooltip.style.display = 'none'
            }
        }
    }
};

app.initialize();
