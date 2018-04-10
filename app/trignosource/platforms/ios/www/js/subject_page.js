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
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        var tutorials = localStorage.getItem('tutorials')
        tutorials = JSON.parse(tutorials).data
        console.log('tutorials', tutorials)

        localStorage.removeItem('currentSubject')
    },

    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
        
        var subject1 = document.getElementById('subject_1');
        subject1.addEventListener('click', function(){
            localStorage.currentSubject = 0;
            window.location = 'chapters_page.html'
        }, false);

        var subject2 = document.getElementById('subject_2');
        subject2.addEventListener('click', function(){
            localStorage.currentSubject = 1;
            window.location = 'chapters_page.html'
        }, false);

        var subject3 = document.getElementById('subject_3');
        subject3.addEventListener('click', function(){
            localStorage.currentSubject = 2;
            window.location = 'chapters_page.html'
        }, false);

        var subject4 = document.getElementById('subject_4');
        subject4.addEventListener('click', function(){
            localStorage.currentSubject = 3;
            window.location = 'chapters_page.html'
        }, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();
