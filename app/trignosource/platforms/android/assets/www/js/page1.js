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
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        var tutorials = localStorage.getItem('tutorials')
        tutorials = JSON.parse(tutorials).data
        console.log('tutorials', tutorials)

        document.getElementById('subject_name').innerHTML = tutorials[0].subject_name.toUpperCase()
        document.getElementById('chapter_name').innerHTML = tutorials[0].chapters[0].chapter_name
        document.getElementById('chapter_number').innerHTML = 'CHAPTER ' + tutorials[0].chapters[0].chapter_number
        document.getElementById('videos_count').innerHTML = tutorials[0].chapters[0].videos.length

        var videos_card = document.getElementById('videos-card');
        videos_card.addEventListener('click', this.gotoVideos, false);
    },

    onDeviceReady: function() {
        StatusBar.backgroundColorByHexString('#003256');
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    gotoVideos: function(){
      console.log('gotoVideos')
      window.location = 'page2.html'
    }
};

app.initialize();
