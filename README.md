This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### yarn 실행 오류
▶해결 방법
1. 관리자 권한으로 PowerShell 실행.
2. 실행 정책을 확인하기 위해 'ExecutionPolicy' 명령어 실행.
3. 'Restricted'라고 표시되고 있으면, 현재 정책 때문에 위에 오류가 발생한 것을 알 수 있습니다.
4. 스크립트를 허용하기 위해 'Set-ExecutionPolicy Unrestricted' 명령어 실행.
5. 변경된 실행 정책을 확인하기 위해 'ExecutionPolicy' 명령어 실행
6. 'Unrestricted'라고 표시되면 스크립트가 허용되는 것을 알 수 있습니다.
7. 이전 스크립트로 테스트.

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

1.상태 관리

- redux: 상태 관리 https://jeonghwan-kim.github.io/dev/2019/07/15/react-redux-ts.html
- redux-Saga: 상태 흐름 정의 https://mskims.github.io/redux-saga-in-korean
- redux-persist: localStorege에 상태 저장 https://medium.com/humanscape-tech/redux-persist-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-2077c9e566d9
- deox: 상태 관리 아키텍처를 위한 유틸리티(reduce, action maker) https://www.npmjs.com/package/deox
