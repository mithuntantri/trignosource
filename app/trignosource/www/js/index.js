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
    baseUrl: 'https://fast-lizard-17.localtunnel.me',
    // baseUrl: 'https://wise-otter-21.localtunnel.me',
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        StatusBar.hide();
        this.receivedEvent('deviceready');
        this.getTutorials();
        document.addEventListener("backbutton", function(e){
           if($.mobile.activePage.is('#index')){
               e.preventDefault();
               navigator.app.exitApp();
           }
           else {
               navigator.app.backHistory();
           }
        }, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
        document.addEventListener("offline", function(){ 
          console.log("Device offline")
          alert("Seems your internet is disconnected. Please check and try again") 
          navigator.app.exitApp();
        }, false);
    },

    getTutorials: function(){
      var that = this
      localStorage.setItem('baseUrl', this.baseUrl)
      cordovaHTTP.get(this.baseUrl+"/api/admin/tutorials", {},
        { Authorization: "" }, function(response) {
          console.log(response)
          if(response.status){
            var tutorials = response.data
            localStorage.tutorials = tutorials
            that.getCalculator()
          }
        }, function(response) {
          console.log(response);
      })
    },

    getCalculator: function(){
      var that = this
      cordovaHTTP.get(that.baseUrl+"/api/admin/calculators/details", {},
        { Authorization: "" }, function(response) {
          console.log(response)
          if(response.status){
            var calculators = response.data
            localStorage.calculators = calculators
            window.location.href = `subject_page.html`
          }
        }, function(response) {
          console.log(response);
      })
    },
};

app.initialize();
