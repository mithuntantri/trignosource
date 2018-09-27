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
            localStorage.removeItem('currentAsset')
            localStorage.removeItem('transactionObject')
        }else{
            var currentResult = localStorage.getItem('currentResult')
            this.currentResult = JSON.parse(currentResult)
            this.currentResult = this.currentResult.data
            if(localStorage.getItem('currentAsset')){
                this.currentAsset = localStorage.getItem('currentAsset')
            }
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
            for(var i=0;i<this.currentCalculators.inputs.length;i++){
                console.log("inside i ", i)
                if(this.currentCalculators.inputs[i].dropdown || this.currentCalculators.inputs[i].extra){
                    document.getElementById('calculate_btn').style.display = 'none'
                    document.getElementById('next_btn').style.display = 'flex'
                    final_html += `
                        <div class="calculator-input" id="calculator_input_${i}" style="display:${that.currentCalculators.inputs[i].display}">
                            <div class="input-label">${that.currentCalculators.inputs[i].label}</div>
                            <div class="input-container" style="position:relative;">
                                <input class="select-box" `
                                if(that.currentCalculators.inputs[i].disable){
                                    final_html += `disabled `
                                }
                                final_html += ` id="input_${i}"
                                    placeholder="${that.currentCalculators.inputs[i].button_name}"/>
                                    `
                                if(that.currentCalculators.inputs[i].options.length > 0){
                                    final_html += `
                                        <div class="dropdown-container" id="select_tooltip_icon_${i}_show">
                                            <img src="img/arrow_down.png" 
                                            class="dropdown-tooltip">
                                        </div>
                                        <div class="dropdown-container" style="display:none" id="select_tooltip_icon_${i}_hide">
                                            <img src="img/arrow_up.png" 
                                            class="dropdown-tooltip">
                                        </div>
                                    </div>
                                    <div class="dropdown-options-container" id="select_dropdown_${i}">
                                        <div class="dropdown-bubble">
                                          <div class="dropdowntext">
                                            `
                                            for(var k=0;k<this.currentCalculators.inputs[i].options.length;k++){
                                                console.log("inside k", k)
                                                final_html += `<p id="dropdown_option_${i}_${k}">${that.currentCalculators.inputs[i].options[k]}</p>`
                                            }
                                    
                                    final_html += `
                                          </div>
                                        </div>
                                    </div>
                                </div>
                                    `
                                }else{
                                    final_html += `</div></div>`
                                }
                }else if(!this.currentCalculators.inputs[i].array){
                    final_html += `
                        <div class="calculator-input">
                            <div class="input-label">${that.currentCalculators.inputs[i].label}</div>
                            <div class="input-container">
                                <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                <input class="input-box" min="0" type="number" id="input_${i}" />
                                <img src="img/calculators/Tooltip.png" 
                                class="calculator-tooltip" id="input_tooltip_icon_${i}">
                            </div>
                            <div class="talk-container">
                                <div class="talk-bubble tri-right border btm-right-in" id="input_tooltip_${i}">
                                  <div class="talktext">
                                    <p>${that.currentCalculators.tooltips[i]}</p>
                                  </div>
                                </div>
                                <div class="talk-bubble-alert tri-right-alert border-alert btm-left-in" id="error_tooltip_${i}">
                                </div>
                            </div>
                        </div>
                    `
                   
                }else{
                    that.currentArrayPlace = i
                    final_html += `
                        <div class="calculator-input" id="array_input" style="overflow:scroll; max-height:135px;display:block;">
                            <div class="input-label" style="display:flex;flex-direction:row;justify-content:space-between;">${that.currentCalculators.inputs[i].label}
                                <div class="input-button" id="add_btn">${that.currentCalculators.inputs[i].button_name}</div>
                            </div>
                            <div class="input-container" id="array_input_0" style="position:relative">
                                <div class="array-label">${that.currentCalculators.inputs[i].column_name} ${that.currentArrayCount+1}</div>
                                <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                <input class="input-box" min="0" type="number" id="input_${i}_0" />
                                 <img src="img/calculators/close_red.png" 
                                class="calculator-remove" id="remove_icon_${i}" style="display:none;">
                            </div>
                        </div>
                    `
                    that.listenAddBtn = true
                }
            }
        }else{
            for(var i=0;i< this.currentCalculators.inputs.length;i++){
                if(this.currentCalculators.inputs[i].dropdown || this.currentCalculators.inputs[i].extra){
                    final_html += `
                        <div class="calculator-input">
                            <div class="input-label">${that.currentCalculators.inputs[i].label}</div>
                            <div class="input-container" style="position:relative;">
                                <input class="select-box" disabled="true" min="0" type="number" id="input_${i}"
                                    placeholder="${that.currentCalculators.inputs[i].button_name}"/>
                                <div class="dropdown-container">
                                    <img src="img/arrow_down.png" 
                                    class="dropdown-tooltip" id="select_tooltip_icon_${i}_show">
                                </div>
                                <div class="dropdown-container">
                                    <img src="img/arrow_down.png" 
                                    class="dropdown-tooltip" id="select_tooltip_icon_${i}_hide">
                                </div>
                            </div>
                        </div>
                    `
                }else if(!this.currentCalculators.inputs[i].array){
                    final_html += `
                        <div class="calculator-input">
                            <div class="input-label">${that.currentCalculators.inputs[i].label}</div>
                            <div class="input-container">
                                <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                <input class="input-box" min="0" type="number" id="input_${i}"
                                    value="${that.currentResult.input[i].value}" />
                                <img src="img/calculators/Tooltip.png" 
                                class="calculator-tooltip" id="input_tooltip_icon_${i}" style="display:none">
                            </div>
                            <div class="talk-container">
                                <div class="talk-bubble tri-right border btm-right-in" id="input_tooltip_${i}">
                                  <div class="talktext">
                                    <p>${that.currentCalculators.tooltips[i]}</p>
                                  </div>
                                </div>
                                <div class="talk-bubble-alert tri-right-alert border-alert btm-left-in" id="error_tooltip_${i}">
                                </div>
                            </div>
                        </div>
                    `
                }else{
                    that.currentArrayPlace = i
                    that.currentArrayCount = that.currentResult.input[i].value.length
                    console.log("currentArrayCount",that.currentArrayCount)
                    final_html += `
                        <div class="calculator-input" id="array_input" style="overflow:scroll; max-height:135px;display:block;">
                            <div class="input-label" style="display:flex;flex-direction:row;justify-content:space-between;">${that.currentCalculators.inputs[i].label}
                                <div class="input-button" id="add_btn">${that.currentCalculators.inputs[i].button_name}</div>
                            </div>`
                            var arry = that.currentResult.input[i]
                            console.log(arry)
                            for(var j=0;j<that.currentArrayCount;j++){
                                if(j==0){
                                    final_html += `<div class="input-container" id="array_input_${j}" style="position:relative">
                                        <div class="array-label">${that.currentCalculators.inputs[i].column_name} ${j+1}</div>
                                        <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                        <input onfocus="blur();" class="input-box" min="0" type="number" id="input_${j}_0" value="${arry.value[j]}" />
                                        <img src="img/calculators/close_red.png" 
                                        class="calculator-remove" id="remove_icon_${j}" style="display:none;">
                                    </div>`
                                }else{
                                    final_html += `<div class="input-container" id="array_input_${j}" style="position:relative">
                                        <div class="array-label">${that.currentCalculators.inputs[i].column_name} ${j+1}</div>
                                        <div class="input-unit">${that.currentCalculators.inputs[i].unit}</div>
                                        <input onfocus="blur();" class="input-box" min="0" type="number" id="input_${j}_0" value="${arry.value[j]}" />
                                        <img src="img/calculators/close_red.png" 
                                        class="calculator-remove" id="remove_icon_${j}">
                                    </div>`
                                }
                                
                            }
                    final_html += `</div>`
                    that.listenAddBtn = true
                }
            }
        }

        // final_html += `</form>`

      // document.getElementsByClassName('panel').style.display = 'none';
      // document.getElementsByClassName('tabs').classList.remove('active')
      // document.getElementsByClassName('tabs').classList.add('inactive');
        document.getElementById('calculator_mid').innerHTML = `<div style="overflow:visible;">`+final_html+`</div>`
        if(this.listenAddBtn){
            var add_btn = document.getElementById('add_btn')
            add_btn.addEventListener('click', function(){
                that.listenClick()
            })
        }
        var total_inputs = this.currentCalculators.inputs.length
        var that = this
        for(var i=0;i< this.currentCalculators.inputs.length;i++){
            if(this.currentCalculators.inputs[i].dropdown){
                // console.log("dropdown")
                (function(i){
                    var j = i;
                    var options_length = that.currentCalculators.inputs[i].options.length
                    var tooltip_btn_show = document.getElementById('select_tooltip_icon_'+i+'_show')
                    var tooltip_btn_hide = document.getElementById('select_tooltip_icon_'+i+'_hide')
                    tooltip_btn_show.addEventListener('click', function(){
                        // console.log("clicked")
                        tooltip_btn_show.style.display = 'none'
                        tooltip_btn_hide.style.display = 'block'

                        var tooltip = document.getElementById('select_dropdown_'+j)
                        tooltip.style.display = 'block'
                    })
                    tooltip_btn_hide.addEventListener('click', function(){
                        // console.log("clicked")
                        tooltip_btn_hide.style.display = 'none'
                        tooltip_btn_show.style.display = 'block'

                        var tooltip = document.getElementById('select_dropdown_'+j)
                        tooltip.style.display = 'none'
                    })
                    for(var k=0;k<options_length;k++){
                        (function(k){
                            var l=k;
                            var dropdown_option = document.getElementById('dropdown_option_'+j+'_'+l)
                            var dropdown_input = document.getElementById('input_'+j)
                            var calculator_input = document.getElementById('calculator_input_1')
                            dropdown_option.addEventListener('click', function(){
                                console.log(dropdown_option.innerHTML)
                                tooltip_btn_hide.style.display = 'none'
                                tooltip_btn_show.style.display = 'block'
                                var tooltip = document.getElementById('select_dropdown_'+j)
                                tooltip.style.display = 'none'
                                dropdown_input.value = dropdown_option.innerHTML
                                if(j == 0){
                                    if(l == (options_length -1)){
                                        calculator_input.style.display = 'flex'   
                                    }else{
                                        calculator_input.style.display = 'none'   
                                    }
                                }
                            })
                        })(k);
                    }
                })(i);
            }else if(!this.currentCalculators.inputs[i].array && !this.currentCalculators.inputs[i].extra){
                (function(i){
                    var j = i;
                    var tooltip_btn = document.getElementById('input_tooltip_icon_'+i)
                    tooltip_btn.addEventListener('click', function(){
                        for(var k=0;k< total_inputs;k++){
                            var tooltip = document.getElementById('input_tooltip_'+k)
                            if(tooltip.style.display == 'none' && k==j){
                                tooltip.style.display = 'block'
                            }else{
                                tooltip.style.display = 'none'
                            }
                        }
                    })
                })(i);
            }
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
        var calculate_btn = document.getElementById('calculate_btn');
        calculate_btn.addEventListener('click', function(){
            that.calculateResult()
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

    closeKeyboard: function(){
        Keyboard.hide();
    },

    checkForm: function(){
        if(document.getElementById('input_0').value == null || document.getElementById('input_0').value == ''){
            alert("Please select the asset to be depreciated") 
            return false
        }else if(document.getElementById('input_0').value == 'Create custom asset' && 
            (document.getElementById('input_1').value == ''||document.getElementById('input_1').value == null)){
            alert("Please enter the name of the custom asset")
            return false
        }else if(document.getElementById('input_2').value == null || document.getElementById('input_2').value == ''){
            alert("Please select the date of closing books of accounts")
            return false
        }else{
            return true
        }
    },

    nextButton: function(){
        if(this.checkForm()){
            let currentAsset = document.getElementById('input_0').value
            let closingDate = document.getElementById('input_2').value
            if(currentAsset == 'Create custom asset')
                currentAsset = document.getElementById('input_1').value
            localStorage.setItem('currentAsset', currentAsset)
            localStorage.setItem('closingDate', closingDate)
            window.location = 'transactions.html'
        }
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
