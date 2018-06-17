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

        localStorage.removeItem('editInput')
        localStorage.removeItem('currentResult')

        document.getElementById('subject_name').innerHTML = this.tutorials[this.currentSubject].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_number

        var final_html = ``
        var img_loaded = []
        var currentCalculators = this.calculators[parseInt(this.currentSubject)][parseInt(this.currentChapter)]
        for(var i=0;i< currentCalculators.length;i++){
          final_html += `
          <div class="onerounded-card" 
                id="interactive-videos-`+i+`"
                style="height:auto;flex-direction:column;display:flex;">
              <div style="position:relative;display:flex;flex-grow:0;flex-direction:row;width:100%;padding:5px 0;">
                <div class="videos__title" style="width:58px;text-align:center;">`+currentCalculators[i].number+`</div>
                <div class="videos__title">`+currentCalculators[i].name+`</div>
                <div id="open_details_${i}" style="position:absolute;bottom:5px;right:5px;display:flex;flex-direction:row;justify-content:flex-end;padding:7px;">
                  <img src="img/calculators/green_arrow_down.png" style="width:11px;height:9px;">
                </div>
                <div id="close_details_${i}" style="position:absolute;bottom:5px;right:5px;display:flex;flex-direction:row;justify-content:flex-end;padding:7px;display:none;">
                  <img src="img/calculators/green_arrow_up.png" style="width:11px;height:9px;">
                </div>
              </div>
              <div id="opened_details_${i}" style="padding:10px;border-top:1px solid;border-color:rgb(100,120,100);display:none;">
                <div style="background-color:rgb(245,245,245);border-radius:10px;padding:3px;">
                  <ul style="margin:0;padding-left:30px;">`

                  for(var j=0; j< currentCalculators[i].results.length;j++){
                    final_html += `<li>`+currentCalculators[i].results[j]+`</li>`
                  }
                  
                  final_html += `</ul>
                </div>
              </div>
          </div>`
        }

        document.getElementById('interaction_videos').innerHTML = final_html
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
        var currentCalculators = this.calculators[parseInt(this.currentSubject)][parseInt(this.currentChapter)]
        for(var i=0;i< currentCalculators.length;i++){
          (function(i){
            var j = i;
            var videos_card = document.getElementById('interactive-videos-'+i);
            console.log(videos_card, id)

            var open_details = document.getElementById('open_details_'+i)
            open_details.addEventListener('click', function(event){
              document.getElementById('opened_details_'+i).style.display = 'block'
              document.getElementById('close_details_'+i).style.display = 'block'
              document.getElementById('open_details_'+i).style.display = 'none'
              event.stopPropagation();
            })

            var close_details = document.getElementById('close_details_'+i)
            close_details.addEventListener('click', function(event){
              document.getElementById('opened_details_'+i).style.display = 'none'
              document.getElementById('close_details_'+i).style.display = 'none'
              document.getElementById('open_details_'+i).style.display = 'block'
              event.stopPropagation();
            })

            videos_card.addEventListener('click', function(){
              localStorage.currentCalculator = j
              window.location = 'calculator.html'
            }, false);
          })(i);
        }
        document.addEventListener("offline", function(){ 
          console.log("Device offline")
          alert("Seems your internet is disconnected. Please check and try again") 
          navigator.app.exitApp();
        }, false);
    }
};

app.initialize();
