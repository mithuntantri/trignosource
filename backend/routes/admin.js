var express = require('express');
var shortid = require('shortid');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var hash = require('bcryptjs');
var otplib = require('otplib').default;
var jwt = require('jwt-simple');
require('../routes/passportJs')(passport);
var sqlQuery = require('../database/sqlWrapper');
var fs = require('fs');
var moment = require('moment')
let _ = require("underscore");
var sql_wrapper = require('../database/sqlWrapper');
var store = require('../store/store')
var multer  = require('multer')
var fs = require('fs');
var path = require('path');
var rethinkOps = require('../store/rethinkOps');
var thumbler = require('video-thumb');
var ffmpeg = require('fluent-ffmpeg');
var child_process = require('child_process')
const getDuration = require('get-video-duration');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let option = 'Videos'
    let dir = './uploads/'
    dir += option + "/"
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    let admin_id =  1;
    cb(null, admin_id + '_' + Date.now() + '.' + file.originalname.split('.').pop())
  }
})
var upload = multer({ storage: storage, limits: { fileSize: '150MB' } }).single('file')

router.get("/upload", function(req, res, next) {
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((videos)=>{
      resolve(videos)
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status' : false, 'message': err.message})
  })
})

router.put("/upload", function(req, res, next){
  var id = req.body.id
  new Promise(function(resolve, reject) {
    rethinkOps.getData('tutorials', id).then((videos)=>{
      console.log("videos", videos)
      videos.pause_durations = req.body.pause_durations
      videos.questions = req.body.questions
      rethinkOps.updateData('tutorials', videos).then(()=>{
          resolve()
      })
    })
  }).then((response)=>{
    res.json({'status': true, 'message': 'Video updated successfully'})
  }).catch((err)=>{
    res.json({'status' : false, 'message': err.message})
  })
})

router.delete('/upload', function(req, res, next){
  let id = req.query.id
  new Promise(function(resolve, reject) {
    rethinkOps.deleteData('tutorials', id).then(()=>{
      resolve()
    })
  }).then((response)=>{
    res.json({'status': true, 'message': 'Video deleted successfully'})
  }).catch((err)=>{
    res.json({'status' : false, 'message': err.message})
  })
})

router.post("/upload", function(req, res, next) {
  var subject_number = parseInt(req.query.subject_number)
  var chapter_number = parseInt(req.query.chapter_number)
  var video_name = req.query.video_name
  var video_number = parseInt(req.query.video_number)
  var thumbnail_time = req.query.thumbnail_time
  var thumbnail_url = moment().unix() + '.png'
  new Promise((resolve, reject)=>{
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      upload(req,res,function(err){
        var relative_path = path.join(__dirname, '../uploads/Videos', req.file.filename)
        getDuration(relative_path).then((duration) => {
          console.log("duration",duration);
          let up_tutorial = null
          _.each(tutorials, (tutorial)=>{
            if(tutorial.subject_number == subject_number){
              _.each(tutorial.chapters, (chapter)=>{
                if(chapter.chapter_number == chapter_number){
                    let file_name = req.file.filename
                    if(err){
                      reject(err)
                    }else{
                      var new_upload_statement = {
                        'video_number' : video_number,
                        'video_name' : video_name,
                        'interactions': 0,
                        'created_at' : moment().unix(),
                        'updated_at' : moment().unix(),
                        'file_name' : file_name,
                        'thumbnail_time' : thumbnail_time,
                        'thumbnail_url': thumbnail_url,
                        'duration' : duration,
                        'questions' : []
                      }
                      chapter.videos.push(new_upload_statement)
                    }
                }
              })
              up_tutorial = tutorial
            }
          })
          if(up_tutorial){
            rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
              resolve({
                'tutorials': tutorials,
                'file_name': req.file.filename,
                'thumbnail_url' : thumbnail_url,
                'thumbnail_time': thumbnail_time
              })
            })
          }else{
            resolve({
              'tutorials': tutorials,
              'file_name': req.file.filename,
              'thumbnail_url' : thumbnail_url,
              'thumbnail_time': thumbnail_time
            })
          }
        })
      })
    })
  }).then((data)=>{
    let folder_name = 'Videos'
    var relative_path = "file://" + path.resolve("./uploads/" + folder_name) + '/' + data.file_name
    var pathToFile = path.join(__dirname, '../uploads/Videos', data.file_name),
        pathToSnapshot = path.join(__dirname, '../uploads/Thumbnails', data.thumbnail_url);
    console.log(pathToFile, pathToSnapshot)
    child_process.exec(('ffmpeg -ss ' + data.thumbnail_time + ' -i ' + pathToFile + ' -vframes 1 -q:v 2 ' + pathToSnapshot), function (err, stdout, stderr) {
      if (err) {
         console.error(err);
         return;
       }
       console.log(stdout);
      console.log('Saved the thumb to:', pathToSnapshot);
    });
    res.json({'status': true, 'message' : 'Video uploaded successfully', 'data': data.tutorials})
    console.log('snapshot saved to '+thumbnail_url+' (100x100) with a frame at'+thumbnail_time);
  }).catch((err)=>{
    res.json({'status': false, 'message' : 'Video upload failed'})
  })
})

router.post('/login', function (req,res,next) {
  let data = req.body
  new Promise(function(resolve, reject) {
    let valid = false
    _.each(store.credentials, (credentials)=>{
      if(credentials.username == data.username && credentials.password == data.password){
        valid = true
        data = credentials
      }
    })
    if(!valid){
      let response = {
        message : 'Invalid credentials'
      }
      reject(response)
    }else{
      var encodeDetails = {};
      encodeDetails['username'] = data.username;
      encodeDetails['admin_id'] = data.admin_id;
      encodeDetails['exp'] = moment().add(180, 'm').valueOf()
      encodeDetails['name'] = data.name;
      var token = jwt.encode(encodeDetails, 'eg[isfd-8axcewfgi43209=1dmnbvcrt67890-[;lkjhyt5432qi24');
      let response = {
        message : "Login Successful",
        token : token
      }
      resolve(response)
    }
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err.message})
  })
})

router.post('/logout', function (req,res,next) {
  res.json({'status': true})
})

router.get('/tutorials', function(req, res, next){
  new Promise(function(resolve, reject) {
      rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
        console.log("Current tutorials >>>>>>")
        console.log(tutorials)
        console.log("<<<<<<")
        tutorials = _.sortBy(tutorials, 'subject_number')
        resolve(tutorials)
      }).catch((err)=>{
        console.log(err)
      })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.put('/tutorials', function(req, res, next){
  var old_subject_number = parseInt(req.body.old_subject_number)
  var subject_number = parseInt(req.body.subject_number)
  var subject_name = req.body.subject_name
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == old_subject_number){
          tutorial.subject_number = subject_number
          tutorial.subject_name = subject_name
          tutorial.updated_at = moment().unix()
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  });
})

router.delete('/tutorials', function(req, res, next){
  var subject_number = parseInt(req.query.subject_number)
  console.log(req.body)
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let id = null
      _.each(tutorials, (tutorial)=>{
        console.log(tutorial.subject_number, subject_number)
        if(tutorial.subject_number == subject_number){
          id = tutorial.id
        }
      })
      console.log("DELETE ID", id)
      if(id){
        console.log("Updated tutorials after delete")
        rethinkOps.deleteData('tutorials', id).then(()=>{
          console.log("========Deleted from RETHINKDB=========")
          resolve(_.filter(tutorials, (tutorial)=>{
            return tutorial.id != id
          }))
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.post('/tutorials', function(req, res, next){
  var subject_name = req.body.subject_name
  var subject_number = parseInt(req.body.subject_number)
  new Promise(function(resolve, reject) {
      rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
        console.log("Current tutorials >>>>>>")
        console.log(tutorials)
        console.log("<<<<<<")
        var tutorial = {
          'created_at' : moment().unix(),
          'updated_at' : moment().unix(),
          'created_by' : 'mithun',
          'subject_name' : subject_name,
          'subject_number' : subject_number,
          'chapters' : []
        }
        tutorials.push(tutorial)
        console.log("Updated tutorials>>>>")
        console.log(tutorials)
        rethinkOps.insertData('tutorials', tutorial).then(()=>{
          console.log("===========Inserted RETHINKDB==========")
          resolve(tutorials)
        })
      })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.put('/chapters', function(req, res, next){
  var old_chapter_number = parseInt(req.body.old_chapter_number)
  var chapter_number = parseInt(req.body.chapter_number)
  var chapter_name = req.body.chapter_name
  var subject_number = parseInt(req.body.subjext_number)
  var is_module = req.body.is_module
  var mop_name = req.body.mop_name
  var mop_number = parseInt(req.body.mop_number)
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          _.each(tutorial.chapters, (chapter)=>{
            if(chapter.chapter_number == old_chapter_number){
              chapter.chapter_number = chapter_number
              chapter.chapter_name = chapter_name
              chapter.is_module = is_module
              chapter.mop_number = mop_number
              chapter.mop_name = mop_name
              chapter.updated_at = moment().unix()
            }
          })
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.get('/chapters', function(req, res, next){
  var subject_number = parseInt(req.body.subjext_number)
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_chapters = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          up_chapters = tutorial.chapters
        }
      })
      resolve(up_chapters)
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.delete('/videos', function(req, res, next){
  var chapter_number = parseInt(req.query.chapter_number)
  var subject_number = parseInt(req.query.subject_number)
  var video_number = parseInt(req.query.video_number)
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          _.each(tutorial.chapters, (chapter)=>{
            if(chapter.chapter_number == chapter_number){
              chapter.updated_at = moment().unix()
              chapter.videos = _.filter(chapter.videos, (video)=>{
                return video.video_number != video_number
              })
            }
          })
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.delete('/chapters', function(req, res, next){
  var chapter_number = parseInt(req.query.chapter_number)
  var subject_number = parseInt(req.query.subject_number)
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          tutorial.chapters = _.filter(tutorial.chapters, (chapter)=>{
            return chapter.chapter_number != chapter_number
          })
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.post('/chapters', function(req, res, next){
  var subject_number = parseInt(req.body.subject_number)
  var chapter = {
    'chapter_number': parseInt(req.body.chapter_number),
    'chapter_name' : req.body.chapter_name,
   'is_module' : req.body.is_module,
  'mop_name' : req.body.mop_name,
  'mop_number' : parseInt(req.body.mop_number)
  }
  console.log(subject_number, chapter)
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          chapter.updated_at = moment().unix()
          chapter.created_at = moment().unix()
          chapter.videos = []
          tutorial.chapters.push(chapter)
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.post('/questions', function(req, res, next){
  var subject_number = parseInt(req.body.subject_number)
  var chapter_number = parseInt(req.body.chapter_number)
  var video_number = parseInt(req.body.video_number)
  var question = {
    'question_number': parseInt(req.body.question_number),
    'question_name': req.body.question_name,
    'time_of_pause': req.body.time_of_pause,
    'appear_time' : req.body.appear_time
  }
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          _.each(tutorial.chapters, (chapter)=>{
            if(chapter.chapter_number == chapter_number){
              chapter.updated_at = moment().unix()
              _.each(chapter.videos, (video)=>{
                if(video.video_number == video_number){
                  video.updated_at = moment().unix()
                  question.created_at = moment().unix()
                  question.updated_at = moment().unix()
                  question.options = []
                  video.questions.push(question)
                }
              })
            }
          })
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.delete('/questions', function(req, res, next){
  var subject_number = parseInt(req.query.subject_number)
  var chapter_number = parseInt(req.query.chapter_number)
  var video_number = parseInt(req.query.video_number)
  var question_number = parseInt(req.query.question_number)

  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          _.each(tutorial.chapters, (chapter)=>{
            if(chapter.chapter_number == chapter_number){
              chapter.updated_at = moment().unix()
              _.each(chapter.videos, (video)=>{
                if(video.video_number == video_number){
                  video.updated_at = moment().unix()
                  video.questions = _.filter(video.questions, (question)=>{
                    return question.question_number != question_number
                  })
                }
              })
            }
          })
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.post('/options', function(req, res, next){
  var subject_number = parseInt(req.body.subject_number)
  var chapter_number = parseInt(req.body.chapter_number)
  var video_number = parseInt(req.body.video_number)
  var question_number = parseInt(req.body.question_number)
  var option = {
    'option_number': parseInt(req.body.option_number),
    'option_name': req.body.option_name,
    'skip_time': parseFloat(req.body.skip_time),
    'is_correct': (req.body.is_correct=='true'?true:false)
  }
  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          _.each(tutorial.chapters, (chapter)=>{
            if(chapter.chapter_number == chapter_number){
              chapter.updated_at = moment().unix()
              _.each(chapter.videos, (video)=>{
                if(video.video_number == video_number){
                  video.updated_at = moment().unix()
                  _.each(video.questions, (question)=>{
                    if(question.question_number == question_number){
                      question.updated_at = moment().unix()
                      option.created_at = moment().unix()
                      option.updated_at = moment().unix()
                      question.options.push(option)
                    }
                  })
                }
              })
            }
          })
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

router.delete('/options', function(req, res, next){
  var subject_number = parseInt(req.query.subject_number)
  var chapter_number = parseInt(req.query.chapter_number)
  var video_number = parseInt(req.query.video_number)
  var question_number = parseInt(req.query.question_number)
  var option_number = parseInt(req.query.option_number)

  new Promise(function(resolve, reject) {
    rethinkOps.getAllSpecificData('tutorials').then((tutorials)=>{
      let up_tutorial = null
      _.each(tutorials, (tutorial)=>{
        if(tutorial.subject_number == subject_number){
          tutorial.updated_at = moment().unix()
          _.each(tutorial.chapters, (chapter)=>{
            if(chapter.chapter_number == chapter_number){
              chapter.updated_at = moment().unix()
              _.each(chapter.videos, (video)=>{
                if(video.video_number == video_number){
                  video.updated_at = moment().unix()
                  _.each(video.questions, (question)=>{
                    if(question.question_number == question_number){
                      question.updated_at = moment().unix()
                      question.options = _.filter(question.options, (option)=>{
                        return option.option_number != option_number
                      })
                    }
                  })
                }
              })
            }
          })
          up_tutorial = tutorial
        }
      })
      if(up_tutorial){
        rethinkOps.updateData('tutorials', up_tutorial).then(()=>{
          resolve(tutorials)
        })
      }else{
        resolve(tutorials)
      }
    })
  }).then((response)=>{
    res.json({'status': true, 'data': response})
  }).catch((err)=>{
    res.json({'status': false, 'message': err})
  })
})

module.exports = router;
