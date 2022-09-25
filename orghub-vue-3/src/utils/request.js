import axios from 'axios';
import {ElMessageBox, ElMessage} from 'element-plus';
import store from '@/store';
import {getToken} from '@/utils/auth';
import {CODE_OK} from '@/config';

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 5000
});

// request interceptor
service.interceptors.request.use(
    config=> {
    // do something before request is sent

        if (store.getters.token) {
            // ['X-Token'] is a custom headers key
         //   config.headers['Authorization'] = 'Bearer ' + getToken();
            config.headers['Authorization'] = getToken();
         //   config.headers['Authorization'] ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOmZhbHNlLCJyb2xlSWRzIjpbIjEiXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjozLCJpYXQiOjE2NDMyNDY1MDQsImV4cCI6MTY0MzI1MzcwNH0.bn0OXgjIA8Vkc1GJKeEiMlE_fHx5IzuJYr6k9L8-8LQ';

        }
        return config;
    },
    error=> {
    // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(

    response=> {
        const res = response.data;

        if (res.code !== 1000) {
            ElMessage({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 100
            });

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 401 || res.code === 4002 || res.code === 50014) {
                // to re-login
                ElMessageBox.confirm(res.message || 'Error', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(()=> {
                    store.dispatch('user/resetToken').then(()=> {
                        location.reload();
                    });
                });
            }
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res;
        }
    },
    error=> {
        console.error('err' + error); // for debug
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 100
        });
        return Promise.reject(error);
    }
);

export default service;
