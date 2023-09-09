import { Component } from "../core/core.js";

const counselingTypes = {
  상담중: { className: 'btn-primary' },
  치료중: { className: 'btn-danger' },
  종결: { className: 'btn-warning' }
};

export default class SearchItem extends Component {

  constructor(){
    super();
  }

  render(){
    this.el.innerHTML = /* html */`
        <div id="search-area">
        <div class="search-wrap">
          <input type="text" class="form-control" id="search-input" />
          <div class="btn-inner">
            <button type="submit" id="search-btn">
              <i class="xi xi-search"></i>
            </button>
            <button type="button" id="reset-btn">
              <i class="xi xi-refresh"></i>
            </button>
          </div>
        </div>
        <div class="btns-wrap">
          <button type="button" class="btn" id="create-btn" onClick="location.href='#/regis'">신규등록</button>
          <button type="button" class="btn" id="delete-btn">선택삭제</button>
        </div>
        </div>
        <div class="list-wrapper">
					<div class="d-flex align-items-center justify-content-between">
						<div>
							<input type="checkbox" id="selectall" name="selectall" value="selectall" />
							<label for="selectall">전체선택</label>
						</div>
						<div class="filter-wrap mb-10" id="filter-area">
							<input type="checkbox" id="filter-counseling" value="상담중" />
							<label for="filter-counseling">상담</label>
							<input type="checkbox" id="filter-conclusion" value="종결" />
							<label for="filter-conclusion">종결</label>
							<input type="checkbox" id="filter-treatment" value="치료중" />
							<label for="filter-treatment">치료</label>
						</div>
					</div>
					<div id="list-area"></div>
				</div>
    `

  let profileListWrap = this.el.querySelector('#list-area');
  const deleteBtn = this.el.querySelector('#delete-btn');
  const searchBtn = this.el.querySelector('#search-btn');
  const searchInput = this.el.querySelector('#search-input');
  const resetBtn = this.el.querySelector('#reset-btn');


  // showLoadingImage();

  
  // 프로필 삭제하기
  const deleteList = function () {

    const auth = firebase.auth();
    let deleteList = [];
    
    const checkboxes = document.querySelectorAll('input[name="selection"]:checked');
  
    checkboxes.forEach((checkbox) => {
      const checkedParent = checkbox.closest('a');
      let docIdToDelete = checkedParent.getAttribute('href').split('id=')[1];
      deleteList.push(docIdToDelete);
    });
  
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('로그인 후에 사용 가능합니다');
      window.location.href = '#/login';
      return;
    }
  
    if (deleteList.length == 0) {
      alert('삭제할 프로필이 없습니다')
      return;
    }
  
    Promise.all(deleteList.map((docId) => db.collection('person').doc(docId).get()))
      .then((docs) => {
        const deletableDocs = docs.filter((doc) => doc.data().uid === currentUser.uid);
        if (currentUser.uid == 'jusBruEPBGcrT4YlxuBR3wuquYo2' || deletableDocs.length == deleteList.length) {
  
          const confirmed = window.confirm('정말로 삭제하시겠습니까?');
  
          if (confirmed) {
            Promise.all(deleteList.map((docId) => db.collection('person').doc(docId).delete()))
              .then(() => {
                alert('삭제되었습니다');
                db.collection('person')
                .get()
                .then((result) => {
                  let profileList = '';
                  result.forEach((doc) => {
                    const counselingType = counselingTypes[doc.data().sort];
                    const btnClass = counselingType ? counselingType.className : '';
          
                    profileList += `
                      <a href="./sub/sub.html?id=${doc.id}" class="list-item card">
                        <input type="checkbox" name="selection" value="${doc.data().name}"/>
                        <p class="card-img-wrap">
                          <img src="${doc.data().image}" class="card-img-top" />
                        </p>
                        <div class="card-body">
                          <span class="card-text">${doc.data().name}</span>
                          <span class="card-text">/ ${doc.data().gender}</span>
                          <span class="card-text">/ ${doc.data().age}</span>
                          <p class="card-text user-text">담당 상담사 : ${doc.data().currentUser}</p>
                          <p class="card-text memo-text">${doc.data().memo}</p>
                          <p class="btn ${btnClass}">${doc.data().sort}</p>
                        </div>
                      </a>
                    `;
                  });

                  profileListWrap.innerHTML = profileList
                })

              })
              .catch((error) => {
                console.error('Error deleting document: ', error);
              });
          } else {
            // 취소를 선택한 경우
            console.log('삭제 작업이 취소되었습니다.');
          }
  
        }  else {
          alert('작성자만 삭제할 수 있습니다');
          return;
        }
      })
      .catch((error) => {
        console.error('Error getting document: ', error);
      });
  };
  
  // 검색하기
  function searchList() {
    const inputValue = searchInput.value;
  
    db.collection('person')
      // .where('name', '>=', inputValue)
      // .where('name', '<=', inputValue + '\uf8ff')
      .get()
      .then((result) => {
        let profileList = '';
        const filteredResults = result.docs.filter(doc => doc.data().name.includes(inputValue));
        if (result.empty) {
          profileList = '<p class="text-center w-100">검색 결과가 없습니다.</p>';
        } else {
          filteredResults.forEach((doc) => {
  
            const counselingType = counselingTypes[doc.data().sort];
            const btnClass = counselingType ? counselingType.className : '';
  
  
            profileList += `
          <a href="./sub/sub.html?id=${doc.id}" class="list-item card">
    <input type="checkbox" name="selection" value="${doc.data().name}" onclick="checkSelectAll()"/>
       <p class="card-img-wrap">
         <img src="${doc.data().image}" class="card-img-top" />
       </p>
       <div class="card-body">
  
       <span class="card-text">${doc.data().name}</span>
       <span class="card-text">/ ${doc.data().gender}</span>
       <span class="card-text">/ ${doc.data().age}</span>
    <p class="card-text user-text">담당 상담사 : ${doc.data().currentUser}</p>
    <p class="card-text memo-text">${doc.data().memo}</p>
       <p class="btn ${btnClass}">${doc.data().sort}</p>
     </div>
     </a>
      `;
          });
        }
  
        profileListWrap.innerHTML = profileList;
      });
  }
  
  resetBtn.addEventListener('click', function () {
    location.reload();
  });
  
  searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      searchList();
    }
  });
  
  searchBtn.addEventListener('click', searchList);
  deleteBtn.addEventListener('click', deleteList);
  }
}




