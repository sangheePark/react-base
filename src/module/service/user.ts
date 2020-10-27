import API from '@module/api'
import { MUser, MLogin } from '@model/user'
import { AxiosResponse } from 'axios'

const UserService = {
  login: (login: MLogin): Promise<MUser> => {
    return new Promise<MUser>(async (resolve, reject) => {
      try {
        //TODO 로그인 실연동 필요
        resolve({
          id: login.id,
          name: '홍길동'
        })
        // const response: AxiosResponse = await API.get('/user')
        // const user: MUser = response.data
        // resolve(user)
      } catch (error) {
        console.log('UserService.login' + JSON.stringify(error))
        reject(error)
      }
    })
  }
}

export default UserService
