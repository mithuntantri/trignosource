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

        console.log(this.transactionObject, "transactionObject")

        let name_elements = document.getElementsByClassName('asset_name')
        for(var i=0;i<name_elements.length;i++){
            name_elements[i].innerHTML = this.currentAsset
        }

        var dates = [
            "1st January", "31st January", "1st February", "28th February",
            "1st March", "31st March", "1st April", "30th April", "1st May",
            "31st May", "1st June", "30th June", "1st July", "31st July",
            "1st August", "31st August", "1st Sepetember", "30th Sepetember",
            "1st October", "31st October", "1st Novemeber", "30th Novemeber",
            "1st December", "31st December"
        ]

        var final_html = ``
        var that = this

        this.transactionObject[1].values.push({
            "cost": null,
            "additional_costs": null,
            "date_of_purchase": null,
            "year_of_purchase": null
        })
        for(var i=0;i<this.transactionObject[1].values.length;i++){
            final_html += `<div class="purchase-item-block">
                                <div class="title">Purchase of ${this.currentAsset} ${i+1}</div>`
                                if(i != this.transactionObject[1].values.length-1){
                                    final_html += `<div class="edit-option" id="purchase_create_${i}"><img src="img/edit_form.png"/></div>`                                    
                                    final_html += `<div class="delete-option" id="purchase_delete_${i}"><img src="img/delete_form.png"/></div>`
                                }else{
                                    final_html += `<div class="desc" id="purchase_desc_${i}">Click on add button</div>`
                                    final_html += `<div class="add-option" id="purchase_create_${i}"><img src="img/add_form.png"/></div>`
                                    final_html += `<div class="delete-option" id="purchase_delete_${i}" style="display:none;"><img src="img/delete_form.png"/></div>`
                                }
                                final_html += `<div class="detailed-transaction-block" style="display:none;padding:15px;width:90%;" id="purchase_form_${i}">
                                                         <div class="title">
                                                             Cost of ${this.currentAsset}:
                                                         </div>
                                                         <div class="input-container" style="margin:5px 0 15px 0;">
                                                             <div class="input-unit green-unit">&#8377;</div>
                                                             <input class="input-box grey-box" id="cost_of_asset_${i}" type="number"
                                                             value="${that.transactionObject[1].values[i].cost}" />
                                                            </div>
                                                         <div class="title">
                                                             Additional costs (if any):
                                                         </div>
                                                         <div class="input-container" style="margin:5px 0 15px 0;">
                                                             <div class="input-unit green-unit">&#8377;</div>
                                                             <input class="input-box grey-box" id="add_cost_of_asset_${i}" type="number"
                                                             value="${that.transactionObject[1].values[i].additional_costs}" />
                                                         </div>
                                                         <div class="title">
                                                            Date of Purchase:
                                                         </div>
                                                         <div style="display:flex;flex-direction:row;justify-content:space-between;">
                                                             <div class="input-container" style="margin:5px 0 15px 0;position: relative;width:70%;">
                                                                 <input class="select-box grey-box" placeholder="Date & Month" id="purchase_month_${i}" disabled type="text" 
                                                                     style="font-size:19px;" `
                                                                     if(that.transactionObject[1].values[i].date_of_purchase){
                                                                        final_html += `value="${that.transactionObject[1].values[i].date_of_purchase}"`
                                                                     }
                                                                final_html += `/>
                                                                 <div class="dropdown-container green-unit" id="select_month_icon_show_${i}">
                                                                     <img src="img/arrow_down.png" 
                                                                     class="dropdown-tooltip">
                                                                 </div>
                                                                 <div class="dropdown-container green-unit" style="display:none" id="select_month_icon_hide_${i}">
                                                                     <img src="img/arrow_up.png" 
                                                                     class="dropdown-tooltip">
                                                                 </div>
                                                                 <div class="dropdown-options-container year-bubble" id="select_dropdown_months_${i}">
                                                                     <div class="dropdown-bubble">
                                                                       <div class="dropdowntext" style="margin: 0;background-color: rgb(220,220,220);color:black;" id="month_dropdown_option_${i}">
                                                                       `
                                                                        for(var j=0;j<dates.length;j++){
                                                                            final_html += `<p id="month_dropdown_option_${i}_${j}">${dates[j]}</p>`
                                                                        }
                                                                        final_html += `
                                                                      </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="input-container" style="margin:5px 0 15px 5px;position: relative;flex-grow:2;">
                                                                <input class="select-box grey-box" placeholder="Year" id="purchase_year_${i}" disabled type="number"
                                                                    style="font-size:19px;width:100%;" value="${that.transactionObject[1].values[i].year_of_purchase}"/>
                                                                <div class="dropdown-container green-unit" id="select_year_icon_show_${i}">
                                                                    <img src="img/arrow_down.png" 
                                                                    class="dropdown-tooltip">
                                                                </div>
                                                                <div class="dropdown-container green-unit" style="display:none" id="select_year_icon_hide_${i}">
                                                                    <img src="img/arrow_up.png" 
                                                                    class="dropdown-tooltip">
                                                                </div>
                                                                <div class="dropdown-options-container year-bubble" id="select_dropdown_years_${i}">
                                                                    <div class="dropdown-bubble">
                                                                      <div class="dropdowntext" style="margin: 0;background-color: rgb(220,220,220);color:black;" id="year_dropdown_option_${i}">
                                                                      `
                                                                        let start = 1990
                                                                        if(that.transactionObject[0].year){
                                                                            start = that.transactionObject[0].year
                                                                        }
                                                                        for(var j=start;j<=2030;j++){
                                                                            final_html += `<p id="year_dropdown_option_${i}_${j}">${j}</p>`
                                                                        }
                                                                        final_html += `
                                                                      </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="calculate-btn green-btn" id="create_btn_${i}" 
                                                            style="position: relative;">
                                                            <span class="c-spinner"></span>`
                                                            if(i == that.transactionObject[1].values.length -1){
                                                                final_html += `<span class="c-text">CREATE PURCHASE</span>`
                                                            }else{
                                                                final_html += `<span class="c-text">SAVE CHANGES</span>`                                                               
                                                            }
                                                            final_html += `
                                                        </div>
                                                    </div></div>`
        }

        document.getElementById('calculator_mid').innerHTML = final_html


        let start = 1990
        if(this.transactionObject[0].year){
            start = this.transactionObject[0].year
        }
        for(var i=0;i<this.transactionObject[1].values.length;i++){
            (function(i){
                var j = i
                var purchase_create = document.getElementById('purchase_create_'+j)
         
                purchase_create.addEventListener('click', function(){
                    var purchase_desc = document.getElementById('purchase_desc_'+j)
                    var purchase_form = document.getElementById('purchase_form_'+j)
                    var purchase_delete = document.getElementById('purchase_delete_'+j)
                    if(j == that.transactionObject[1].values.length-1){
                        purchase_desc.style.display = 'none'                        
                    }
                    purchase_delete.style.display = 'block'
                    purchase_form.style.display = 'block'
                })

                var showyear = document.getElementById('select_year_icon_show_'+j)
                var hideyear = document.getElementById('select_year_icon_hide_'+j)

                var showmonth = document.getElementById('select_month_icon_show_'+j)
                var hidemonth = document.getElementById('select_month_icon_hide_'+j)
                
                var purchase_delete = document.getElementById('purchase_delete_'+j)

                purchase_delete.addEventListener('click', function(){
                    var purchase_desc = document.getElementById('purchase_desc_'+j)
                    var purchase_form = document.getElementById('purchase_form_'+j)
                    if(j == that.transactionObject[1].values.length-1){
                        purchase_desc.style.display = 'block'                        
                        purchase_delete.style.display = 'none'
                        purchase_form.style.display = 'none'
                    }else{
                        that.transactionObject[1].values.splice(j,1)
                        that.transactionObject[1].values.splice(that.transactionObject[1].values.length-1, 1)
                        that.transactionObject[1].count = that.transactionObject[1].values.length
                        for(var l=2;l<=6;l++){
                            for(var k=0;k<that.transactionObject[l].values.length;k++){
                                if(that.transactionObject[l].values[k].asset.includes(j+1)){
                                    that.transactionObject[l].values.splice(k,1)
                                    that.transactionObject[l].count = that.transactionObject[l].values.length
                                }
                            }
                        }
                        localStorage.removeItem('transactionObject')
                        localStorage.setItem('transactionObject', JSON.stringify(that.transactionObject))
                        console.log(that.transactionObject, JSON.parse(localStorage.getItem('transactionObject')))
                        that.initialize()
                    }
                })

                showyear.addEventListener('click', function(event){
                    event.stopPropagation()
                    var select_dropdown = document.getElementById('select_dropdown_years_'+j)
                    select_dropdown.style.display = 'block'
                    showyear.style.display = 'none'
                    hideyear.style.display = 'block'

                    var select_dropdown_months = document.getElementById('select_dropdown_months_'+i)
                    select_dropdown_months.style.display = 'none'
                    showmonth.style.display = 'block'
                    hidemonth.style.display = 'none'
                })


                hideyear.addEventListener('click', function(event){
                    event.stopPropagation()
                    var select_dropdown = document.getElementById('select_dropdown_years_'+j)
                    select_dropdown.style.display = 'none'
                    showyear.style.display = 'block'
                    hideyear.style.display = 'none'
                })        

                showmonth.addEventListener('click', function(event){
                    event.stopPropagation()
                    var select_dropdown = document.getElementById('select_dropdown_months_'+j)
                    select_dropdown.style.display = 'block'
                    showmonth.style.display = 'none'
                    hidemonth.style.display = 'block'

                    var select_dropdown_years = document.getElementById('select_dropdown_years_'+j)
                    select_dropdown_years.style.display = 'none'
                    showyear.style.display = 'block'
                    hideyear.style.display = 'none'
                })

                hidemonth.addEventListener('click', function(event){
                    event.stopPropagation()
                    var select_dropdown = document.getElementById('select_dropdown_months_'+j)
                    select_dropdown.style.display = 'none'
                    showmonth.style.display = 'block'
                    hidemonth.style.display = 'none'
                }) 
                for(var k=start;k<=2030;k++){
                    (function(k){
                        var l = k;
                        var year = document.getElementById('year_dropdown_option_'+j+'_'+l)
                        year.addEventListener('click', function(event){
                            var select_dropdown = document.getElementById('select_dropdown_years_'+j)
                            var year_input = document.getElementById('purchase_year_'+j)
                            year_input.value = l
                            select_dropdown.style.display = 'none'
                            showyear.style.display = 'block'
                            hideyear.style.display = 'none'
                        })
                    })(k);
                }

                for(var k=0;k<dates.length;k++){
                    (function(k){
                        var l = k;
                        var month = document.getElementById('month_dropdown_option_'+i+'_'+l)
                        month.addEventListener('click', function(event){
                            var select_dropdown = document.getElementById('select_dropdown_months_'+j)
                            var month_input = document.getElementById('purchase_month_'+j)
                            month_input.value = dates[l]
                            select_dropdown.style.display = 'none'
                            showmonth.style.display = 'block'
                            hidemonth.style.display = 'none'
                        })
                    })(k);
                }

                window.onclick = function(event) {
                    var select_dropdown_months = document.getElementById('select_dropdown_months_'+j)
                    select_dropdown_months.style.display = 'none'
                    showmonth.style.display = 'block'
                    hidemonth.style.display = 'none'

                    var select_dropdown_years = document.getElementById('select_dropdown_years_'+j)
                    select_dropdown_years.style.display = 'none'
                    showyear.style.display = 'block'
                    hideyear.style.display = 'none'
                }

                var create_btn = document.getElementById('create_btn_'+j)
                create_btn.addEventListener('click', function(){
                    that.transactionObject[1].values[j] = {
                        "cost": parseFloat(document.getElementById('cost_of_asset_'+j).value),
                        "additional_costs": parseFloat(document.getElementById('add_cost_of_asset_'+j).value),
                        "date_of_purchase": document.getElementById('purchase_month_'+j).value,
                        "year_of_purchase": parseInt(document.getElementById('purchase_year_'+j).value)
                    }
                    if(that.checkForm(j)){
                        if(j != that.transactionObject[1].values.length-1){
                            that.transactionObject[1].values.splice(that.transactionObject[1].values.length-1, 1)
                        }
                        that.transactionObject[1].count = that.transactionObject[1].values.length
                        localStorage.removeItem('transactionObject')
                        localStorage.setItem('transactionObject', JSON.stringify(that.transactionObject))
                        that.initialize()
                    }
                })
            })(i);
        }
    },

    savePurchase: function(j){
        var that = this
        that.transactionObject[1].values[j] = {
            "cost": parseFloat(document.getElementById('cost_of_asset_'+j).value),
            "additional_costs": parseFloat(document.getElementById('add_cost_of_asset_'+j).value),
            "date_of_purchase": document.getElementById('purchase_month_'+j).value,
            "year_of_purchase": parseInt(document.getElementById('purchase_year_'+j).value)
        }
        if(that.checkForm(j)){
            if(j != that.transactionObject[1].values.length-1){
                that.transactionObject[1].values.splice(that.transactionObject[1].values.length-1, 1)
            }
            that.transactionObject[1].count = that.transactionObject[1].values.length
            localStorage.removeItem('transactionObject')
            localStorage.setItem('transactionObject', JSON.stringify(that.transactionObject))
            that.initialize()
        }
    },

    checkForm: function(j){
        let obj = this.transactionObject[1].values[j]
        console.log(obj)
        if(obj.additional_costs == null || obj.additional_costs == ''){
            this.transactionObject[1].values[j].additional_costs = 0
        }
        if(obj.cost == null || obj.cost == '' || isNaN(obj.cost)){
            alert("Please enter cost of asset")
            return false
        }else if(obj.date_of_purchase == null || obj.date_of_purchase == ''){
            alert("Please select the date and month of purchase")
            return false
        }else if(obj.year_of_purchase == null || obj.year_of_purchase == '' || isNaN(obj.year_of_purchase)){
            alert("Please select the year of purchase")
            return false
        }else if(obj.cost == 0 || isNaN(obj.cost)){
            alert("The cost of asset cannot be zero")
            return false
        }else{
            var found = false
            var that = this
            for(var i=2;i<=6;i++){
                for(var k=0;k<this.transactionObject[i].values.length;k++){
                    if(this.transactionObject[i].values[k].asset.includes(j+1)){
                        if(that.transactionObject[1].values[j].year_of_purchase > that.transactionObject[i].values[k].values.year_of_sale){
                            found = true
                        }
                    }
                }
            }
            if(found){
                let msg = "You have added other forms related to "+this.currentAsset+" "+(j+1) + ". The year of purchase cannot be greater than year of sale, scrap, theft/destruction, addition or replacement.\n\nMaking this edit will DELETE all forms related to "+this.currentAsset+" "+(j+1)+", Would you still like to proceed?"
                this.currentPurchase = j
                navigator.notification.confirm(
                    msg,                       // message
                    function(results){
                        console.log(results, that)
                        if(results == 0 || results == 1){
                            that.initialize()
                        }else{
                            var j = that.currentPurchase
                            for(var l=2;l<=6;l++){
                                for(var k=0;k<that.transactionObject[l].values.length;k++){
                                    if(that.transactionObject[l].values[k].asset.includes(j+1)){
                                            that.transactionObject[l].values.splice(k,1)
                                            that.transactionObject[l].count = that.transactionObject[l].values.length
                                    }
                                }
                            }
                            that.checkForm(j)
                            that.savePurchase(j)
                        }
                    },                  // callback to invoke
                    'Confirm Edit',            // title
                    'Cancel Edit,Proceed with Edit'              // buttonLabels
                );
                return false
            }else{
                return true                
            }
        }
    },

    onPrompt: function(results){
        var that = this
        console.log(results, this)
        if(results == 0 || results == 1){
            this.initialize()
        }else{
            var j = this.currentPurchase
            for(var l=2;l<=6;l++){
                for(var k=0;k<that.transactionObject[l].values.length;k++){
                    if(that.transactionObject[l].values[k].asset.includes(j+1)){
                        that.transactionObject[l].values.splice(k,1)
                        that.transactionObject[l].count = that.transactionObject[l].values.length
                    }
                }
            }
            this.checkForm(j)
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
            window.location = 'transactions.html'
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
        window.location = 'transactions.html'
    }

};

app.initialize();
