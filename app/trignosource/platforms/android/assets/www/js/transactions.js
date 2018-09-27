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
    transactionVariables:  {
            'gob': null,
            'goby': null,
            'purchase': null,
            'sales': null
        },
    transactionObject: [{
            'name': 'Opening Balance',
            'status': false,
            'count': 0
        }],
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

        let params = [
            this.currentAsset + " purchases", 
            this.currentAsset + " sales", 
            this.currentAsset + " scrapped",
            this.currentAsset + " theft/destruction",
            "Additions to " + this.currentAsset,
            "Replacement of " + this.currentAsset
        ]
        if(this.transactionObject.length == 1){
            for(var i=0;i<6;i++){
                this.transactionObject.push({
                    'name': params[i],
                    'count': 0,
                    'status': false,
                    'values': [],
                })
            }
        }

        
        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))
        this.currentCalculator = parseInt(localStorage.getItem('currentCalculator'))
        this.currentCalculators = this.calculators[parseInt(this.currentSubject)][parseInt(this.currentChapter)][parseInt(this.currentCalculator)]

        var final_html = ``
        var that = this
        for(var i=0;i<this.transactionObject.length;i++){
            final_html += `<div class="transaction-container">
                                <div class="transaction-status">
                                `
                                if(i == 0){
                                    if(that.transactionObject[i].status)
                                        final_html += `<img src='img/tick_mark.png' style='height:30px;'/>`
                                }else{
                                    final_html += that.transactionObject[i].count
                                }
                                final_html += `
                                </div>
                                <div class="transaction-title">
                                    ${that.transactionObject[i].name}
                                </div>
                                <div class="transaction-icon" id="transaction_icon_${i}">
                                    <img src="img/add_form.png"/>
                                </div>
                            </div>`            
        }
        document.getElementById('calculator_mid').innerHTML = final_html

        var transactionObject = this.transactionObject
        var transactionVariables = this.transactionVariables
        for(var i=0;i<this.transactionObject.length;i++){
            (function(i){
                var j = i;
                var icon = document.getElementById('transaction_icon_'+j)
                icon.addEventListener('click', function(){
                    localStorage.removeItem('transactionObject')
                    localStorage.setItem('transactionObject', JSON.stringify(transactionObject))
                    localStorage.removeItem('transactionVariables')
                    localStorage.setItem('transactionVariables', JSON.stringify(transactionVariables))
                    if(j == 0){
                        window.location = 'opening_balance.html'
                    }else if(j == 1){
                        window.location = 'purchase.html'
                    }else if(j == 2){
                        window.location = 'sales.html'
                    }else if(j == 3){
                        window.location = 'scrap.html'
                    }else if(j == 4){
                        window.location = 'destruction.html'
                    }else if(j == 5){
                        window.location = 'additions.html'
                    }else if(j == 6){
                        window.location = 'replacements.html'
                    }
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
        window.location = 'final_inputs.html'
    },

    calculateResult: function(){
        if(!this.stopCalculate){
            Keyboard.hide();
            this.stopCalculate = true;
            document.getElementsByClassName('c-text')[0].style.display = 'none'
            document.getElementsByClassName('c-spinner')[0].style.display = 'inline-block'
            var that = this

            var data = {
                calculator_id: that.currentCalculators.calculator_id,
                input_object: {}
            }

            for(var i=0;i<that.currentCalculators.inputs.length;i++){
                if(!that.currentCalculators.inputs[i].array){
                    data.input_object[that.currentCalculators.inputs[i].key] = document.getElementById('input_'+i).value
                }else{
                    var array_value = []
                    for(var j=0;j<=that.currentArrayCount;j++){
                        array_value.push(document.getElementById('input_'+that.currentArrayPlace+'_'+j).value)
                    }
                    data.input_object[that.currentCalculators.inputs[i].key] = array_value
                }
            }

            console.log(data)

            cordovaHTTP.post(
                that.baseUrl+"/api/admin/calculators/calculate", 
                data,
                { Authorization: "" }, 
                function(response) {
                  console.log("response", response)
                  var temp_response = JSON.parse(response.data)
                  if(temp_response.status){
                    localStorage.currentResult = response.data
                    window.location = 'result_page.html'
                    console.log("response success",response)
                  }else{
                    that.stopCalculate = false;
                    document.getElementsByClassName('c-text')[0].style.display = 'block'
                    document.getElementsByClassName('c-spinner')[0].style.display = 'none'
                    console.log("response error", response)
                    that.closeAllTooltips()
                    var position = 'error_tooltip_'+temp_response.err.position
                    console.log(position)
                    var innerHTML = `<div class="talktext">
                                        <p>${temp_response.err.error}</p>
                                        <div style="width:100%;display:flex;justify-content:center;flex-direction:row;">
                                            <div class="ok-btn" id="ok-btn">OK</div>
                                        </div>
                                    </div>`
                    document.getElementById(position).innerHTML = innerHTML
                    document.getElementById(position).style.display = 'block'
                    var okbtn = document.getElementById('ok-btn')
                    okbtn.addEventListener('click', function(){
                        that.closeAllTooltips()
                    })
                  }
                }, 
                function(response) {
                    console.log("error",response);
                }
            )

            return false;
        }
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
