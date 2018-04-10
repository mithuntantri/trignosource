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
    player: null,
    btnPlay : null,
    btnPause : null,
    progressBar: null,
    video: null,
    questions: null,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        var tutorials = localStorage.getItem('tutorials')
        var currentVideo = localStorage.getItem('currentVideo')
        tutorials = JSON.parse(tutorials).data
        this.video = tutorials[0].chapters[0].videos[parseInt(currentVideo)]
        this.questions = tutorials[0].chapters[0].videos[parseInt(currentVideo)].questions
        console.log('tutorials', tutorials)

        document.getElementById('subject_name').innerHTML = tutorials[0].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = tutorials[0].chapters[0].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + tutorials[0].chapters[0].chapter_number

        document.getElementById('video_name').innerHTML = tutorials[0].chapters[0].videos[parseInt(currentVideo)].video_name
        document.getElementById('video_number').innerHTML = '0' + tutorials[0].chapters[0].videos[parseInt(currentVideo)].video_number

        console.log(parseInt(currentVideo), tutorials[0].chapters[0].videos.length - 1)
        if(parseInt(currentVideo) == tutorials[0].chapters[0].videos.length - 1){
          console.log("no more videos")
          document.getElementById('bottom-next-part').style.display = 'none'
        }else{
          console.log("more videos")
          document.getElementById('bottom-next-part').style.display = 'block'
          document.getElementById('next_video_name').innerHTML = tutorials[0].chapters[0].videos[parseInt(currentVideo)+1].video_name
          document.getElementById('next_video_duration').innerHTML = this.getDuration(tutorials[0].chapters[0].videos[parseInt(currentVideo)+1].duration)
        }

        document.getElementById('video-element').innerHTML = "<source src='http://192.168.0.128:8094/uploads/Videos/tutorials_video.mp4' type='video/mp4'>"
        this.loadVieo();
        this.loadPauses();
    },

    loadPauses : function(){
      var progressBarContainer = document.getElementById('progress-bar-container');
      var total_width = this.progressBar.offsetWidth
      for(var i=0;i<this.questions;i++){
        (function(i){

        })(i)
      }
      var ele = `<div style="width:3px;height:6px;background-color:blue;position:absolute;left:100px;top:5px;"></div>`
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
        var playNextBtn = document.getElementById('play-next-btn');
        playNextBtn.addEventListener('click', function(){
          var currentVideo = localStorage.getItem('currentVideo')
          localStorage.setItem('currentVideo', parseInt(currentVideo) + 1);
          window.location = 'page3.html'
        })
        // this.initVideo()
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    initVideo: function(){
      console.log('http://192.168.0.128:8094/uploads/Videos/tutorials_video.mp4')
      var videoUrl = 'http://192.168.0.128:8094/uploads/Videos/tutorials_video.mp4';

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
    },
    loadVieo: function(){
      console.log("sscript loaded")
      // Get a handle to the player
      this.player = document.getElementById('video-element');
      this.btnPlay = document.getElementById('btnPlay');
      this.btnPause = document.getElementById('btnPause');
      // btnMute      = document.getElementById('btnMute');
      this.progressBar  = document.getElementById('progress-bar');
      // volumeBar    = document.getElementById('volume-bar');
      var that = this
      this.btnPlay.addEventListener('click', function(){
        that.playPauseVideo()
      })
      this.btnPause.addEventListener('click', function(){
        that.playPauseVideo()
      })
      // Update the video volume
      // volumeBar.addEventListener("change", function(evt) {
      // 	player.volume = evt.target.value;
      // });
      document.getElementById('btnFullScreen').disabled = true;
      // Add a listener for the timeupdate event so we can update the progress bar
      this.player.addEventListener('timeupdate', function(){
        that.updateProgressBar()
      }, false);

      // Add a listener for the play and pause events so the buttons state can be updated
      this.player.addEventListener('play', function() {
        // Change the button to be a pause button
        that.changeButtonType(that.btnPlay, 'pause');
      }, false);

      this.player.addEventListener('pause', function() {
        // Change the button to be a play button
        that.changeButtonType(that.btnPause, 'play');
      }, false);

      this.player.addEventListener('volumechange', function(e) {
        // Update the button to be mute/unmute
        if (player.muted) that.changeButtonType(that.btnMute, 'unmute');
        else that.changeButtonType(that.btnMute, 'mute');
      }, false);

      var fullScreen = document.getElementById('btnFullScreen')
      fullScreen.addEventListener('click', function(){
        that.toggleFullScreen()
      }, false)

      this.player.addEventListener('ended', function() { that.pause(); }, false);

      this.progressBar.addEventListener("click", function(e) {
        var percent = e.offsetX / that.progressBar.offsetWidth;
        that.player.currentTime = percent * that.player.duration;
        e.target.value = Math.floor(percent / 100);
        e.target.innerHTML = that.progressBar.value + '% played';
      },false);
    },

    playPauseVideo: function() {
      if (this.player.paused || this.player.ended) {
        // Change the button to a pause button
        this.changeButtonType(this.btnPlay, 'pause');
        document.getElementById('btnPlay').style.display = 'none'
        document.getElementById('btnPause').style.display = 'block'
        this.player.play();
      }
      else {
        // Change the button to a play button
        document.getElementById('btnPlay').style.display = 'block'
        document.getElementById('btnPause').style.display = 'none'
        this.changeButtonType(this.btnPause, 'play');
        this.player.pause();
      }
    },

    // Stop the current media from playing, and return it to the start position
    stopVideo: function() {
      this.player.pause();
      if (this.player.currentTime) this.player.currentTime = 0;
    },

    // Toggles the media player's mute and unmute status
    muteVolume: function() {
      if (this.player.muted) {
        // Change the button to a mute button
        this.changeButtonType(this.btnMute, 'mute');
        this.player.muted = false;
      }
      else {
        // Change the button to an unmute button
        this.changeButtonType(this.btnMute, 'unmute');
        this.player.muted = true;
      }
    },

    // Replays the media currently loaded in the player
    replayVideo: function() {
      this.resetPlayer();
      this.player.play();
    },

    // Update the progress bar
    updateProgressBar: function() {
      var that = this
      // Work out how much of the media has played via the duration and currentTime parameters
      var percentage = Math.floor((100 / that.player.duration) * that.player.currentTime);
      // Update the progress bar's value
      this.progressBar.value = percentage;
      // Update the progress bar's text (for browsers that don't support the progress element)
      this.progressBar.innerHTML = percentage + '% played';
    },

    // Updates a button's title, innerHTML and CSS class
    changeButtonType: function(btn, value) {
      btn.title     = value;
      btn.innerHTML = value;
      btn.className = value;
    },

    resetPlayer: function() {
      this.progressBar.value = 0;
      // Move the media back to the start
      this.player.currentTime = 0;
      // Set the play/pause button to 'play'
      this.changeButtonType(this.btnPlay, 'play');
    },

    exitFullScreen: function() {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
      }
    },

    toggleFullScreen: function() {
      //var player = document.getElementById("player");
      if (this.player.requestFullscreen)
          if (document.fullScreenElement) {
              document.cancelFullScreen();
          } else {
              this.player.requestFullscreen();
          }
          else if (this.player.msRequestFullscreen)
          if (document.msFullscreenElement) {
              document.msExitFullscreen();
          } else {
              this.player.msRequestFullscreen();
          }
          else if (this.player.mozRequestFullScreen)
          if (document.mozFullScreenElement) {
              document.mozCancelFullScreen();
          } else {
              this.player.mozRequestFullScreen();
          }
          else if (this.player.webkitRequestFullscreen)
          if (document.webkitFullscreenElement) {
              document.webkitCancelFullScreen();
          } else {
              this.player.webkitRequestFullscreen();
          }
      else {
          alert("Fullscreen API is not supported");
      }
    }
};

app.initialize();
