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
    videos: [],
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        var tutorials = localStorage.getItem('tutorials')
        tutorials = JSON.parse(tutorials).data
        console.log('tutorials', tutorials)

        document.getElementById('subject_name').innerHTML = tutorials[0].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = tutorials[0].chapters[0].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + tutorials[0].chapters[0].chapter_number

        this.videos = tutorials[0].chapters[0].videos
        var final_html = ``
        for(var i=0;i< this.videos.length;i++){
          final_html += `<div class="interactive__videos" id="interactive-videos-`+i+`">
            <div class="videos__thumbnail onerounded-card">
              <img style="width:100%;" src='http://192.168.0.128:8094/uploads/Thumbnails/` + this.videos[i].thumbnail_url + `'/>
            </div>
            <div class="videos__details onerounded-card">
              <div class="videos__title">`+this.videos[i].video_name+`</div>
              <div class="videos__subdetails">
                <span class="videos__number">`+ this.videos[i].video_number+ `</span>
                <span class="videos__number">|</span>
                <span class="videos__duration">Duratiom: 11m 42s</span>
                <span class="videos__duration">|</span>
                <span class="videos__interactions">Interactions: `+ this.videos[i].questions.length + `</span>
              </div>
            </div>
          </div>`
          console.log(final_html)
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
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
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
    }
};

app.initialize();
