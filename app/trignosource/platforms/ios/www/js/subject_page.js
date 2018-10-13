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
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        this.tutorials = localStorage.getItem('tutorials')
        this.tutorials = JSON.parse(this.tutorials).data
        console.log('tutorials', this.tutorials)

        for(var i=0;i<this.tutorials.length;i++){
            document.getElementById('subject_'+ (i+1) + '_title').innerHTML = this.tutorials[i].subject_name
        }

        localStorage.removeItem('currentSubject')
    },

    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
        var that = this;

        document.addEventListener("backbutton", function(e){
               e.preventDefault();
               navigator.app.exitApp();
        }, false);
        
        var subject1 = document.getElementById('subject_1');
        subject1.addEventListener('click', function(){
            if(that.tutorials[0].chapters.length > 0){
                localStorage.currentSubject = 0;
                window.location = 'chapters_page.html'
            }else{
                that.showBottom();
            }
        }, false);

        var subject2 = document.getElementById('subject_2');
        subject2.addEventListener('click', function(){
            if(that.tutorials[1].chapters.length > 0){
                localStorage.currentSubject = 1;
                window.location = 'chapters_page.html'    
            }else{
                that.showBottom();
            }
        }, false);

        var subject3 = document.getElementById('subject_3');
        subject3.addEventListener('click', function(){
            if(that.tutorials[2].chapters.length > 0){
                localStorage.currentSubject = 2;
                window.location = 'chapters_page.html'
            }else{
                that.showBottom();
            }
        }, false);

        var subject4 = document.getElementById('subject_4');
        subject4.addEventListener('click', function(){
            if(that.tutorials[3].chapters.length > 0){
                localStorage.currentSubject = 3;
                window.location = 'chapters_page.html'
            }else{
                that.showBottom();
            }
        }, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        screen.orientation.lock('portrait');
        document.addEventListener("offline", function(){ 
          console.log("Device offline")
          alert("Seems your internet is disconnected. Please check and try again") 
          navigator.app.exitApp();
        }, false);
    },

    showBottom: function() {
      window.plugins.toast.showWithOptions(
        {
          message: "No chapters for the selected subject",
          duration: "short",
          position: "bottom",
          addPixelsY: -40
        }
      );
    }
};

app.initialize();
