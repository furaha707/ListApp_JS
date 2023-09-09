import { Component } from "../core/core.js";

export default class Login extends Component {

  constructor(){
    super()
  }

  render(){
    this.el.innerHTML = `
    <main>
    <div class="container login-container" id="sign-area">
      <p class="sub-tit">회원가입</p>
      <p>
        <input type="text" placeholder="성함을 입력해주세요" id="name-new" class="form-control" />
      </p>
      <p>
        <input type="email" placeholder="이메일주소 입력해주세요" id="email-new" class="form-control" />
      </p>
      <p>
        <input type="password" placeholder="비밀번호 입력해주세요" id="pw-new" class="form-control" />
      </p>
      <div class="text-center">
        <button type="submit" id="register" class="btn btn-danger">가입하기</button>
      </div>
    </div>

    <div class="container login-container" id="login-area">
      <p class="sub-tit">로그인</p>
      <p>
        <input type="email" placeholder="이메일주소 입력해주세요" id="email" class="form-control" />
      </p>
      <p>
        <input type="password" placeholder="비밀번호 입력해주세요" id="pw" class="form-control" />
      </p>
      <div class="text-center">
        <button type="button" id="login-btn" class="btn btn-primary">로그인</button>
        <p class="des">아직 회원이 아니신가요? <a href="javascript:void(0)" id="sign-btn">회원가입</a></p>
      </div>
    </div>
  </main>
    `

      // const login = firebase.auth().currentUser;
    const login = document.querySelector('#login')
    const loginBtn = this.el.querySelector('#login-btn');
    let NickName = document.querySelector('#nickname');
    // const logoutBtn = document.querySelector('#logout-btn');
    const regisBtn = this.el.querySelector('#register');
    const signBtn = this.el.querySelector('#sign-btn');
    
    // 헤더에 이용자의 닉네임 출력
    function updateNickname(user) {
      if (user && user.displayName) {
        NickName.textContent = user.displayName;
      } else {
        NickName.textContent = '로그인 후 이용해주세요'; // 기본 문구
      }
    }
    
    // 로그인
    loginBtn.addEventListener('click', function () {
      let email = document.getElementById('email').value;
      let password = document.getElementById('pw').value;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          updateNickname(result.user);
          login.style.display = 'none';
          // logoutBtn.style.display = 'block';
          window.location.href = '#/';
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/user-not-found') {
            // 아이디가 없는 경우
            alert('해당 아이디가 존재하지 않습니다.');
          } else if (errorCode === 'auth/wrong-password') {
            // 비밀번호가 틀린 경우
            alert('비밀번호가 올바르지 않습니다.');
          } else {
            // 기타 오류 처리
            console.error('오류 발생:', error);
          }
        });
    });
    
    // 회원가입
    regisBtn.addEventListener('click', function () {
      let email = document.getElementById('email-new').value;
      let password = document.getElementById('pw-new').value;
      let name = document.getElementById('name-new').value;
    
      // 로그인기능 소환
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              result.user.updateProfile({ displayName: name });
              alert('회원가입이 완료되었습니다');
              document.querySelector('#sign-area').style.display = 'none';
              document.querySelector('#login-area').style.display = 'block';
            })
            .catch((error) => {
              console.error('로그인 오류:', error);
            });
        })
    
        .catch((error) => {
          console.error('회원가입 오류:', error);
        });
    });
    
    // 회원가입 버튼 클릭 시, 회원가입 영역 숨기기
    signBtn.addEventListener('click', function () {
      document.querySelector('#sign-area').style.display = 'block';
      document.querySelector('#login-area').style.display = 'none';
    });

  }
}
