import { Component } from "../core/core.js";
import profileStore from "../store/store.js"
import { getData } from "../store/store.js";

export default class ProfileDetail extends Component {

  constructor() {
    super();
  }

  async render(){
    const { members } = profileStore.state
    let detailView = '';
    const auth = firebase.auth();
    const currentURL = window.location.href;
    // URL에서 ?id= 뒤에 있는 값 가져오기
    let personId = new URLSearchParams(currentURL.split('?')[1]);
    const {urlId} = await getData();
    const dataIndex = urlId.findIndex(item => item === personId.get('id'));
    
    if (dataIndex === -1) {
      console.error('해당 ID 의 데이터를 찾을 수 없습니다')
      return;
    }
    
    const personData = members[dataIndex];

    this.el.innerHTML = /* html */`
    <main>
      <div class="container" id="detail-wrap">
      <div class="detail-inner">
          <h5 class="image"><img src="${personData.image}"></h5>
          <hr />
          <p class="lists">담당 상담사 : ${personData.currentUser}</p>
          <p class="lists">이름 : ${personData.name}</p>
          <p class="lists">성별 : ${personData.gender}</p>
          <p class="lists">나이 : ${personData.age}</p>
          <p class="lists">진행상황 : ${personData.sort}</p>
          <p class="lists">특이사항 : ${personData.memo}</p>
        </div>
      </div>
      <div class="text-center">
        <button class="btn btn-light" onclick="location.href='/'">목록으로</button>
        <button class="btn btn-primary" id="update-btn">수정</button>
        <button class="btn btn-danger" id="complete-btn">저장</button>
      </div>
    </main>
    `
    
    let updateBtn = this.el.querySelector('#update-btn');
    let completeBtn = this.el.querySelector('#complete-btn');
    completeBtn.style.display = 'none';
  
    // hideLoadingImage();
    // showLoadingImage();


// 프로필 정보 수정하기
    auth.onAuthStateChanged((user) => {

      let detailWrap = this.el.querySelector('#detail-wrap');
      let updateBtn = this.el.querySelector('#update-btn');

      updateBtn.addEventListener('click', function () {
      const currentUser = auth.currentUser;
      if(!user){
        alert('로그인 후에 사용 가능합니다');
        window.location.href = '#/login';
        return;
      } else {
      
          if (user.uid == 'jusBruEPBGcrT4YlxuBR3wuquYo2' || personData.uid == currentUser.uid){
            // 성별 값 가져오기
            const genderValue = personData.gender;
            let femaleChecked = 'checked';
            let maleChecked = 'checked';

            // 성별 라디오 버튼 체크하기
            if (genderValue === '남') {
              maleChecked = 'checked';
              femaleChecked = '';
            } else if (genderValue === '여') {
              maleChecked = '';
              femaleChecked = 'checked';
            }

            // 종류 값 가져오기
            const sortValue = personData.sort;
            let selected1 = '';
            let selected2 = '';
            let selected3 = '';

            if (sortValue === '상담중') {
              selected1 = 'selected';
            } else if (sortValue === '종결') {
              selected2 = 'selected';
            } else if (sortValue === '치료중') {
              selected3 = 'selected';
            }

            detailView = `

              <div class="detail-inner">
                <h5 class="image">
                  <input type="file" id="image" />
                  <p class="preview-wrap">
                    <img src="${personData.image}" id="image-preview">
                  </p>
                </h5>
              <hr />

              <p class="lists"><input type="text" class="form-control" id="name" placeholder="이름" value="${personData.name}" /></p>

              <p class="lists">
              <div class="form-check">
                <input type="radio" class="form-check-input" id="male" name="gender" value="male" ${maleChecked} />
                <label class="form-check-label" for="male">남</label>
              </div>
              <div class="form-check">
                <input type="radio" class="form-check-input" id="female" name="gender" value="female" ${femaleChecked} />
                <label class="form-check-label" for="female">여</label>
              </div>
            </p>

              <p class="lists"><input type="text" class="form-control" id="age" placeholder="나이" value="${personData.age}" /></p>

              <p class="lists">
              <select id="sort" class="form-control">
              <option value="">진행상황</option>
              <option value="상담중" ${selected1}>상담중</option>
              <option value="종결" ${selected2}>종결</option>
              <option value="치료중" ${selected3}>치료중</option>
              </select>
            </p>

              <p class="lists">
                <textarea name="significant" id="memo" class="form-control" cols="10" rows="10" value="${personData.memo}">${personData.memo}</textarea>
              </p>
            </div>
              `;
      

            detailWrap.innerHTML = detailView;
            completeBtn.style.display = 'inline-block';
            updateBtn.style.display = 'none';

            const imageInput = document.querySelector('#image');
            const imagePreview = document.querySelector('#image-preview');

            imageInput.addEventListener('change', async (event) => {
              const selectedImage = event.target.files[0];
            
              if (!selectedImage) {
                imagePreview.src = '';
                return;
              }
              // firebase에 이미지 등록하고 url 가져오는 함수 후에 
              // data 업데이트 하는 함수로 인자를 전달
              try {
                console.log('여기 실행1')
                const imageUrl = await uploadImage(selectedImage);
                imagePreview.src = imageUrl;
                await updateFirestoreImage(imageUrl);
              } catch (error) {
                console.error('Error:', error);
              }

              // firebase에 등록
              async function uploadImage(imageFile) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child('image/' + imageFile.name);
              
                try {
                  console.log('여기 실행2')
                  await imageRef.put(imageFile);
                  const imageUrl = await imageRef.getDownloadURL();
                  return imageUrl;
                } catch (error) {
                  throw new Error('Error uploading image: ' + error.message);
                }
              }
              
              // 현재 이미지 url을 포함하도록 data 업데이트
              async function updateFirestoreImage(imageUrl) {
                const newData = {
                  image: imageUrl,
                  // ... 기타 필드 데이터 ...
                };
              
                try {
                  console.log('여기 실행3')
                  await db.collection('person').doc(personId.get('id')).update(newData);
                } catch (error) {
                  throw new Error('Error updating Firestore: ' + error.message);
                }
              }
            });
          } else{
            alert('작성자만 수정 가능합니다');
            return;
          }

      } 
    });

    });






    // 수정 완료하기
    completeBtn.addEventListener('click', async () => {
      try {
        let newNameValue = document.getElementById('name').value;
        let newAgeValue = document.getElementById('age').value;
        let newSortValue = document.getElementById('sort').value;
        let newMemoValue = document.getElementById('memo').value;
        let maleRadio = document.getElementById('male');
        let femaleRadio = document.getElementById('female');
    
        const existData = personData;
        let newGenderValue = '';
    
        if (maleRadio.checked) {
          newGenderValue = '남';
        } else if (femaleRadio.checked) {
          newGenderValue = '여';
        }
    
        const updatedData = {
          ...existData,
          image: document.getElementById('image-preview').src,
          name: newNameValue,
          gender: newGenderValue,
          age: newAgeValue,
          sort: newSortValue,
          memo: newMemoValue,
        };
        console.log('저장');
        await db.collection('person').doc(personId.get('id')).update(updatedData);
        console.log(personData)
        console.log(updatedData)

        detailView = `
          <div class="detail-inner">
            <h5 class="image"><img src="${updatedData.image}"></h5>
            <hr />
            <p class="lists">담당 상담사 : ${updatedData.currentUser}</p>
            <p class="lists">이름 : ${updatedData.name}</p>
            <p class="lists">성별 : ${updatedData.gender}</p>
            <p class="lists">나이 : ${updatedData.age}</p>
            <p class="lists">진행상황 : ${updatedData.sort}</p>
            <p class="lists">특이사항 : ${updatedData.memo}</p>
          </div>
        `;
        let detailWrap = this.el.querySelector('#detail-wrap');
        detailWrap.innerHTML = detailView;
        completeBtn.style.display = 'none';
        updateBtn.style.display = 'inline-block';
      } catch (error) {
        console.error('Error updating data:', error);
      }
    });
    
  };
      
}





