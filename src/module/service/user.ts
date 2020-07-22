import API from '@module/api'
import { MUser, MLogin } from '@model/user'
import { AxiosResponse } from 'axios'

const UserService = {
  login: (login: MLogin): Promise<MUser> => {
    return new Promise<MUser>(async (resolve, reject) => {
      try {
        const response: AxiosResponse = await API.get('/user')
        const user: MUser = response.data
        resolve(user)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default UserService
