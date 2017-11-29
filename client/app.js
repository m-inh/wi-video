Vue.component('todo-item', {
  template: '<li>This is a todo</li>'
})

Vue.component('todo-item', {
  template: '<li>This is a todo</li>'
})

new Vue({
  el: '#app',
  data: {
    errMessage: '',
    courseUrl: '',
    isRequesting: false
  },
  methods: {
  	crawlCourse: function() {
	    this.isRequesting = true;
      fetchCourse(this.courseUrl)
        .then(body => {
          if (body.data.success) {
            // window.location = '/'
            this.errMessage = '';
            console.log('success');
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

const COUSE_API = 'http://localhost:3000';

const fetchCourse = (name) => {
  return axios.post(COUSE_API + '/api/courses/' + name);
}
