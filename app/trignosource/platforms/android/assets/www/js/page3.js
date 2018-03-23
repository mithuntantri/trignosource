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
    video: null,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        var tutorials = localStorage.getItem('tutorials')
        var currentVideo = localStorage.getItem('currentVideo')
        tutorials = JSON.parse(tutorials).data
        this.video = tutorials[0].chapters[0].videos[parseInt(currentVideo)]
        console.log('tutorials', tutorials)

        document.getElementById('subject_name').innerHTML = tutorials[0].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = tutorials[0].chapters[0].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + tutorials[0].chapters[0].chapter_number

        document.getElementById('video_name').innerHTML = tutorials[0].chapters[0].videos[parseInt(currentVideo)].video_name
        document.getElementById('video_number').innerHTML = '0' + tutorials[0].chapters[0].videos[parseInt(currentVideo)].video_number

        console.log(parseInt(currentVideo), tutorials[0].chapters[0].videos.length)
        if(parseInt(currentVideo) < tutorials[0].chapters[0].videos.length - 1){
          console.log("more videos")
          document.getElementById('bottom-next-part').style.display = 'block'
          document.getElementById('next_video_name').innerHTML = tutorials[0].chapters[0].videos[parseInt(currentVideo)+1].video_name
          document.getElementById('next_video_duration').innerHTML = '09m 09s'
        }else{
          console.log("no more videos")
          document.getElementById('bottom-next-part').style.display = 'none'
        }
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
        var that = this;
        // var videoplayback = document.getElementById('videoplayback');
        // console.log(videoplayback)
        // videoplayback.addEventListener('click', function(){
        //     console.log("Clicked fullscreen")
        //     that.initVideo();
        // }, false);

        var nextpart = document.getElementById('bottom-next-part')
        var videoopen = document.getElementById('video-open')
        var videoclose = document.getElementById('video-close')
        nextpart.addEventListener('click', function(){
          if (document.querySelector('.open') !== null) {
            nextpart.classList.remove('open')
            videoopen.style.display = 'none'
            videoclose.style.display = 'block'
          }else{
            nextpart.classList.add('open')
            videoopen.style.display = 'block'
            videoclose.style.display = 'none'
          }
        }, false)
        // this.initVideo()
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    initVideo: function(){
      console.log('http://192.168.122.1:8094/uploads/Videos/tutorials_video.mp4')
      var videoUrl = 'http://192.168.122.1:8094/uploads/Videos/tutorials_video.mp4';

      // Just play a video
      window.plugins.streamingMedia.playVideo(videoUrl);

      // Play a video with callbacks
      var options = {
        successCallback: function() {
          console.log("Video was closed without error.");
        },
        errorCallback: function(errMsg) {
          console.log("Error! " + errMsg);
        },
        orientation: 'landscape',
        shouldAutoClose: true,  // true(default)/false
        controls: true // true(default)/false. Used to hide controls on fullscreen
      };
      window.plugins.streamingMedia.playVideo(videoUrl, options);
    }
};

app.initialize();
