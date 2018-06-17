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

        if(!prefill){
            localStorage.removeItem('currentResult')
        }else{
            var currentResult = localStorage.getItem('currentResult')
            this.currentResult = JSON.parse(currentResult)
            this.currentResult = this.currentResult.data
            console.log(this.currentResult, "currentResult")
        }

        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))
        this.currentCalculator = parseInt(localStorage.getItem('currentCalculator'))
        this.currentCalculators = this.calculators[parseInt(this.currentSubject)][parseInt(this.currentChapter)][parseInt(this.currentCalculator)]

        document.getElementById('subject_name').innerHTML = this.tutorials[this.currentSubject].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_number
        document.getElementById('calculator_number').innerHTML = 'Calculator - 0'+(this.currentCalculator+1)

        var final_html = ``
        var that = this

        document.getElementById('calculator_name').innerHTML = this.currentCalculators.name
        if(!prefill){
            for(var i=0;i< this.currentCalculators.inputs.length;i++){
                if(!this.currentCalculators.inputs[i].array){
                    final_html += `
                        <div class="calculator-input">
                            <div class="input-label">${that.currentCalculators.inputs[i].label}</div>
                            <div class="input-container">
                                <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                <input class="input-box" min="0" type="number" id="input_${i}" />
                                <img src="img/calculators/Tooltip.png" 
                                class="calculator-tooltip">
                            </div>
                        </div>
                    `
                }else{
                    that.currentArrayPlace = i
                    final_html += `
                        <div class="calculator-input" id="array_input">
                            <div class="input-label" style="display:flex;flex-direction:row;justify-content:space-between;">${that.currentCalculators.inputs[i].label}
                                <div class="input-button" id="add_btn">${that.currentCalculators.inputs[i].button_name}</div>
                            </div>
                            <div class="input-container" id="array_input_0">
                                <div class="array-label">${that.currentCalculators.inputs[i].column_name} ${that.currentArrayCount+1}</div>
                                <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                <input class="input-box" min="0" type="number" id="input_${i}_0" />
                            </div>
                        </div>
                    `
                    that.listenAddBtn = true
                }
            }
        }else{
            for(var i=0;i< this.currentCalculators.inputs.length;i++){
                if(!this.currentCalculators.inputs[i].array){
                    final_html += `
                        <div class="calculator-input">
                            <div class="input-label">${that.currentCalculators.inputs[i].label}</div>
                            <div class="input-container">
                                <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                <input class="input-box" min="0" type="number" id="input_${i}"
                                    value="${that.currentResult.input[i].value}" />
                                <img src="img/calculators/Tooltip.png" 
                                class="calculator-tooltip">
                            </div>
                        </div>
                    `
                }else{
                    that.currentArrayPlace = i
                    that.currentArrayCount = that.currentResult.input[i].length
                    final_html += `
                        <div class="calculator-input" id="array_input">
                            <div class="input-label" style="display:flex;flex-direction:row;justify-content:space-between;">${that.currentCalculators.inputs[i].label}
                                <div class="input-button" id="add_btn">${that.currentCalculators.inputs[i].button_name}</div>
                            </div>`
                            var array_value = JSON.parse(that.currentResult.input[i].value)
                            for(var j=0;j<=that.currentArrayCount;j++){
                                final_html += `<div class="input-container" id="array_input_0">
                                    <div class="array-label">${that.currentCalculators.inputs[i].column_name} ${that.currentArrayCount+1}</div>
                                    <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                    <input class="input-box" min="0" type="number" id="input_${i}_0" value="${array_value[j]}" />
                                </div>`
                            }
                    final_html += `</div>`
                    that.listenAddBtn = true
                }
            }
        }

      // document.getElementsByClassName('panel').style.display = 'none';
      // document.getElementsByClassName('tabs').classList.remove('active')
      // document.getElementsByClassName('tabs').classList.add('inactive');
        document.getElementById('calculator_mid').innerHTML = `<div style="overflow:scroll;>`+final_html+`</div>`
        if(this.listenAddBtn){
            var add_btn = document.getElementById('add_btn')
            add_btn.addEventListener('click', function(){
                that.listenClick()
            })
        }
    },

    listenClick: function(){
        var that = this
        that.currentArrayCount++
        var inner_html = document.getElementById('array_input').innerHTML
        inner_html += `<div class="input-container" id="array_input_${that.currentArrayCount}">
                <div class="array-label">${that.currentCalculators.inputs[that.currentArrayPlace].column_name} ${that.currentArrayCount+1}</div>
                <div class="input-unit">${that.currentCalculators.inputs[that.currentArrayPlace].unit}</div>
                <input class="input-box" min="0" type="number" id="input_${that.currentArrayPlace}_${that.currentArrayCount}" />
            </div>`
        document.getElementById('array_input').innerHTML = inner_html
        var add_btn = document.getElementById('add_btn')
        add_btn.addEventListener('click', function(){
            that.listenClick()
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
        var calculate_btn = document.getElementById('calculate_btn');
        calculate_btn.addEventListener('click', function(){
            that.calculateResult()
        })
        document.addEventListener("offline", function(){ 
          console.log("Device offline")
          alert("Seems your internet is disconnected. Please check and try again") 
          navigator.app.exitApp();
        }, false);
    },

    calculateResult: function(){
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

        cordovaHTTP.post(that.baseUrl+"/api/admin/calculators/calculate", data,
            { Authorization: "" }, function(response) {
              console.log(response)
              if(response.status){
                localStorage.currentResult = response.data
                window.location = 'result_page.html'
                console.log(response)
              }
            }, function(response) {
            console.log(response);
        })
    }
};

app.initialize();
