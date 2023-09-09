import { Component } from "../core/core.js";

export default class TheHeader extends Component {
  constructor(){
    super({
      tagName: 'header',
      state: {
        menus: [
          {
            name: 'Home',
            href: '#/'
          },
          {
            name: '로그인',
            href: '#/login'
          },
          {
            name: '등록하기',
            href: '#/regis'
          }
        ]
      }
    })

  }
  render(){
    this.el.innerHTML = /* html */`
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a href="${this.state.menus[0].href}" class="navbar-brand">
        <img src="/assets/image/logo2.png" alt="로고" />
        <span>내담자등록관리</span>
      </a>
      <span id="nickname" class="ms-auto mx-3">로그인 후 이용해주세요</span>
      <ul class="navbar-nav">
        <li class="nav-item">
          <button type="button" id="login" class="btn btn-danger" onClick="location.href='#/login'">로그인</button>
          <button type="button" id="logout-btn" class="btn btn-dark">로그아웃</button>
        </li>
      </ul>
    </div>
  </nav>
    `

  const login = this.el.querySelector('#login');
  const logoutBtn = this.el.querySelector('#logout-btn');
  let NickName = this.el.querySelector('#nickname');
  
  logoutBtn.style.display = 'none';
  
  // 로그아웃 함수
  logoutBtn.addEventListener('click', function () {
    firebase.auth().signOut();
    localStorage.removeItem('user');
    updateNickname();
    // alert가 뜨지 않음
    // alert('로그아웃 되었습니다');
    login.style.display = 'block';
    logoutBtn.style.display = 'none';
    
  });
  
  // 닉네임 업데이트 함수
  function updateNickname(user) {
    if (user && user.displayName) {
      NickName.textContent = user.displayName;
    } else {
      NickName.textContent = '로그인 후 이용해주세요'; // 기본 문구
    }
  }
  
  // 유저정보 확인
  if (localStorage.getItem('user')) {
    let user = JSON.parse(localStorage.getItem('user'));
    NickName.textContent = user.displayName;
  }
  
  // 사용자의 인증 상태가 변화가 생기면 동작함
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      updateNickname(user); // 인증 상태 변화 시 닉네임 업데이트
      login.style.display = 'none';
      logoutBtn.style.display = 'block';
    } else {
      login.style.display = 'block';
      logoutBtn.style.display = 'none';
    }
  });

  }
}