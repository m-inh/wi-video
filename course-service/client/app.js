const BASE_URL = '';

const fetchCourses = () => {
  return axios.get(BASE_URL + '/api/courses');
}

const fetchCourse = (name) => {
  return axios.post(BASE_URL + '/api/courses/' + name);
}

const fetchVideos = () => {
  return axios.get(BASE_URL + '/api/videos');
}

Vue.component('course-item', {
  template: '<li>{{course.title}} <img v-if="course.done" width="12px" src="imgs/ic_verify.png"></img></li>',
  props: ['course']
})

Vue.component('video-item', {
  template: '<li>This is a video {{video.title}}, link: <a v-bind:href="video.url" _target="blank">Drive</a></li>',
  props: ['video']
})

new Vue({
  el: '#app',
  data: {
    errMessage: '',
    courseUrl: '',
    courses: [],
    videos: [{title: 'ok men', url: '#'}, {title: 'ok men 2', url: 'localhost:3000'}],
    isRequesting: false
  },
  created: function () {
    fetchCourses()
      .then(response => {
        this.courses = response.data;
      })
    // fetchVideos()
    //   .then(response => {
    //     this.videos = response.data;
    //   })
  },
  methods: {
  	crawlCourse: function() {
	    this.isRequesting = true;
      fetchCourse(this.courseUrl)
        .then(body => {
          if (body.data.success) {
            window.location = '/';
            this.errMessage = '';
          } else {
            throw new Error(body.data.message)
          }
        })
        .catch(err => {
          this.errMessage = err.message;
        })
        .then(() => {
          this.isRequesting = false;
        })
    }
  }
})
