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
    videos: [],
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.baseUrl = localStorage.getItem('baseUrl')

        var tutorials = localStorage.getItem('tutorials')
        this.tutorials = JSON.parse(tutorials).data
        console.log('tutorials', this.tutorials)

        var calculators = localStorage.getItem('calculators')
        this.calculators = JSON.parse(calculators).data

        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))
        this.currentCalculator = parseInt(localStorage.getItem('currentCalculator'))
        this.currentCalculators = this.calculators[parseInt(this.currentSubject)][parseInt(this.currentChapter)][parseInt(this.currentCalculator)]
        var currentResult = localStorage.getItem('currentResult')
        this.currentResult = JSON.parse(currentResult)
        this.currentResult = this.currentResult.data
        var final_html = ``
        var that = this

        localStorage.removeItem('editInput')

        for(var i=0;i< this.currentResult.result.length;i++){
          final_html += `
            <div class="calculator-input">
                <div class="input-label">${that.currentResult.result[i].label}</div>
                <div class="input-container">
                    <div class="input-unit">${that.currentResult.result[i].unit}</div>
                    <div class="input-box" min="0" type="number" id="result_${i}">${that.currentResult.result[i].value}</div>
                </div>
            </div>
          `
        }

         final_html += `
            <div class="tabbedPanels">
      <ul class="tabs">
        <li><a href="#panel1" class = "tabOne">Table</a></li>
        <li><a href="#panel2" class = "tabTwo inactive">Graph</a></li>
        <li><a href="#panel3" class = "tabThree inactive">Timeline</a></li>
      </ul>
      <div class="panelContainer">
        <div class="panel" id="panel1" style="display:block;">
        ${that.currentResult.table}
        </div>
            <div class="panel" id="panel2" style="display:none;">
          <h1 class = "panelContent">Graph</h1>
          <p class = "panelContent"><span></span></p>
                    <p class = "panelContent"><span></span></p>
        </div>
            <div class="panel" id="panel2" style="display:none;">
          <h1 class = "panelContent"></h1>
          <p class = "panelContent"><span></span></p>
        </div>
      </div>
    </div>
        `
        document.getElementById('calculator_mid').innerHTML = final_html

        var final_input = ``
        for(var i=0;i<this.currentResult.input.length;i++){
            final_input += `<div class="input-card-title">`+this.currentResult.input[i].key + ' - ' + this.currentResult.input[i].unit + '' + this.currentResult.input[i].value+`</div>`
        }
        final_input += `
                    <img src="img/calculators/edit_input.png" id="edit_input" style="width:20px;height: 20px;position: absolute;right: 15px;top: 25px;">`
        document.getElementById('input_card').innerHTML = final_input
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
            window.location = 'stepwise_page.html'
        })
        
        var edit_input = document.getElementById('edit_input');
        edit_input.addEventListener('click', function(){
            localStorage.setItem('editInput', true)
            window.location = 'calculator.html'
        })

        var open_inputs = document.getElementById('open_inputs')
        var close_inputs = document.getElementById('close_inputs')
        open_inputs.addEventListener('click', function(){
            document.getElementById('input_card').style.display = 'block'
            open_inputs.style.display = 'none'
            close_inputs.style.display = 'flex'
        })

        close_inputs.addEventListener('click', function(){
            document.getElementById('input_card').style.display = 'none'
            open_inputs.style.display = 'flex'
            close_inputs.style.display = 'none'
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
            data.input_object[that.currentCalculators.inputs[i].key] = document.getElementById('input_'+i).value
        }

        console.log(data)

        cordovaHTTP.post(that.baseUrl+"/api/admin/calculators/calculate", data,
            { Authorization: "" }, function(response) {
              console.log(response)
              if(response.status){
                console.log(response)
              }
            }, function(response) {
            console.log(response);
        })
    }
};

app.initialize();
