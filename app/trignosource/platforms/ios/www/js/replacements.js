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
    assets: null,
    nature: ["Significant", "Negligible"],
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

        var assets = []

        if(this.transactionObject[0].status){
            assets.push("General / Other")
        }

        for(var i=0;i<this.transactionObject[1].values.length;i++){
            assets.push(`${this.currentAsset} ${i+1}`)
        }

        this.assets = assets
        var final_html = ``
        var that = this

        this.transactionObject[6].values.push({
            "asset": null,
            "values": null
        })

        for(var i=0;i<this.transactionObject[6].values.length;i++){
            final_html += `<div class="purchase-item-block">
                                <div class="title">Replacement ${i+1}</div>`
                                if(i != this.transactionObject[6].values.length-1){
                                    final_html += `<div class="edit-option" id="purchase_create_${i}"><img src="img/edit_form.png"/></div>`                                    
                                    final_html += `<div class="delete-option" id="purchase_delete_${i}"><img src="img/delete_form.png"/></div>`
                                }else{
                                    final_html += `<div class="desc" id="purchase_desc_${i}">Click on add button</div>`
                                    final_html += `<div class="add-option" id="purchase_create_${i}"><img src="img/add_form.png"/></div>`
                                    final_html += `<div class="delete-option" id="purchase_delete_${i}" style="display:none;"><img src="img/delete_form.png"/></div>`
                                }
                                final_html += `<div class="detailed-transaction-block" style="display:none;padding:15px;width:90%;" id="purchase_form_${i}">
                                                         <div class="title">
                                                            ${this.currentAsset} being replaced:
                                                         </div>
                                                         <div class="input-container" style="margin:5px 0 15px 0;position: relative;">
                                                             <input class="select-box grey-box" placeholder="Select the ${this.currentAsset} being replaced" 
                                                                id="asset_${i}" disabled type="text" 
                                                                style="font-size:19px;"  `
                                                                     if(that.transactionObject[6].values[i].asset){
                                                                        final_html += `value="${that.transactionObject[6].values[i].asset}"`
                                                                     }
                                                                final_html += `/>
                                                                 <div class="dropdown-container green-unit" id="select_asset_icon_show_${i}">
                                                                 <img src="img/arrow_down.png" 
                                                                 class="dropdown-tooltip">
                                                             </div>
                                                             <div class="dropdown-container green-unit" style="display:none" id="select_asset_icon_hide_${i}">
                                                                 <img src="img/arrow_up.png" 
                                                                 class="dropdown-tooltip">
                                                             </div>
                                                             <div class="dropdown-options-container year-bubble" id="select_dropdown_assets_${i}">
                                                                 <div class="dropdown-bubble">
                                                                   <div class="dropdowntext" style="margin: 0;background-color: rgb(220,220,220);color:black;" id="asset_dropdown_option_${i}">
                                                                   `
                                                                    for(var j=0;j<assets.length;j++){
                                                                        final_html += `<p id="asset_dropdown_option_${i}_${j}">${assets[j]}</p>`
                                                                    }
                                                                    final_html += `
                                                                  </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="detailed-transaction-block" style="width:100%;padding:0;" id="extra_form_${i}">
                                                        </div>
                                                        <div class="calculate-btn green-btn" id="create_btn_${i}" 
                                                            style="position: relative;">
                                                            <span class="c-spinner"></span>`
                                                            if(i == that.transactionObject[6].values.length -1){
                                                                final_html += `<span class="c-text">CREATE REPLACEMENT</span>`
                                                            }else{
                                                                final_html += `<span class="c-text">SAVE CHANGES</span>`                                                               
                                                            }
                                                            final_html += `
                                                        </div>
                                                    </div></div>`
        }

        document.getElementById('calculator_mid').innerHTML = final_html

        for(var i=0;i<this.transactionObject[6].values.length;i++){
            (function(i){
                var j = i
                var purchase_create = document.getElementById('purchase_create_'+j)
         
                purchase_create.addEventListener('click', function(){
                    var purchase_desc = document.getElementById('purchase_desc_'+j)
                    var purchase_form = document.getElementById('purchase_form_'+j)
                    var purchase_delete = document.getElementById('purchase_delete_'+j)
                    if(j == that.transactionObject[6].values.length-1){
                        purchase_desc.style.display = 'none'                        
                    }else{
                        if(document.getElementById('asset_'+j).value == "General / Other"){
                            that.addOPForm(j)                            
                        }else{
                            that.addAssetForm(j)
                        }
                    }
                    purchase_delete.style.display = 'block'
                    purchase_form.style.display = 'block'
                })

                var showasset = document.getElementById('select_asset_icon_show_'+j)
                var hideasset = document.getElementById('select_asset_icon_hide_'+j)

                var purchase_delete = document.getElementById('purchase_delete_'+j)

                purchase_delete.addEventListener('click', function(){
                    var purchase_desc = document.getElementById('purchase_desc_'+j)
                    var purchase_form = document.getElementById('purchase_form_'+j)
                    if(j == that.transactionObject[6].values.length-1){
                        purchase_desc.style.display = 'block'                        
                        purchase_delete.style.display = 'none'
                        purchase_form.style.display = 'none'
                    }else{
                        that.transactionObject[6].values.splice(j,1)
                        that.transactionObject[6].values.splice(that.transactionObject[6].values.length-1, 1)
                        that.transactionObject[6].count = that.transactionObject[6].values.length
                        localStorage.removeItem('transactionObject')
                        localStorage.setItem('transactionObject', JSON.stringify(that.transactionObject))
                        console.log(that.transactionObject, JSON.parse(localStorage.getItem('transactionObject')))
                        that.initialize()
                    }
                })

                showasset.addEventListener('click', function(event){
                    event.stopPropagation()
                    var select_dropdown = document.getElementById('select_dropdown_assets_'+j)
                    select_dropdown.style.display = 'block'
                    showasset.style.display = 'none'
                    hideasset.style.display = 'block'
                })


                hideasset.addEventListener('click', function(event){
                    event.stopPropagation()
                    var select_dropdown = document.getElementById('select_dropdown_assets_'+j)
                    select_dropdown.style.display = 'none'
                    showasset.style.display = 'block'
                    hideasset.style.display = 'none'
                })        

                for(var k=0;k<assets.length;k++){
                    (function(k){
                        var l = k;
                        var month = document.getElementById('asset_dropdown_option_'+i+'_'+l)
                        month.addEventListener('click', function(event){
                            var select_dropdown = document.getElementById('select_dropdown_assets_'+j)
                            var asset = document.getElementById('asset_'+j)
                            asset.value = assets[l]
                            if(document.getElementById('asset_'+j).value == 'General / Other'){
                                that.transactionObject[6].values[j].values = {
                                    "sale_proceeds": null,
                                    "date_of_purchase": null,
                                    "year_of_purchase": null,
                                    "date_of_sale": null,
                                    "year_of_sale": null,
                                    "purchase_cost": null
                                }
                                that.addOPForm(j)
                            }else{
                                that.transactionObject[6].values[j].values = {
                                    "extent_of_sale": null,
                                }
                                that.addAssetForm(j, l)
                            }
                            select_dropdown.style.display = 'none'
                            showasset.style.display = 'block'
                            hideasset.style.display = 'none'
                        })
                    })(k);
                }

                window.onclick = function(event) {
                    var select_dropdown_months = document.getElementById('select_dropdown_assets_'+j)
                    select_dropdown_months.style.display = 'none'
                    showasset.style.display = 'block'
                    hideasset.style.display = 'none'
                }

                var create_btn = document.getElementById('create_btn_'+j)
                create_btn.addEventListener('click', function(){
                    that.createSale(j)
                })
            })(i);
        }
    },

    addWholeSale: function(i, l, option){
        var that = this
        var final_html = ``
        var j = i

        var dates = [
            "1st January", "31st January", "1st February", "28th February",
            "1st March", "31st March", "1st April", "30th April", "1st May",
            "31st May", "1st June", "30th June", "1st July", "31st July",
            "1st August", "31st August", "1st Sepetember", "30th Sepetember",
            "1st October", "31st October", "1st Novemeber", "30th Novemeber",
            "1st December", "31st December"
        ]

        final_html += ` <div class="title">
                            Replacement cost:
                        </div>
                        <div class="input-container" style="margin:5px 0 15px 0;">
                             <div class="input-unit green-unit">&#8377;</div>
                             <input class="input-box grey-box" id="sale_proceeds_${i}" 
                             type="number" value="${that.transactionObject[6].values[i].values.sale_proceeds}" />
                        </div>
                        <div class="title">
                            Date of replacement:
                         </div>
                         <div style="display:flex;flex-direction:row;justify-content:space-between;">
                             <div class="input-container" style="margin:5px 0 15px 0;position: relative;width:70%;">
                                 <input class="select-box grey-box" placeholder="Date & Month" id="sale_month_${i}" disabled type="text" 
                                     style="font-size:19px;" `
                                     if(that.transactionObject[6].values[i].values.date_of_sale){
                                        final_html += `value="${that.transactionObject[6].values[i].values.date_of_sale}"`
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
                                <input class="select-box grey-box" placeholder="Year" id="sale_year_${i}" disabled type="number"
                                    style="font-size:19px;width:100%;" value="${that.transactionObject[6].values[i].values.year_of_sale}"/>
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
                                        let asset_number = parseInt(document.getElementById('asset_'+i).value.split(" ")[1])
                                        for(var j=parseInt(that.transactionObject[1].values[asset_number-1].year_of_purchase);j<=2030;j++){
                                            final_html += `<p id="year_dropdown_option_${i}_${j}">${j}</p>`
                                        }
                                        final_html += `
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>`

        if(!option){
            final_html += `<div class="title">
                            Nature of replacement:
                         </div>
                         <div class="input-container" style="margin:5px 0 15px 0;position: relative;">
                             <input class="select-box grey-box" placeholder="Select nature of replacement" 
                                id="nature_of_replacement_${i}" disabled type="text" 
                                style="font-size:19px;"  `
                                     if(that.transactionObject[6].values[i].values.nature_of_replacement){
                                        final_html += `value="${that.transactionObject[6].values[i].values.nature_of_replacement}"`
                                     }
                                final_html += `/>
                                 <div class="dropdown-container green-unit" id="select_nature_icon_show_${i}">
                                 <img src="img/arrow_down.png" 
                                 class="dropdown-tooltip">
                             </div>
                             <div class="dropdown-container green-unit" style="display:none" id="select_nature_icon_hide_${i}">
                                 <img src="img/arrow_up.png" 
                                 class="dropdown-tooltip">
                             </div>
                             <div class="dropdown-options-container year-bubble" id="select_dropdown_nature_${i}">
                                 <div class="dropdown-bubble">
                                   <div class="dropdowntext" style="margin: 0;background-color: rgb(220,220,220);color:black;" id="nature_dropdown_option_${i}">
                                   `
                                    for(var j=0;j<that.nature.length;j++){
                                        final_html += `<p id="nature_dropdown_option_${i}_${j}">${that.nature[j]}</p>`
                                    }
                                    final_html += `
                                  </div>
                                </div>
                            </div>
                        </div>`
        }

        document.getElementById('double_extra_form_'+i).innerHTML = final_html

        var showyear = document.getElementById('select_year_icon_show_'+i)
        var hideyear = document.getElementById('select_year_icon_hide_'+i)

        var showmonth = document.getElementById('select_month_icon_show_'+i)
        var hidemonth = document.getElementById('select_month_icon_hide_'+i)

        showyear.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_years_'+i)
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
            var select_dropdown = document.getElementById('select_dropdown_years_'+i)
            select_dropdown.style.display = 'none'
            showyear.style.display = 'block'
            hideyear.style.display = 'none'
        }) 

        showmonth.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_months_'+i)
            select_dropdown.style.display = 'block'
            showmonth.style.display = 'none'
            hidemonth.style.display = 'block'

            var select_dropdown_years = document.getElementById('select_dropdown_years_'+i)
            select_dropdown_years.style.display = 'none'
            showyear.style.display = 'block'
            hideyear.style.display = 'none'
        })

        hidemonth.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_months_'+i)
            select_dropdown.style.display = 'none'
            showmonth.style.display = 'block'
            hidemonth.style.display = 'none'
        })

        for(var k=parseInt(that.transactionObject[1].values[asset_number-1].year_of_purchase);k<=2030;k++){
            (function(k){
                var l = k;
                var year = document.getElementById('year_dropdown_option_'+i+'_'+l)
                year.addEventListener('click', function(event){
                    var select_dropdown = document.getElementById('select_dropdown_years_'+i)
                    var year_input = document.getElementById('sale_year_'+i)
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
                    var select_dropdown = document.getElementById('select_dropdown_months_'+i)
                    var month_input = document.getElementById('sale_month_'+i)
                    month_input.value = dates[l]
                    select_dropdown.style.display = 'none'
                    showmonth.style.display = 'block'
                    hidemonth.style.display = 'none'
                })
            })(k);
        }

        if(!option){
            var showasset = document.getElementById('select_nature_icon_show_'+i)
            var hideasset = document.getElementById('select_nature_icon_hide_'+i)


            showasset.addEventListener('click', function(event){
                event.stopPropagation()
                var select_dropdown = document.getElementById('select_dropdown_nature_'+i)
                select_dropdown.style.display = 'block'
                showasset.style.display = 'none'
                hideasset.style.display = 'block'
            })

            hideasset.addEventListener('click', function(event){
                event.stopPropagation()
                var select_dropdown = document.getElementById('select_dropdown_nature_'+i)
                select_dropdown.style.display = 'none'
                showasset.style.display = 'block'
                hideasset.style.display = 'none'
            })        

            for(var k=0;k<that.nature.length;k++){
                (function(k){
                    var l = k;
                    var month = document.getElementById('nature_dropdown_option_'+i+'_'+l)
                    month.addEventListener('click', function(event){
                        var select_dropdown = document.getElementById('select_dropdown_nature_'+i)
                        var asset = document.getElementById('nature_of_replacement_'+i)
                        asset.value = that.nature[l]
                        select_dropdown.style.display = 'none'
                        showasset.style.display = 'block'
                        hideasset.style.display = 'none'
                    })
                })(k);
            }
        }

        window.onclick = function(event) {
            var select_dropdown_months = document.getElementById('select_dropdown_months_'+i)
            select_dropdown_months.style.display = 'none'
            showmonth.style.display = 'block'
            hidemonth.style.display = 'none'

            var select_dropdown_years = document.getElementById('select_dropdown_years_'+i)
            select_dropdown_years.style.display = 'none'
            showyear.style.display = 'block'
            hideyear.style.display = 'none'

            if(!option){
                var select_dropdown_months = document.getElementById('select_dropdown_nature_'+i)
                showasset.style.display = 'block'
                hideasset.style.display = 'none'
            }
        }

    },

    addAssetForm: function(i, l){
        var that = this
        var final_html = ``
        var j = i

        var extents = [
            "Replacement of whole " + this.currentAsset,
            "Replacement of part"
        ]

        final_html += ` <div class="title">
                            Extent of replacement:
                         </div>
                         <div class="input-container" style="margin:5px 0 15px 0;position: relative;">
                             <input class="select-box grey-box" placeholder="Select the extent of replacement" id="extent_of_sale_${i}" disabled type="text" 
                                 style="font-size:19px;" `
                                 if(that.transactionObject[6].values[i].values.extent_of_sale){
                                    final_html += `value="${that.transactionObject[6].values[i].values.extent_of_sale}"`
                                 }
                            final_html += `/>
                             <div class="dropdown-container green-unit" id="select_extent_icon_show_${i}">
                                 <img src="img/arrow_down.png" 
                                 class="dropdown-tooltip">
                             </div>
                             <div class="dropdown-container green-unit" style="display:none" id="select_extent_icon_hide_${i}">
                                 <img src="img/arrow_up.png" 
                                 class="dropdown-tooltip">
                             </div>
                             <div class="dropdown-options-container year-bubble" id="select_dropdown_extent_${i}">
                                 <div class="dropdown-bubble">
                                   <div class="dropdowntext" style="margin: 0;background-color: rgb(220,220,220);color:black;" id="extent_dropdown_option_${i}">
                                   `
                                    for(var j=0;j<extents.length;j++){
                                        final_html += `<p id="extent_dropdown_option_${i}_${j}">${extents[j]}</p>`
                                    }
                                    final_html += `
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div class="detailed-transaction-block" style="width:100%;padding:0;" id="double_extra_form_${i}">
                        </div>`

        document.getElementById('extra_form_'+i).innerHTML = final_html

        var showextent = document.getElementById('select_extent_icon_show_'+i)
        var hideextent = document.getElementById('select_extent_icon_hide_'+i)

        showextent.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_extent_'+i)
            select_dropdown.style.display = 'block'
            showextent.style.display = 'none'
            hideextent.style.display = 'block'
        })

        hideextent.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_extent_'+i)
            select_dropdown.style.display = 'none'
            hideextent.style.display = 'none'
            showextent.style.display = 'block'
        })

        for(var k=0;k<extents.length;k++){
            (function(k){
                var l = k;
                var extent = document.getElementById('extent_dropdown_option_'+i+'_'+l)
                extent.addEventListener('click', function(event){
                    var select_dropdown = document.getElementById('select_dropdown_extent_'+i)
                    var extent_of_sale = document.getElementById('extent_of_sale_'+i)
                    extent_of_sale.value = extents[l]

                    select_dropdown.style.display = 'none'
                    showextent.style.display = 'block'
                    hideextent.style.display = 'none'

                    if(l == 0){
                        that.transactionObject[6].values[i].values = {
                            "extent_of_sale": extents[l],
                            "sale_proceeds": null,
                            "date_of_sale": null,
                            "year_of_sale": null
                        }
                        that.addWholeSale(i, l, true)
                    }else{
                        that.transactionObject[6].values[i].values = {
                            "extent_of_sale": extents[l],
                            "sale_proceeds": null,
                            "date_of_sale": null,
                            "year_of_sale": null,
                            "nature_of_replacement": null
                        }
                        that.addWholeSale(i, l, false)
                    }
                })
            })(k);
        }

        window.onclick = function(event) {
            var select_dropdown_extent = document.getElementById('select_dropdown_extent_'+i)
            select_dropdown_extent.style.display = 'none'
            showextent.style.display = 'block'
            hideextent.style.display = 'none'
        }

        if(that.transactionObject[6].values[i].values.extent_of_sale){
            if(that.transactionObject[6].values[i].values.extent_of_sale.includes("whole")){
                that.addWholeSale(i, 0, true)
            }else if(that.transactionObject[6].values[i].values.extent_of_sale.includes("part")){
                that.addWholeSale(i, 0, false)
            }
        }

    },

    addOPForm: function(i){
        var that = this
        var final_html = ``
        // (function(i){
        var j = i

        var dates = [
            "1st January", "31st January", "1st February", "28th February",
            "1st March", "31st March", "1st April", "30th April", "1st May",
            "31st May", "1st June", "30th June", "1st July", "31st July",
            "1st August", "31st August", "1st Sepetember", "30th Sepetember",
            "1st October", "31st October", "1st Novemeber", "30th Novemeber",
            "1st December", "31st December"
        ]

        final_html += ` 
                        <div class="title">
                            Replacement cost:
                        </div>
                        <div class="input-container" style="margin:5px 0 15px 0;">
                             <div class="input-unit green-unit">&#8377;</div>
                             <input class="input-box grey-box" id="sale_proceeds_${i}" 
                             type="number" value="${that.transactionObject[6].values[i].values.sale_proceeds}" />
                        </div>
                        <div class="title">
                            Date of replacement:
                         </div>
                         <div style="display:flex;flex-direction:row;justify-content:space-between;">
                             <div class="input-container" style="margin:5px 0 15px 0;position: relative;width:70%;">
                                 <input class="select-box grey-box" placeholder="Date & Month" id="sale_month_${i}" disabled type="text" 
                                     style="font-size:19px;" `
                                     if(that.transactionObject[6].values[i].values.date_of_sale){
                                        final_html += `value="${that.transactionObject[6].values[i].values.date_of_sale}"`
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
                                <input class="select-box grey-box" placeholder="Year" id="sale_year_${i}" disabled type="number"
                                    style="font-size:19px;width:100%;" value="${that.transactionObject[6].values[i].values.year_of_sale}"/>
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
                                        for(var j=parseInt(that.transactionObject[0].year);j<=2030;j++){
                                            final_html += `<p id="year_dropdown_option_${i}_${j}">${j}</p>`
                                        }
                                        final_html += `
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>`

        document.getElementById('extra_form_'+i).innerHTML = final_html

        var showyear = document.getElementById('select_year_icon_show_'+i)
        var hideyear = document.getElementById('select_year_icon_hide_'+i)


        var pshowyear = document.getElementById('p_select_year_icon_show_'+i)
        var phideyear = document.getElementById('p_select_year_icon_hide_'+i)

        var showmonth = document.getElementById('select_month_icon_show_'+i)
        var hidemonth = document.getElementById('select_month_icon_hide_'+i)

        var pshowmonth = document.getElementById('p_select_month_icon_show_'+i)
        var phidemonth = document.getElementById('p_select_month_icon_hide_'+i)

        showyear.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_years_'+i)
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
            var select_dropdown = document.getElementById('select_dropdown_years_'+i)
            select_dropdown.style.display = 'none'
            showyear.style.display = 'block'
            hideyear.style.display = 'none'
        }) 

        showmonth.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_months_'+i)
            select_dropdown.style.display = 'block'
            showmonth.style.display = 'none'
            hidemonth.style.display = 'block'

            var select_dropdown_years = document.getElementById('select_dropdown_years_'+i)
            select_dropdown_years.style.display = 'none'
            showyear.style.display = 'block'
            hideyear.style.display = 'none'
        })

        hidemonth.addEventListener('click', function(event){
            event.stopPropagation()
            var select_dropdown = document.getElementById('select_dropdown_months_'+i)
            select_dropdown.style.display = 'none'
            showmonth.style.display = 'block'
            hidemonth.style.display = 'none'
        })

        for(var k=parseInt(that.transactionObject[0].year);k<=2030;k++){
            (function(k){
                var l = k;
                var year = document.getElementById('year_dropdown_option_'+i+'_'+l)
                year.addEventListener('click', function(event){
                    var select_dropdown = document.getElementById('select_dropdown_years_'+i)
                    var year_input = document.getElementById('sale_year_'+i)
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
                var p_month = document.getElementById('p_month_dropdown_option_'+i+'_'+l)
                month.addEventListener('click', function(event){
                    var select_dropdown = document.getElementById('select_dropdown_months_'+i)
                    var month_input = document.getElementById('sale_month_'+i)
                    month_input.value = dates[l]
                    select_dropdown.style.display = 'none'
                    showmonth.style.display = 'block'
                    hidemonth.style.display = 'none'
                })

            })(k);
        }

        window.onclick = function(event) {
            var select_dropdown_months = document.getElementById('select_dropdown_months_'+i)
            select_dropdown_months.style.display = 'none'
            showmonth.style.display = 'block'
            hidemonth.style.display = 'none'

            var select_dropdown_years = document.getElementById('select_dropdown_years_'+i)
            select_dropdown_years.style.display = 'none'
            showyear.style.display = 'block'
            hideyear.style.display = 'none'
        }
        // })(i);
    },

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
        screen.orientation.lock('portrait');
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

    createSale: function(i){
        var that = this
        var stop = false
        if(document.getElementById('asset_'+i).value == null || document.getElementById('asset_'+i).value == ''){
            alert("Please select the "+this.currentAsset+" being replaced to fill in further details and later click on the CREATE REPLACEMENT button")
            stop = true
        }else if(document.getElementById('asset_'+i).value == "General / Other"){
            that.transactionObject[6].values[i] = {
                "asset": document.getElementById('asset_'+i).value,
                "values": {
                    "sale_proceeds": parseFloat(document.getElementById('sale_proceeds_'+i).value),
                    "date_of_sale": document.getElementById('sale_month_'+i).value,
                    "year_of_sale": parseInt(document.getElementById('sale_year_'+i).value),
                }
            }
        }else{
            let asset_number = parseInt(document.getElementById('asset_'+i).value.split(" ")[1]) -1
            if(document.getElementById('extent_of_sale_'+i).value == null || document.getElementById('extent_of_sale_'+i).value == ''){
                alert("Please select the extent of replacement to fill in further details and later click on the CREATE REPLACEMENT button")
                stop = true
            }else if(document.getElementById('extent_of_sale_'+i).value.includes("whole")){
                that.transactionObject[6].values[i] = {
                    "asset": document.getElementById('asset_'+i).value,
                    "values": {
                        "extent_of_sale": document.getElementById('extent_of_sale_'+i).value,
                        "sale_proceeds": parseFloat(document.getElementById('sale_proceeds_'+i).value),
                        "date_of_sale": document.getElementById('sale_month_'+i).value,
                        "year_of_sale": parseInt(document.getElementById('sale_year_'+i).value),
                        "asset_cost": parseFloat(that.transactionObject[1].values[asset_number].cost + that.transactionObject[1].values[asset_number].additional_costs)
                    }
                }
            }else{
                that.transactionObject[6].values[i] = {
                    "asset": document.getElementById('asset_'+i).value,
                    "values": {
                        "extent_of_sale": document.getElementById('extent_of_sale_'+i).value,
                        "sale_proceeds": parseFloat(document.getElementById('sale_proceeds_'+i).value),
                        "date_of_sale": document.getElementById('sale_month_'+i).value,
                        "year_of_sale": parseInt(document.getElementById('sale_year_'+i).value),
                        "nature_of_replacement": document.getElementById('nature_of_replacement_'+i).value,
                        "asset_cost": parseFloat(that.transactionObject[1].values[asset_number].cost + that.transactionObject[1].values[asset_number].additional_costs)
                    }
                }
            }
        }
        if(!stop && that.checkForm(i)){
            if(i != that.transactionObject[6].values.length-1){
                that.transactionObject[6].values.splice(that.transactionObject[6].values.length-1, 1)
            }
            that.transactionObject[6].count = that.transactionObject[6].values.length
            localStorage.removeItem('transactionObject')
            localStorage.setItem('transactionObject', JSON.stringify(that.transactionObject))
            that.initialize()
        }
    },

    checkForm: function(j){
        let obj = this.transactionObject[6].values[j]
        if(obj.values.sale_proceeds == null || obj.values.sale_proceeds == ''){
            alert("Please enter the replacement cost")
            return false
        }else if(obj.values.date_of_sale == null || obj.values.date_of_sale == ''){
            alert("Please select the date and month of replacement")
            return false
        }else if(obj.values.year_of_sale == null || obj.values.year_of_sale == ''){
            alert("Please select the year of replacement")
            return false
        }else if(obj.asset != "General / Other"){
            if(obj.values.extent_of_sale.includes("part") && obj.values.nature_of_replacement ==null){
                alert("Please select the nature of replacement")
                return false
            }else{
                return true
            }
        }else{
            return true
        }
    },

    closeKeyboard: function(){
        Keyboard.hide();
    },

    nextButton: function(){
        window.location = 'transactions.html'
    }
};

app.initialize();
