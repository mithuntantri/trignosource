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
    tutorials: null,
    subject: null,
    currentSubject: null,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.tutorials = localStorage.getItem('tutorials')
        this.tutorials = JSON.parse(this.tutorials).data
        console.log('tutorials', this.tutorials)

        this.currentSubject = parseInt(localStorage.getItem('currentSubject'));
        this.subject = this.tutorials[parseInt(this.currentSubject)]
        var body = document.getElementById('chapters_page');
        body.classList.add("subject_"+parseInt(this.currentSubject+1))
        var container = document.getElementById('chapters_page_container')
        container.classList.add("subject_"+parseInt(this.currentSubject+1))

        var summary_card = document.getElementById('summary_card');
        summary_card.classList.add("subject_"+parseInt(this.currentSubject+1))

        document.getElementsByClassName('chapters_count')[0].innerHTML = 'CHAPTERS- ' + this.subject.chapters.length
        
        var modules = [], parts = [], total_modules = [], total_parts = []
        for(i=0;i<this.subject.chapters.length;i++){
            var chapter = this.subject.chapters[i]
            console.log("chapter>>>", chapter)
            if(chapter.is_module == 'module'){
                modules.push(chapter)
                total_modules.push([])
            }else{
                parts.push(chapter)
                total_parts.push([])
            }
        }
        for(var i=0;i<modules.length;i++){
            total_modules[parseInt(modules[i].mop_number) - 1].push(modules[i])
        }
        for(var i=0;i<parts.length;i++){
            total_parts[parseInt(parts[i].mop_number) - 1].push(parts[i])
        }
        console.log(modules, parts, total_modules, total_parts)

        var module_list = ``;
        var parts_list = ``;
        var part3 = ``;

        for(var i=0;i<total_modules.length;i++){
            if(total_modules[i].length > 0){
                module_list += `<div class="module_details_item">
                <div>Module `+ (i+1) + `</div>
                <div>0` + total_modules[i].length + ` Chapters</div></div>`
                part3 += `<div class="module_header">MODULE ` + (i+1) + `</div>`
                for(var j=0;j<total_modules[i].length;j++){
                    var x = total_modules[i][j].chapter_number
                    console.log("chapter_name",total_modules[i][j].chapter_name)                    
                    part3 += `<div class="card chapter_card" id="chapter_card_`+total_modules[i][j].chapter_number+`">
                    <div class="chapter_number_part subject_`+parseInt(this.currentSubject+1)+`">0`+(total_modules[i][j].chapter_number)+`</div>
                    <div class="chapter_name_part">`+total_modules[i][j].chapter_name+`</div></div>`
                }
            }
        }

        for(var i=0;i<total_parts.length;i++){
           if(total_parts[i].length > 0){
                parts_list += `<div class="module_details_item">
                <div>Part `+ (i+1) + `&nbsp;-&nbsp;`+ total_parts[i][0].mop_name +`</div>
                <div>0` + total_parts[i].length + ` Chapters</div></div>`
                part3 += `<div class="module_header">PART ` + (i+1) + `&nbsp;-&nbsp;`+total_parts[i][0].mop_name+`</div>`
                for(var j=0;j<total_parts[i].length;j++){
                    console.log("chapter_name",total_parts[i][j].chapter_name)                    
                    part3 += `<div class="card chapter_card" id="chapter_card_`+(total_parts[i][j].chapter_number)+`">
                    <div class="chapter_number_part subject_`+parseInt(this.currentSubject+1)+`">0`+(total_parts[i][j].chapter_number)+`</div>
                    <div class="chapter_name_part">`+total_parts[i][j].chapter_name+`</div></div>`
                }
            }
        }

        console.log("module_list", module_list)
        console.log("parts_list", parts_list)

        document.getElementsByClassName('module_details')[0].innerHTML = module_list + parts_list
         
        var part1 = document.getElementById('part1');
        part1.innerHTML = `<img src="img/subject_icons/subject_` + 
        (parseInt(this.currentSubject)+1) + `_a.png" style="width:75px;height:auto;margin:15px auto;"/>` +
        `<div class="chapter_title">` + this.subject.subject_name + `</div>`

        localStorage.removeItem('currentChapter')

        document.getElementsByClassName('part3')[0].innerHTML = part3
        this.handleClick(total_modules)
        this.handleClick(total_parts)

    },

    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
    },

    handleClick: function(modules){
        console.log("Handling Click")
        for(var i=0;i<modules.length;i++){
            for(var j=0;j<modules[i].length;j++){
                (function(j){
                    var k = modules[i][j].chapter_number;
                    console.log("K>>>>", k)
                    var chapter_card = document.getElementById('chapter_card_'+k);
                    chapter_card.addEventListener('click', function(){
                      console.log('gotoChapter', k)
                      localStorage.currentChapter = (k - 1)
                      window.location = 'page1.html'
                    }, false);
                })(j);
            }   
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();
