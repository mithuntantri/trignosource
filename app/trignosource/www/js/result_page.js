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

        for(var i=0;i< this.currentResult.tables.length;i++){
            final_html += `
            <div class="calculator-input" style="min-height:0px;">
                <div class="input-label">${that.currentResult.tables[i].label}</div>
            </div>
            <div class="tabbedPanels">`
            if(i==(this.currentResult.tables.length-1)){
                final_html +=` <ul class="tabs">
                    <li><a id="panel1_id_${i}" class = "tabOne activeTab">Table</a></li>
                    <li><a id="panel2_id_${i}" class = "tabTwo">Graph</a></li>
                    <li><a id="panel3_id_${i}" class = "tabThree">Timeline</a></li>
                </ul>`
            }
            final_html +=`<div class="panelContainer">
                    <div class="panel" id="panel1_${i}" style="display:block;">
                    ${that.currentResult.tables[i].table}
                    </div>`
            if(i==(this.currentResult.tables.length-1)){
                    final_html+=`<div class="panel" id="panel2_${i}" style="display:none;padding:20px 0;">
                        <canvas id="myChart" width="350" height="170" style="width:342px;height:180px !important;"></canvas>
                        <div class="timeline-legends">
                            <div class="timeline-legend">
                                <div class="timeline-legend-ic yr"></div>
                                <div class="timeline-legend-name yrname">${that.currentResult.graph.x_label}</div>
                            </div>
                            <div class="timeline-legend">
                                <div class="timeline-legend-ic dep"></div>
                                <div class="timeline-legend-name depname">${that.currentResult.graph.line_1_label}</div>
                            </div>
                            <div class="timeline-legend">
                                <div class="timeline-legend-ic bal"></div>
                                <div class="timeline-legend-name balname">${that.currentResult.graph.line_2_label}</div>
                            </div>
                        </div>
                    </div>`
            }
            final_html+=`<div class="panel" id="panel3_${i}" style="display:none;flex-direction:column;">
                        <div class="timeline-part1">`
                    for(var j=0;j<that.currentResult.graph.timeline_count;j++){
                        if(j==(that.currentResult.graph.timeline_count-1)){
                            final_html += `<div class="timeline-arrow">
                                        <div class="timeline-arrow-dep">${that.currentResult.graph.line_1_data_lbl[j]}</div>
                                        <img class="timeline-arrow-img" src="img/calculators/arrow.png"/>
                                        <div class="timeline-btm-line" style="border-right:3px solid white;width:90%;">
                                           <div class="timeline-arrow-bal">${that.currentResult.graph.line_2_data_lbl[j]}</div>
                                           <div class="timeline-arrow-bal-next">${that.currentResult.graph.closing}</div>
                                           <div class="timeline-arrow-yr">${j}</div>
                                           <div class="timeline-arrow-yr-next">${j+1}</div>
                                        </div>
                                    </div>`
                        }else{
                            final_html += `<div class="timeline-arrow">
                                        <div class="timeline-arrow-dep">${that.currentResult.graph.line_1_data_lbl[j]}</div>
                                        <img class="timeline-arrow-img" src="img/calculators/arrow.png"/>
                                        <div class="timeline-btm-line">
                                           <div class="timeline-arrow-bal">${that.currentResult.graph.line_2_data_lbl[j]}</div>
                                           <div class="timeline-arrow-yr">${j}</div>
                                        </div>
                                    </div>`
                        }
                    }
                    final_html += `</div><div class="timeline-legends">
                                        <div class="timeline-legend">
                                            <div class="timeline-legend-ic yr"></div>
                                            <div class="timeline-legend-name yrname">${that.currentResult.graph.x_label}</div>
                                        </div>
                                        <div class="timeline-legend">
                                            <div class="timeline-legend-ic dep"></div>
                                            <div class="timeline-legend-name depname">${that.currentResult.graph.line_1_label}</div>
                                        </div>
                                        <div class="timeline-legend">
                                            <div class="timeline-legend-ic bal"></div>
                                            <div class="timeline-legend-name balname">${that.currentResult.graph.line_2_label}</div>
                                        </div>
                                    </div>`
            final_html+=`</div>
                </div>
            </div>
            `
        }
        document.getElementById('calculator_mid').innerHTML = final_html

        var final_input = ``
        for(var i=0;i<this.currentResult.input.length;i++){
            final_input += `<div class="input-card-title">`+this.currentResult.input[i].key + ' - ' + this.currentResult.input[i].unit + '' + this.currentResult.input[i].value+`</div>`
        }
        final_input += `
                    <img src="img/calculators/edit_input.png" id="edit_input" style="width:20px;height: 20px;position: absolute;right: 15px;top: 25px;">`
        document.getElementById('input_card').innerHTML = final_input

        var total_length = this.currentResult.tables.length-1
        for(var i=0;i< this.currentResult.tables.length;i++){
            (function(i){
                if(i==(total_length)){
                var j = i
                var tabOne = document.getElementById('panel1_id_'+j)
                var tabTwo = document.getElementById('panel2_id_'+j)
                var tabThree = document.getElementById('panel3_id_'+j)

                tabOne.addEventListener('click', function(){
                    var tab1 = document.getElementById('panel1_'+j)
                    var tab2 = document.getElementById('panel2_'+j)
                    var tab3 = document.getElementById('panel3_'+j)
                    tabOne.classList.add("activeTab");
                    tabTwo.classList.remove("activeTab");
                    tabThree.classList.remove("activeTab");
                    tab1.style.display = 'block'
                    tab2.style.display = 'none'
                    tab3.style.display = 'none'
                })
                tabTwo.addEventListener('click', function(){
                    var tab1 = document.getElementById('panel1_'+j)
                    var tab2 = document.getElementById('panel2_'+j)
                    var tab3 = document.getElementById('panel3_'+j)
                    tabOne.classList.remove("activeTab");
                    tabTwo.classList.add("activeTab");
                    tabThree.classList.remove("activeTab");
                    tab1.style.display = 'none'
                    tab2.style.display = 'block'
                    tab3.style.display = 'none'
                })

                tabThree.addEventListener('click', function(){
                    var tab1 = document.getElementById('panel1_'+j)
                    var tab2 = document.getElementById('panel2_'+j)
                    var tab3 = document.getElementById('panel3_'+j)
                    tabOne.classList.remove("activeTab");
                    tabTwo.classList.remove("activeTab");
                    tabThree.classList.add("activeTab");
                    tab1.style.display = 'none'
                    tab2.style.display = 'none'
                    tab3.style.display = 'flex'
                })}            
            })(i);
        }
        this.loadChart()
    },
    loadChart: function(){
        var that = this
        var ctx = document.getElementById("myChart").getContext('2d');
        Chart.defaults.global.defaultFontColor = '#fff';
        var myChart = new Chart(ctx, {
            type: 'line',
            scaleFontColor: "white",
            data: {
                labels: that.currentResult.graph.x_data,
                datasets: [{
                    label: that.currentResult.graph.line_1_label,
                    data: that.currentResult.graph.line_1_data,
                    backgroundColor: 'rgb(255, 192, 0)',
                    borderColor: 'rgb(255, 192, 0)',
                    borderWidth: 1,
                    fill: false
                },{
                    label: that.currentResult.graph.line_2_label,
                    data: that.currentResult.graph.line_2_data,
                    backgroundColor: 'rgb(146, 208, 80)',
                    borderColor: 'rgb(146, 208, 80)',
                    borderWidth: 1,
                    fill:false
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: "white",
                            beginAtZero:true,
                            min: 0,
                            max: that.currentResult.graph.line_2_data[0] * 2,
                            stepSize: that.currentResult.graph.line_2_data[0] / parseInt(that.currentResult.graph.line_2_data[0].substr(0,1))
                        },
                        scaleLabel: {
                            display: true,
                            labelString: that.currentResult.graph.y_label
                          }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: "white",
                            beginAtZero:true,
                            min: 0,
                            max: 20,
                            stepSize: 1
                        },
                        scaleLabel: {
                            display: true,
                            labelString: that.currentResult.graph.x_label
                          }
                    }]
                },
                legend: {
                    fontColor: "white",
                    position: 'bottom',
                    display: false
                }
            }
        });
        myChart.defaults.global.defaultFontColor = "#fff";
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
        screen.orientation.lock('portrait');
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
