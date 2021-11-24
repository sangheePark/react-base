import axios from 'axios'

const API = axios.create({
	baseURL: 'https://api.example.com',
})

API.defaults.timeout = 2500
API.defaults.headers.common['Authorization'] = ''
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 요청 인터셉터 추가
API.interceptors.request.use(
	(config: any) => {
		// 요청을 보내기 전에 수행할 일

		// ...
		return config
	},
	(error: any) => {
		// 오류 요청을 보내기전 수행할 일
		// ...
		return Promise.reject(error)
	},
)

// 응답 인터셉터 추가
API.interceptors.response.use(
	(response: any) => {
		// 응답 데이터를 가공
		// ...
		return response
	},
	(error: any) => {
		// 오류 응답을 처리
		// ...
		return Promise.reject(error)
	},
)

export default API
