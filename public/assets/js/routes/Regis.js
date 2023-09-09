import { Component } from "../core/core.js";

export default class Regis extends Component {

  constructor(){
    super()
  }

  render(){
      this.el.innerHTML = `
      <main class="regis-main">
      <div class="container regis-container">
        <p class="sub-tit">신규 등록</p>
        <ul class="sub-des">
          <li>✓ * 표시는 필수 입력사항입니다</li>
          <li>✓ 이미지 권장사이즈 500*500 입니다</li>
        </ul>
        <p class="form-tit">프로필 이미지 <span class="text-danger">*</span></p>
        <div>
          <input type="file" id="image" class="form-control" />
        </div>
        <p class="preview-wrap">
          <img src="" alt="" id="image-preview" />
        </p>
        <!-- 이미지는 db에 저장하지 않음. 용량 때문에 -->
        <p class="form-tit">성별<span class="text-danger">*</span></p>
        <div class="form-check-wrap">
          <div class="form-check">
            <input type="radio" class="form-check-input" id="male" name="gender" value="male" />
            <label class="form-check-label" for="male">남</label>
          </div>
          <div class="form-check">
            <input type="radio" class="form-check-input" id="female" name="gender" value="female" />
            <label class="form-check-label" for="female">여</label>
          </div>
        </div>
        <p class="form-tit">이름<span class="text-danger">*</span></p>
        <input type="text" class="form-control" id="name" placeholder="이름을 입력해주세요" />
        <p class="form-tit">나이<span class="text-danger">*</span></p>
        <input type="number" class="form-control" id="age" placeholder="나이를 입력해주세요" />
        <p class="form-tit">특이사항<span class="text-danger">*</span></p>
        <textarea name="significant" id="significant" class="form-control" cols="30" rows="10" placeholder="특이사항을 입력해주세요"></textarea>
        <p class="form-tit">진행상황<span class="text-danger">*</span></p>
        <select id="sort" class="form-control">
          <option value="">선택해주세요</option>
          <option value="상담중">상담중</option>
          <option value="종결">종결</option>
          <option value="치료중">치료중</option>
        </select>
        <div class="text-center">
          <button class="btn btn-danger" id="send-btn">등록</button>
        </div>
      </div>
    </main>
      `

      const sendBtn = this.el.querySelector('#send-btn');
      const storage = firebase.storage();
      let imageUrl = '';
      const auth = firebase.auth();
      const imageInput = this.el.querySelector('#image');
      const imagePreview = this.el.querySelector('#image-preview');
      const previewWrap = this.el.querySelector('.preview-wrap');

      previewWrap.style.display = 'none';
      // hideLoadingImage();

      // 이미지 미리보기
      imageInput.addEventListener('change', function (event) {
        previewWrap.style.display = 'block';

        const selectedImage = event.target.files[0];

        if (selectedImage) {
          const reader = new FileReader();

          reader.onload = function (e) {
            imagePreview.src = e.target.result;
          };

          reader.readAsDataURL(selectedImage);
        } else {
          imagePreview.src = '';
        }
      });

      // 프로필 새로 등록하기
      auth.onAuthStateChanged((user) => {
        if (user) {
          // 사용자가 로그인한 상태

          const displayName = user.displayName;

          // 상품 업로드 관련 로직 실행
          const sendData = function () {
            // 이미지 저장하기
            let file = document.querySelector('#image').files[0];
            let storageRef = storage.ref();
            let storageDir = storageRef.child('image/' + file.name);
            let storageUpload = storageDir.put(file);
            

            // 이미지 url 구하기
            storageUpload.on('state_changed', 
            console.log('이미지가 등록되었습니다'), // 로딩함수
            (error) => {
              console.error('실패사유는', error);
            } ,
            () => {
              storageUpload.snapshot.ref.getDownloadURL().then((url) => {
                imageUrl = url;
                // 입력한 값 등록하기
                let nameValue = document.getElementById('name').value;
                let ageValue = Number(document.getElementById('age').value);
                let sortValue = document.getElementById('sort').value;
                let maleRadio = document.getElementById('male');
                let femaleRadio = document.getElementById('female');
                let genderValue = '';
                let memoValue = document.getElementById('significant').value;

                if (maleRadio.checked) {
                  genderValue = '남';
                } else if (femaleRadio.checked) {
                  genderValue = '여';
                }

                db.collection('person')
                  .add({
                    name: nameValue,
                    gender: genderValue,
                    age: ageValue,
                    sort: sortValue,
                    image: imageUrl,
                    uid: JSON.parse(localStorage.getItem('user')).uid,
                    memo: memoValue,
                    currentUser: displayName,
                  })
                  .then((result) => {
                    alert('등록 완료되었습니다');
                    window.location.href = '/#';
                    // 성공 후에 실행할 코드
                    // hideLoadingImage();
                  })
                  .catch((err) => {
                    alert(err);
                    // 실패 후에 실행할 코드
                  });
              });
            }
            );
          };
          sendBtn.addEventListener('click', sendData);
        } else {
          // 사용자가 로그인하지 않은 상태
          // 로그인 페이지로 리다이렉트 또는 로그인을 유도하는 메시지 표시 등
          alert('로그인 후에 사용 가능합니다');
          window.location.href = '#/login';
        }
      });
  }
}
