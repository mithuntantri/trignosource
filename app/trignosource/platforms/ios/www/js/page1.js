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
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.tutorials = localStorage.getItem('tutorials')
        this.tutorials = JSON.parse(this.tutorials).data
        console.log('tutorials', this.tutorials)

        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))

        document.getElementById('subject_name').innerHTML = this.tutorials[this.currentSubject].subject_name.toUpperCase()
        document.getElementById('subject_name').classList.add("subject_"+parseInt(this.currentSubject+1))
        document.getElementById('chapter_name').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_number
        document.getElementById('videos_count').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].videos.length

        document.getElementsByClassName('subject_image')[0].innerHTML = '<img style="width:75%;" src="img/subject_icons/subject_'+ parseInt(this.currentSubject + 1) + '_b.png"/>'

        var videos_card = document.getElementById('videos-card');
        var that = this
        videos_card.addEventListener('click', function(){
            that.gotoVideos()
        }, false);
    },

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
        document.addEventListener("offline", function(){ 
          console.log("Device offline")
          alert("Seems your internet is disconnected. Please check and try again") 
          navigator.app.exitApp();
        }, false);
    },

    gotoVideos: function(){
        if(this.tutorials[this.currentSubject].chapters[this.currentChapter].videos.length == 0){
            this.showBottom()
        }else{
            console.log('gotoVideos')
            window.location = 'page2.html'
        }
    },

    showBottom: function() {
      window.plugins.toast.showWithOptions(
        {
          message: "No videos for the selected chapter",
          duration: "short",
          position: "bottom",
          addPixelsY: -40
        }
      );
    }
};

app.initialize();
