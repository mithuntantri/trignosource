class Videos{
  constructor($http, $timeout, Toast){
    this.$http = $http
    this.$timeout = $timeout
    this.Toast = Toast
    this.validFormats = ['pdf', 'xls', 'xlsx', 'zip', 'rar',
    'gz', 'txt', 'rtf', 'jpg', 'jpeg', 'png', 'gif', 'bmp',
    'html', 'tiff', 'tar.gz', 'gzip', 'docx', 'doc', 'mp4', 'm4v'];
    this.video_name = null
    this.all_videos = []
    this.all_tutorials = []
    this.getAllTutorials()
    this.getAllVideos()
    this.FileMessage = null
    this.durationError = null
    this.create_tutorial = {
      'subject_number' : null,
      'subject_name' : null
    }

    this.create_chapter = {
      'chapter_number' : null,
      'subject_number' : null,
      'chapter_name' : null
    }

    this.create_video = {
      'chapter_number' : null,
      'subject_number' : null,
      'video_name' : null,
      'video_number' : null,
      'thumbnail_time' : null,
      'is_module' : 'module',
      'mop_name' : null,
      'mop_number' : null
    }

    this.create_question = {
      'chapter_number' : null,
      'subject_number' : null,
      'video_number' : null,
      'question_number' : null,
      'question_name' : null,
      'time_of_pause' : null,
      'appear_time' : null
    }

    this.create_option = {
      'chapter_number' : null,
      'subject_number' : null,
      'video_number' : null,
      'question_number' : null,
      'option_number' : null,
      'option_name' : null,
      'skip_time' : null
    }
  }

  getAllTutorials(){
    this.$http({
      url: '/api/admin/tutorials',
      method: "GET"
    }).then((response)=>{
      if(response.data.status){
        this.all_tutorials = response.data.data
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  createTutorial(){
    return this.$http({
      url: '/api/admin/tutorials',
      method: "POST",
      data: this.create_tutorial
    })
  }

  createChapter(){
    return this.$http({
      url: '/api/admin/chapters',
      method: "POST",
      data: this.create_chapter
    })
  }

  createQuestion(){
    return this.$http({
      url: '/api/admin/questions',
      method: "POST",
      data: this.create_question
    })
  }

  createOption(){
    return this.$http({
      url: '/api/admin/options',
      method: "POST",
      data: this.create_option
    })
  }

  deleteTutorial(index){
    return this.$http({
      url: `/api/admin/tutorials?subject_number=${this.all_tutorials[index].subject_number}`,
      method: 'DELETE',
    })
  }

  deleteVideo(index1, index2, index3){
    let url = `/api/admin/videos?subject_number=${this.all_tutorials[index1].subject_number}`
    url += `&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`
    url += `&video_number=${this.all_tutorials[index1].chapters[index2].videos[index3].video_number}`
    return this.$http({
      url: url,
      method: 'DELETE',
    })
  }

  deleteQuestion(index1, index2, index3, index4){
    let url = `/api/admin/questions?subject_number=${this.all_tutorials[index1].subject_number}`
    url += `&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`
    url += `&video_number=${this.all_tutorials[index1].chapters[index2].videos[index3].video_number}`
    url += `&question_number=${this.all_tutorials[index1].chapters[index2].videos[index3].questions[index4].question_number}`
    return this.$http({
      url: url,
      method: 'DELETE',
    })
  }

  deleteOption(index1, index2, index3, index4, index5){
    let url = `/api/admin/options?subject_number=${this.all_tutorials[index1].subject_number}`
    url += `&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`
    url += `&video_number=${this.all_tutorials[index1].chapters[index2].videos[index3].video_number}`
    url += `&question_number=${this.all_tutorials[index1].chapters[index2].videos[index3].questions[index4].question_number}`
    url += `&option_number=${this.all_tutorials[index1].chapters[index2].videos[index3].questions[index4].options[index5].option_number}`
    return this.$http({
      url: url,
      method: 'DELETE',
    })
  }

  deleteChapter(index1, index2){
    return this.$http({
      url: `/api/admin/chapters?subject_number=${this.all_tutorials[index1].subject_number}&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`,
      method: 'DELETE',
    })
  }

  getAllVideos(){
    this.$http({
      url: '/api/admin/upload',
      method: "GET"
    }).then((response)=>{
      if(response.data.status){
        this.all_videos = response.data.data
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  validateVideoName(){
    if(this.create_video.video_name &&
      this.create_video.video_number &&
      this.create_video.thumbnail_time &&
      this.create_video.is_module &&
      this.create_video.mop_name &&
      this.create_video.mop_number) {
      this.FileMessage = null
      this.enableUpload = this.checkThumbnailTime()
    }else{
      // this.Toast.showError(`Please fill in proper details`)
      this.enableUpload = false
    }
  }

  addDuration(){
    this.edit_video.pause_durations.push("00:00:00")
    this.edit_video.questions.push({'appear_time': '00:00:00', 'question_text': '', 'options':[]})
    this.checkDuration()
  }

  addOptions(index){
    this.edit_video.questions[index].options.push({'skip_time': '00:00:00', 'text': ''})
    console.log(this.edit_video)
    this.checkDuration()
  }

  removeOptions(index1, index2){
    console.log(index1, index2)
    this.edit_video.questions[index1].options.splice(index2, 1)
    this.checkDuration()
  }

  removeDuration(index){
    this.edit_video.pause_durations.splice(index, 1)
    this.edit_video.questions.splice(index, 1)
    this.checkDuration()
  }

  checkThumbnailTime(){
    var m = this.create_video.thumbnail_time.split(":")
    console.log(m , m.length)
    if(m.length != 3){
      // this.Toast.showError(`Thumbnail Time should be of the format HH:MM:SS`)
      return false
    }else{
      return true
    }
  }

  checkDuration(){
    this.durationError = null
    _.each(this.edit_video.pause_durations, (duration)=>{
        console.log(duration)
        var m = duration.split(":")
        console.log(m , m.length)
        if(m.length != 3){
          this.durationError = `Duration should be of the format HH:MM:SS`
        }
    })
    _.each(this.edit_video.questions, (question)=>{
      var m = question.appear_time.split(":")
      if(m.length != 3){
        this.durationError = `Appear Time should be of the format HH:MM:SS`
      }else{
        _.each(question.options, (option)=>{
          var m = option.skip_time.split(":")
          if(m.length != 3){
            this.durationError = `Stop Time should be of the format HH:MM:SS`
          }
        })
      }
    })
  }

  editUpload(index){
    this.edit_video = this.all_videos[index]
    $('#editVideos').modal('show')
  }

  editUploadSubmit(){
    this.$http({
      url: '/api/admin/upload',
      method: 'PUT',
      data: this.edit_video
    }).then((response)=>{
      if(response.data.status){
        this.Toast.showSuccess(response.data.message)
        this.getAllVideos()
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  deleteUpload(index){
    let id = this.all_videos[index].id
    this.$http({
      url: `/api/admin/upload?id=${id}`,
      method: "DELETE"
    }).then((response)=>{
      if(response.data.status){
        this.Toast.showSuccess(response.data.message)
        this.getAllVideos()
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  uploadFileVideo(element){
    this.temp_element = element
    console.log(this.temp_element)
    this.validateVideoName()
  }

  uploadSubmit(){
    this.uploadFile(this.temp_element)
  }

  uploadFile(element){
    this.validateVideoName()
    if(this.enableUpload){
      this.$timeout(()=>{
        this.enableUpload = false
        this.theFile = element.files[0];
        this.FileMessage = null;
        var filename = this.theFile.name;
        var ext = filename.split(".").pop()
        var is_valid = this.validFormats.indexOf(ext) !== -1;
        var is_one = element.files.length == 1
        var is_valid_filename = this.theFile.name.length <= 64
        if (is_valid && is_one && is_valid_filename){
          var data = new FormData();
          data.append('file', this.theFile);
          var is_module = (this.create_video.is_module == 'module'?true:false)
          let url = `/api/admin/upload?video_name=${this.create_video.video_name}`
          url += `&subject_number=${this.create_video.subject_number}`
          url += `&chapter_number=${this.create_video.chapter_number}`
          url += `&video_number=${this.create_video.video_number}`
          url += `&thumbnail_time=${this.create_video.thumbnail_time}`
          url += `&is_module=${is_module}`
          url += `&mop_name=${this.create_video.mop_name}`
          url += `&mop_number=${this.create_video.mop_number}`
          this.$http({
            url: url,
            method: 'POST',
            headers: {'Content-Type': undefined},
            data: data
          }).then((response)=>{
            if(response.data.status){
              this.all_tutorials = response.data.data
              this.create_video.video_name = null
              this.create_video.video_number = null
              this.create_video.thumbnail_time = null
              this.create_video.mop_name = null
              this.create_video.mop_number = null
              this.create_video.is_module = 'module'
              this.enableUpload = false
              this.Toast.showSuccess(`Video created successfully`)
            }else{
              this.Toast.showError(`Something went wrong! Please try again`)
            }
          }).catch(()=>{
            this.Toast.showError(`Something went wrong while uploading`)
          })
          angular.element("input[type='file']").val(null);
        } else if(!is_valid){
          this.theFile = ''
          angular.element("input[type='file']").val(null);
          this.FileMessage = 'Please upload correct File Name, File extension is not supported';
        } else if(!is_one){
          this.theFile = ''
          angular.element("input[type='file']").val(null);
          this.FileMessage = 'Cannot upload more than one file at a time';
        } else if(!is_valid_filename){
          this.theFile = ''
          angular.element("input[type='file']").val(null);
          this.FileMessage = 'Filename cannot exceed 64 Characters';
        }
      })
    }else{
      this.Toast.showError(`Please fill in proper details`)
    }

  }
}
Videos.$inject = ['$http', '$timeout', 'Toast']
angular.module('trignosourceApp').service('Videos', Videos)
