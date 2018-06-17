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
    currentStep:0,
    currentExplanation:0,
    currentExpandedStep:0,
    currentExpandedDetail:0,
    currentExpandedExplanation:0,
    currentExpandedPage:0,
    videos: [],
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.baseUrl = localStorage.getItem('baseUrl')

        var tutorials = localStorage.getItem('tutorials')
        this.tutorials = JSON.parse(tutorials).data
        console.log('tutorials', this.tutorials)

        localStorage.removeItem('editInput')

        var calculators = localStorage.getItem('calculators')
        this.calculators = JSON.parse(calculators).data

        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))
        this.currentCalculator = parseInt(localStorage.getItem('currentCalculator'))
        this.currentCalculators = this.calculators[parseInt(this.currentSubject)][parseInt(this.currentChapter)][parseInt(this.currentCalculator)]
        var currentResult = localStorage.getItem('currentResult')
        this.currentResult = JSON.parse(currentResult)
        this.currentResult = this.currentResult.data
        this.initStepWise()
    },

    initStepWise: function(){
        var that = this
        var final_html = document.getElementById('calculator_mid').innerHTML
        for(var j=0;j<this.currentResult.stepwise.length;j++){
            final_html += `<div class="result-heading" id="result_heading_${j}" style="display:none;">
                            ${this.currentResult.stepwise[j].title}
                            </div>`
            for(var i=0;i< this.currentResult.stepwise[j].explanation.length;i++){
                if(this.currentResult.stepwise[j].explanation[i]){
                    final_html += `
                        <div class="result-explanation" id="result_explanation_${j}_${i}" style="display:none;">
                           ${this.currentResult.stepwise[j].explanation[i]}
                        </div>`
                }   
                final_html += `
                    <div class="result-content" id="result_content_${j}_${i}" style="display:none;">
                        ${this.currentResult.stepwise[j].content[i]}
                `
                if(this.currentResult.stepwise[j].detailed_explanation[i]){
                    final_html += `
                        <img src="img/calculators/expand_step.png" 
                        class="expand_btn" id="expand_btn_${j}_${i}"></div>
                    `
                }
                final_html += `</div>`
            }
        }
        document.getElementById('calculator_mid').innerHTML = final_html
        this.currentStep++
        this.currentExplanation++
        this.updateStepwise()

        var final_input = ``
        for(var i=0;i<this.currentResult.input.length;i++){
            final_input += `<div class="input-card-title">`+this.currentResult.input[i].key + ' - ' + this.currentResult.input[i].unit + '' + this.currentResult.input[i].value+`</div>`
        }
        final_input += `
                    <img src="img/calculators/edit_input.png" id="edit_input" style="width:20px;height: 20px;position: absolute;right: 15px;top: 25px;">`
        document.getElementById('input_card').innerHTML = final_input
    },

    updateStepwise: function(){
        for(var j=0;j<this.currentStep;j++){
            document.getElementById('result_heading_'+j).style.display = 'block'
            for(var i=0;i< this.currentExplanation;i++){
                if(this.currentResult.stepwise[j].explanation[i]){
                    document.getElementById('result_explanation_'+j+'_'+i).style.display = 'block'
                }
                document.getElementById('result_content_'+j+'_'+i).style.display = 'block'
            }
        }
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
        var that = this
        for(var i=0;i<this.currentResult.stepwise.length;i++){
            (function(i){
                for(var j=0;j<that.currentResult.stepwise[i].detailed_explanation.length;j++){
                    (function(j){
                        if(that.currentResult.stepwise[i].detailed_explanation[j]){
                            var expand_card = document.getElementById('expand_btn_'+i+'_'+j);
                            console.log(expand_card, id)
                            var finalDetails = ``
                            var finalExplanation = ``

                            for(var k=0;k<that.currentResult.stepwise[i].detailed_explanation[j].length;k++){
                                finalDetails += `<div id="details_text_${i}_${j}_${k}"`
                                if(k != 0){
                                    finalDetails += ` style="display:none;">`
                                }else{
                                    finalDetails += `>`
                                }
                                for(var l=0;l<that.currentResult.stepwise[i].detailed_explanation[j][k].content.length;l++){
                                    finalDetails += `<div>`
                                    finalDetails += that.currentResult.stepwise[i].detailed_explanation[j][k].content[l]
                                    finalDetails += `</div>`
                                }
                                finalDetails += `</div>`
                                finalExplanation += `<span class="explanation-text" id="explanation_text_${i}_${j}_${k}"`
                                if(k != 0){
                                    finalExplanation += ` style="display:none;">`
                                }else{
                                    finalExplanation += `>`
                                }
                                finalExplanation += that.currentResult.stepwise[i].detailed_explanation[j][k].explanation
                                finalExplanation += '</span>'
                            }

                            document.getElementById('expanded_section_prev').style.display = 'none'
                            document.getElementById('expanded_section_details').innerHTML = finalDetails
                            document.getElementById('expanded_section_explanation').innerHTML = finalExplanation
                            document.getElementById('expanded_section_indicators2').style.display = 'none'

                            var next_step_btn = document.getElementById('expanded_section_next')
                            next_step_btn.addEventListener('click', function() {
                                document.getElementById('explanation_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'none'
                                document.getElementById('details_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'none'

                                that.currentExpandedPage++
                                document.getElementById('expanded_section_prev').style.display = 'block'
                                document.getElementById('expanded_section_indicators1').style.display = 'none'
                                document.getElementById('expanded_section_indicators2').style.display = 'block'
                                document.getElementById('expanded_section_next').style.display = 'none'

                                document.getElementById('details_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'block'
                                document.getElementById('explanation_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'block'
                            })

                            var prev_step_btn = document.getElementById('expanded_section_prev')
                            prev_step_btn.addEventListener('click', function() {
                                document.getElementById('explanation_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'none'
                                document.getElementById('details_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'none'

                                that.currentExpandedPage--
                                document.getElementById('expanded_section_prev').style.display = 'none'
                                document.getElementById('expanded_section_indicators1').style.display = 'block'
                                document.getElementById('expanded_section_indicators2').style.display = 'none'
                                document.getElementById('expanded_section_next').style.display = 'block'

                                document.getElementById('details_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'block'
                                document.getElementById('explanation_text_'+i+'_'+j+'_'+that.currentExpandedPage).style.display = 'block'
                            })
                            
                            expand_card.addEventListener('click', function(){
                                document.getElementById('expanded_section').style.display='flex'

                                var close_btn = document.getElementById('expanded_section_close');
                                close_btn.addEventListener('click', function(){
                                    document.getElementById('expanded_section').style.display='none'
                                })
                            }, false);
                        }
                    })(j);
                }
            })(i);
        }
        var next_step_btn = document.getElementById('next_step_btn');
        next_step_btn.addEventListener('click', function(){
            that.showNextStep()
        })
        var skip_all_btn = document.getElementById('skip_all_btn');
        skip_all_btn.addEventListener('click', function(){
            that.skipToLast()
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

    skipToLast: function(){
        this.currentStep = this.currentResult.stepwise.length
        this.currentExplanation = this.currentResult.stepwise[this.currentStep-1].explanation.length
        document.getElementById('next_step_btn').style.display = 'none'
        document.getElementById('skip_all_btn').style.display = 'none'
        document.getElementById('back_btn').style.display = 'flex'

        document.getElementById('back_btn').addEventListener('click', function(e){
            navigator.app.backHistory();
        })

        for(var j=0;j<this.currentResult.stepwise.length;j++){
            document.getElementById('result_heading_'+j).style.display = 'block'
            for(var i=0;i< this.currentResult.stepwise[j].explanation.length;i++){
                if(this.currentResult.stepwise[j].explanation[i]){
                    document.getElementById('result_explanation_'+j+'_'+i).style.display = 'block'
                }
                document.getElementById('result_content_'+j+'_'+i).style.display = 'block'
            }
        }
    },

    showNextStep: function(){
        var total_exp = this.currentResult.stepwise[this.currentStep-1].explanation.length
        console.log("total_exp", total_exp)
        var total_stp = this.currentResult.stepwise.length
        console.log("total_stp", total_stp)
        if((this.currentExplanation)<total_exp){
            this.currentExplanation++
        }else if(total_stp > (this.currentStep)){
            this.currentStep++   
            this.currentExplanation = 0        
        }
        if(this.currentStep == total_stp){
            if(this.currentExplanation == total_exp){
                document.getElementById('next_step_btn').style.display = 'none'
                document.getElementById('skip_all_btn').style.display = 'none'
                document.getElementById('back_btn').style.display = 'flex'
                document.getElementById('back_btn').addEventListener('click', function(e){
                    navigator.app.backHistory();
                })
            }
        }
        console.log(this.currentExplanation)
        console.log(this.currentStep)
        this.updateStepwise()
    }
};

app.initialize();
