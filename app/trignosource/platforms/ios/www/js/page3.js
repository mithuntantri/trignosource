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
    baseUrl: null,
    currentSubject: null,
    currentChapter: null,
    currentVideo: null,
    tutorials: null,
    pauseTimes : [],
    interactionTimes:[],
    whiteTimes : [],
    stopPropogation: false,
    stayHere: false,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.baseUrl = localStorage.getItem('baseUrl')

        this.tutorials = localStorage.getItem('tutorials')
        this.currentSubject = parseInt(localStorage.getItem('currentSubject'))
        this.currentChapter = parseInt(localStorage.getItem('currentChapter'))
        this.currentVideo = parseInt(localStorage.getItem('currentVideo'))
        
        this.tutorials = JSON.parse(this.tutorials).data
        this.video = this.tutorials[this.currentSubject].chapters[this.currentChapter].videos[this.currentVideo]
        this.questions = this.tutorials[this.currentSubject].chapters[this.currentChapter].videos[this.currentVideo].questions
        console.log('tutorials', this.tutorials)

        document.getElementById('subject_name').innerHTML = this.tutorials[this.currentSubject].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + this.tutorials[this.currentSubject].chapters[this.currentChapter].chapter_number

        document.getElementById('video_name').innerHTML = this.video.video_name
        document.getElementById('video_number').innerHTML = '0' + this.video.video_number

        if(parseInt(this.currentVideo) == this.tutorials[this.currentSubject].chapters[this.currentChapter].videos.length - 1){
          console.log("no more videos")
          document.getElementById('bottom-next-part').style.display = 'none'
        }else{
          console.log("more videos")
          document.getElementById('bottom-next-part').style.display = 'block'
          document.getElementById('next_video_name').innerHTML = this.tutorials[this.currentSubject].chapters[this.currentChapter].videos[parseInt(this.currentVideo)+1].video_name
          document.getElementById('next_video_duration').innerHTML = this.getDuration(this.tutorials[this.currentSubject].chapters[this.currentChapter].videos[parseInt(this.currentVideo)+1].duration)
        }

        document.getElementById('video-element').innerHTML = "<source src='"+this.baseUrl+"/uploads/Videos/"+this.video.file_name+"' type='video/mp4'>"
        this.loadVieo(0);
        this.handleNext();
    },

    seekTenSecondsBehind: function(){
      this.seekToTime(this.player.currentTime - 10)
    },

    seekTenSecondsForward: function(){
      this.seekToTime(this.player.currentTime + 10)
    },

    reLoadUnexplored: function(){
      document.getElementById('controls').classList.remove("hide")
      document.getElementById('controls').classList.remove("show")
      document.getElementById('controls').classList.add("show")
      var progressBarContainer = document.getElementById('progress-bar-container');
      var width = progressBarContainer.offsetWidth
      console.log(width)
      var total_width = this.progressBar.offsetWidth
      console.log(this.questions)
      document.getElementsByClassName('unexplored')[0].innerHTML = ''
      for(var i=0;i<this.whiteTimes.length;i++){
        var left_pc = parseInt(this.whiteTimes[i].start_time) / parseInt(this.video.duration) * 100
        var right_pc = parseInt(this.whiteTimes[i].end_time) / parseInt(this.video.duration) * 100
        var left_px = Math.floor(15 + (left_pc * width / 100))
        var right_px = Math.floor(15 + (right_pc * width / 100))
        var total_width = right_px-left_px
        console.log("left_pc", left_pc)
        console.log("left_px", left_px)
        var ele = `<div id=unexplored_`+this.whiteTimes[i].question_number+` style="width:`+total_width+`px;height:6px;background-color:yellow;position:absolute;left:`+ left_px+`px;"></div>`
        console.log(ele)
        document.getElementsByClassName('unexplored')[0].innerHTML += ele
        if(i== this.whiteTimes.length -1){
          document.getElementById('controls').classList.remove("show")
          document.getElementById('controls').classList.add("hide")
        }
      }
    },

    loadUnexplored: function(start_time, end_time, question_number){
      document.getElementById('controls').classList.remove("hide")
      document.getElementById('controls').classList.remove("show")
      document.getElementById('controls').classList.add("show")
      var progressBarContainer = document.getElementById('progress-bar-container');
      var width = progressBarContainer.offsetWidth
      console.log(width)
      var total_width = this.progressBar.offsetWidth
      console.log(this.questions)
      document.getElementsByClassName('unexplored')[0].innerHTML = ''
      for(var i=0;i<this.questions.length;i++){
        this.whiteTimes.push({start_time:start_time, end_time: end_time, id:'unexplored_'+question_number, question_number: question_number})
        var left_pc = parseInt(start_time) / parseInt(this.video.duration) * 100
        var right_pc = parseInt(end_time) / parseInt(this.video.duration) * 100
        var left_px = Math.floor(15 + (left_pc * width / 100))
        var right_px = Math.floor(15 + (right_pc * width / 100))
        var total_width = right_px-left_px
        console.log("left_pc", left_pc)
        console.log("left_px", left_px)
        var ele = `<div id=unexplored_`+question_number+` style="width:`+total_width+`px;height:6px;background-color:yellow;position:absolute;left:`+ left_px+`px;"></div>`
        console.log(ele)
        document.getElementsByClassName('unexplored')[0].innerHTML += ele
        if(i== this.questions.length -1){
          document.getElementById('controls').classList.remove("show")
          document.getElementById('controls').classList.add("hide")
        }
      }
    },

    loadPauses : function(){
      document.getElementById('controls').classList.remove("hide")
      document.getElementById('controls').classList.remove("show")
      document.getElementById('controls').classList.add("show")
      var progressBarContainer = document.getElementById('progress-bar-container');
      var width = progressBarContainer.offsetWidth
      console.log(width)
      var total_width = this.progressBar.offsetWidth
      console.log(this.questions)
      this.pauseTimes = []
      this.interactionTimes = []
      document.getElementsByClassName('pauses')[0].innerHTML = '';
      for(var i=0;i<this.questions.length;i++){
        var left_pc = parseInt(this.questions[i].appear_time) / parseInt(this.video.duration) * 100
        this.pauseTimes.push({
          'question_number' : this.questions[i].question_number,
          'time_of_pause' : parseFloat(this.questions[i].time_of_pause),
          'appear_time': parseFloat(this.questions[i].appear_time)
        })
        this.interactionTimes.push({
          'question_number' : this.questions[i].question_number,
          'time_of_pause' : parseFloat(this.questions[i].time_of_pause),
          'appear_time': parseFloat(this.questions[i].appear_time)
        })
        var left_px = Math.floor(15 + (left_pc * width / 100))
        console.log("left_pc", left_pc)
        console.log("left_px", left_px)
        var ele = `<div style="width:5px;height:6px;background-color:blue;position:absolute;left:`+ left_px+`px;"></div>`
        console.log(ele)
        document.getElementsByClassName('pauses')[0].innerHTML += ele
        if(i== this.questions.length -1){
          document.getElementById('controls').classList.remove("show")
          document.getElementById('controls').classList.add("hide")
        }
      }
      console.log("pauseTimes",this.pauseTimes)
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


    getTime: function(duration){
      var hours = 0, min = 0, seconds = 0;
      var result = ''
      if(duration >= 3600){
        hours = parseInt(duration/60)
        duration = duration-(hours*60)
        if(hours < 10){
          result += "0"+hours+":"
        }else{
          result += hours+":"
        }
      }
      if(duration >= 60){
        min = parseInt(duration/60)
        duration = duration-(min*60)
        if(min < 10){
          result += '0'+min+":"
        }else{
          result += min+":"          
        }
      }else{
        result += '00:'
      }
      seconds = parseInt(duration)
      if(seconds < 10){
        result += "0"+seconds
      }else{
        result+= seconds
      }
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
        document.getElementById('back_arrow').addEventListener('click', function(e){
            navigator.app.backHistory();
        })
    },

    handleNext: function(){
      var nextpart = document.getElementById('bottom-next-part')
        var videoopen = document.getElementById('video-open')
        var videoclose = document.getElementById('video-close')
        console.log(nextpart)
        nextpart.addEventListener('click', function(){
          console.log("Click Open next")
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

    loadVieo: function(starttime){
      console.log("sscript loaded")

      // Get a handle to the player
      this.player = document.getElementById('video-element');
      this.player.currentTime = starttime
      this.btnPlay = document.getElementById('btnPlay');
      this.btnPause = document.getElementById('btnPause');
      this.btnRewind = document.getElementById('btnRewind');
      this.btnForward = document.getElementById('btnForward');
      this.settingsBtn = document.getElementById('btnSettings');

      document.getElementById('total_time').innerHTML = this.getTime(this.video.duration)
      document.getElementById('elapsed_time').innerHTML = this.getTime(starttime)
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

      this.btnRewind.addEventListener('click', function(){
        that.seekTenSecondsBehind()
      })
      this.btnForward.addEventListener('click', function(){
        that.seekTenSecondsForward()
      })

      this.player.addEventListener('loadeddata', function(){
          console.log("Video Loaded Successfully!")
          document.getElementById('loading').style.display = 'none'
          document.getElementById('player').style.display = 'flex'
          that.loadPauses();
      }, false)
      // Update the video volume
      // volumeBar.addEventListener("change", function(evt) {
      // 	player.volume = evt.target.value;
      // });
      document.getElementById('btnFullScreen').disabled = true;
      this.player.addEventListener('click', function(){
          console.log("Video Clicked!!!")
          document.getElementById('controls').classList.remove("hide")
          document.getElementById('controls').classList.remove("show")
          document.getElementById('controls').classList.add("show")
          setTimeout(function(){
            document.getElementById('controls').classList.remove("show")
            document.getElementById('controls').classList.add("hide")
          }, 3000)
      }, false);
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
      window.addEventListener('orientationchange', function(){
            console.log('window.orientation : ' + window.orientation);
            var loader = document.getElementById('loading')
            var player = document.getElementById('player')
            var part2 = document.getElementsByClassName('page3-part2')[0]
            var part3 = document.getElementById('bottom-next-part')
            document.getElementById('controls').classList.remove("hide")
            document.getElementById('controls').classList.remove("show")
            document.getElementById('controls').classList.add("hide")
            if(parseInt(window.orientation) == parseInt(90) || parseInt(window.orientation) == parseInt(-90)){
                player.style.height='100%';
                loader.style.height='100%';
                part2.style.display='none'
                part3.style.display='none'
                setTimeout(function(){
                  that.seekToTime(that.player.currentTime);
                  that.reLoadUnexplored();
                },500)
            }else{
                player.style.height='200px';
                loader.style.height='200px';
                part2.style.display='flex';
                if(parseInt(that.currentVideo) == that.tutorials[that.currentSubject].chapters[that.currentChapter].videos.length - 1){
                  part3.style.display='none'
                }else{
                  part3.style.display='block'
                }
                setTimeout(function(){
                  that.seekToTime(that.player.currentTime);
                  that.reLoadUnexplored();
                },500)
            }
        });
      fullScreen.addEventListener('click', function(){
        console.log("fullScreen clicked")
        that.toggleFullScreen()
      }, false)

      this.player.addEventListener('ended', function() { that.playPauseVideo(); }, false);

      this.progressBar.addEventListener("click", function(e) {
        if(!that.stopPropogation){
           console.log(e.offsetX)
          console.log(that.interactionTimes)
          console.log(that.whiteTimes)
          var percent = e.offsetX / that.progressBar.offsetWidth;
          var currentTime = percent * that.player.duration;
          that.seekToTime(currentTime)
        }
      },false);

      this.settingsBtn.addEventListener('click', function(){
        that.testShareSheet()
      }, false)
    },

    callback: function(buttonIndex) {
      setTimeout(function() {
        // like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
        alert('button index clicked: ' + buttonIndex);
      });
    },

    testShareSheet: function() {
      var options = {
          androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
          title: 'What do you want with this image?',
          subtitle: 'Choose wisely, my friend', // supported on iOS only
          buttonLabels: ['Share via Facebook', 'Share via Twitter'],
          androidEnableCancelButton : true, // default false
          winphoneEnableCancelButton : true, // default false
          addCancelButtonWithLabel: 'Cancel',
          addDestructiveButtonWithLabel : 'Delete it',
          position: [20, 40], // for iPad pass in the [x, y] position of the popover
          destructiveButtonLast: true // you can choose where the destructive button is shown
      };
      window.plugins.actionsheet.show(options, callback);
    },

    loadBuffer: function(){
        document.getElementById('btnPlay').style.display = 'block'
        document.getElementById('btnPause').style.display = 'none'
        this.changeButtonType(this.btnPause, 'play');
        this.player.pause();

        var that = this;

        document.getElementById('controls').classList.remove("hide")
        document.getElementById('controls').classList.remove("show")
        document.getElementById('controls').classList.add("hide")
        document.getElementById('video_loading').style.display = 'flex'
        // document.getElementById('player').style.display = 'none'
        this.player.addEventListener('canplaythrough', function(){
          console.log("Video canplaythrough Successfully!")
          document.getElementById('video_loading').style.display = 'none'
          document.getElementById('controls').classList.remove("hide")
          document.getElementById('controls').classList.remove("show")
          document.getElementById('controls').classList.add("hide")

          that.changeButtonType(that.btnPlay, 'pause');
          document.getElementById('btnPlay').style.display = 'none'
          document.getElementById('btnPause').style.display = 'block'
          that.player.play();
          // document.getElementById('player').style.display = 'flex'
      }, false)
    },

    seekToTime: function(currentTime){
        var found = false
        var that = this
        console.log("currentTime", currentTime, that.player.currentTime)
        if(currentTime < parseFloat(that.player.currentTime)){
          console.log("Going back")
          for(var i=0;i<that.whiteTimes.length;i++){
            if(that.whiteTimes[i].start_time<currentTime && that.whiteTimes[i].end_time>currentTime){
                console.log("Found White Part")
                found = true
                that.player.currentTime = that.whiteTimes[i].start_time
            }
          }
          if(!found){
            console.log("Not found")
            that.player.currentTime = currentTime
          }
        }else{
          let previous_interaction = 0
          for(var i=0;i<that.interactionTimes.length;i++){
            if(that.interactionTimes[i].appear_time < currentTime 
              && that.interactionTimes[i].appear_time > previous_interaction
              && that.interactionTimes[i].appear_time > that.player.currentTime){
                previous_interaction = that.interactionTimes[i].appear_time
            }
          }
          if(previous_interaction == 0){
            that.player.currentTime = currentTime
          }else{
            that.player.currentTime = previous_interaction
          }
        }
        that.stopPropogation = true
        setTimeout(function(){
          that.stopPropogation = false
        }, 3000)
        console.log("Video Seeked",that.player.currentTime)
        this.loadBuffer()
        for(var i=0;i<that.whiteTimes.length;i++){
          console.log(i)
          console.log("Removing", parseFloat(that.player.currentTime),parseFloat(that.whiteTimes[i].start_time))
          if(parseFloat(that.player.currentTime) <= parseFloat(that.whiteTimes[i].start_time)){
            document.getElementById(that.whiteTimes[i].id).style.display='none'
            console.log("Hiding White Bar", document.getElementById('unexplored_'+that.whiteTimes[i].id))
          }
        }
        that.loadPauses();
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
      for(var i=0;i<this.pauseTimes.length;i++){
        if(Math.floor(that.player.currentTime) == Math.floor(parseInt(this.pauseTimes[i].time_of_pause))){
          console.log("Pausing Video")
          that.player.pause()
        }
      }
      for(var i=0;i<this.pauseTimes.length;i++){
        if(Math.floor(that.player.currentTime) == Math.floor(parseInt(this.pauseTimes[i].appear_time))){
          console.log("Question Appears")
          that.showQuestions(that.pauseTimes[i].question_number)
        }
      }
      // Update the progress bar's value
      this.progressBar.value = percentage;
      // Update the progress bar's text (for browsers that don't support the progress element)
      this.progressBar.innerHTML = percentage + '% played';
      document.getElementById('elapsed_time').innerHTML = this.getTime(that.player.currentTime)
    },

    showQuestions: function(i){
      console.log("Showing Questions", i)
        var question = null
        for(var j=0;j<this.questions.length;j++){
          if(this.questions[j].question_number == i){
            question = this.questions[j]
          }
        }
        console.log(question)
        document.getElementById('controls').classList.remove("show")
        document.getElementById('controls').classList.add("hide")
        document.getElementById('questions').classList.remove("hide")
        document.getElementById('questions').classList.add("show")

        var ele = `<div class="question__name">`+ question.question_name+`</div>
        <div class="question__options">`
        for(var j=0;j<question.options.length;j++){
          ele += `<div class="question__option_item" id="option_`+j+`">`+ question.options[j].option_name+`</div>`
        }
        ele += `</div></div>`
        document.getElementsByClassName('question__container')[0].innerHTML = ele
        var that = this
        for(var j=0;j<question.options.length;j++){
          (function(j){
            var k = j;
            var option_card = document.getElementById('option_'+k)
            option_card.addEventListener('click', function(){
                that.skipToVideo(i, k)
            }, false)
          })(j);
        }
        that.loadPauses();
    },

    skipToVideo: function(i, j){
        var question = null
        for(var k=0;k<this.questions.length;k++){
          if(this.questions[k].question_number == i){
            question = this.questions[k]
          }
        }
        this.pauseTimes.splice(0, 1)
        console.log(this.pauseTimes)
        document.getElementById('questions').classList.remove("show")
        document.getElementById('questions').classList.add("hide")
        document.getElementById('controls').classList.remove("show")
        document.getElementById('controls').classList.add("hide")
        var offsetX = parseFloat(question.options[j].skip_time)
        this.loadUnexplored(question.appear_time, question.options[j].skip_time, question.question_number)
        this.loadVieo(offsetX)
        console.log(offsetX)
        this.player.play()
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
      console.log("Exitig full screen")
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
      var player = document.getElementById('player')
      var part2 = document.getElementsByClassName('page3-part2')[0]
      var part3 = document.getElementsByClassName('page3-part3')[0]
      if (player.requestFullscreen)
          if (document.fullScreenElement) {
              document.cancelFullScreen();
              this.stayHere = false;
          } else {
              console.log("if-if-else")
              this.stayHere = true;
              player.requestFullscreen();
          }
      else if (player.msRequestFullscreen)
          if (document.msFullscreenElement) {
              document.msExitFullscreen();
              this.stayHere = false;
          } else {
            console.log("if-else-if-if-else")
              this.stayHere = true;
              player.msRequestFullscreen();
          }
      else if (player.mozRequestFullScreen)
          if (document.mozFullScreenElement) {
              document.mozCancelFullScreen();
              this.stayHere = false;
          } else {
            console.log("if-else-if-else-if-if-else")
              this.stayHere = true;
              player.mozRequestFullScreen();
          }
      else if (player.webkitRequestFullscreen)
          if (document.webkitFullscreenElement) {
              player.style.height='200px';
              part3.style.display = 'none'
              part2.style.display = 'none'
              this.stayHere = false;
              document.webkitCancelFullScreen();
          } else {console.log('if-else-if-else-if-else-if-if-else')
              player.style.height='100%'
              this.stayHere = true;
              part2.style.display = 'none'
              part3.style.display = 'none'
              player.webkitRequestFullscreen();
          }
      else {
          alert("Fullscreen API is not supported");
      }
    },
    checkOrientation: function(){
       window.addEventListener("orientationchange", orientationChange, true);
            function orientationChange(e) {
                var currentOrientation = "";
                if (window.orientation == 0) {
                    currentOrientation = "portrait";
                } else if (window.orientation == 90) {
                    currentOrientation = "landscape";
                } else if (window.orientation == -90) {
                    currentOrientation = "landscape";
                } else if (window.orientation == 180) {
                    currentOrientation = "portrait";
                }
               console.log(orientation)
            }
    }
};

app.initialize();
