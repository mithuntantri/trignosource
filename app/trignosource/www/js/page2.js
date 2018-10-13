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

        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))

        document.getElementById('subject_name').innerHTML = this.tutorials[this.currentSubject].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_number
        document.getElementById('videos_count_new').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].videos.length

        this.videos = this.tutorials[this.currentSubject].chapters[this.currentChapter].videos
        var final_html = ``
        var img_loaded = []
        for(var i=0;i< this.videos.length;i++){
          final_html += `<div class="interactive__videos" id="interactive-videos-`+i+`">
            <div class="videos__thumbnail onerounded-card">
              <img style="width:100%;" id="videos_thumbnail_`+i+`" src='`+ this.baseUrl +`/uploads/Thumbnails/` + this.videos[i].thumbnail_url + `'/>
            </div>
            <div class="videos__details onerounded-card">
              <div class="videos__title"><div style="line-height:17px;">`+this.videos[i].video_name+`</div></div>
              <div class="videos__subdetails">
                <span class="videos__number">`+ this.videos[i].video_number+ `</span>
                <span class="videos__number">|</span>
                <span class="videos__duration">Duration: `+this.getDuration(this.videos[i].duration)+`</span>
                <span class="videos__duration">|</span>
                <span class="videos__interactions">Interactions: `+ this.videos[i].questions.length + `</span>
              </div>
            </div>
          </div>`
          img_loaded.push(false)
          console.log(final_html)
        }

        document.getElementById('interaction_videos').innerHTML = final_html

        for(var i=0;i< this.videos.length;i++){
          (function(i){
            var j = i;
            var img_thumbnail = document.getElementById('videos_thumbnail_'+j)
            img_thumbnail.addEventListener('load', function(){
                img_loaded[j] = true
                var hide_loader = true
                for(var k=0;k<img_loaded.length;k++){
                  if(img_loaded[k] == false){
                    hide_loader = false
                  }
                }
                if(hide_loader){
                    document.getElementById('loading').style.display = 'none'
                    document.getElementById('interaction_videos').style.display = 'flex'
                }
            }, false)
          })(i);
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
        screen.orientation.lock('portrait');
        for(var i=0;i< this.videos.length;i++){
          (function(i){
            var j = i;
            var videos_card = document.getElementById('interactive-videos-'+i);
            console.log(videos_card, id)
            videos_card.addEventListener('click', function(){
              console.log('gotoVideos', j)
              localStorage.currentVideo = j
              window.location = 'page3.html'
            }, false);
          })(i);
        }
        document.addEventListener("offline", function(){ 
          console.log("Device offline")
          alert("Seems your internet is disconnected. Please check and try again") 
          navigator.app.exitApp();
        }, false);
    },

    getDuration: function(duration){
      var hours = 0, min = 0, seconds = 0;
      console.log(duration)
      var result = ''
      if(duration >= 3600){
        hours = parseInt(duration/60)
        duration = duration-(hours*60)
        result += hours+"h"
      }
      if(duration >= 60){
        min = parseInt(duration/60)
        duration = duration-(min*60)
        result += " " + min+"m"
      }
      seconds = parseInt(duration)
      result += " " + seconds+"s"
      console.log(result)
      return result.trim()
    },
};

app.initialize();
