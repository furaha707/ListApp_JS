import { Component } from "../core/core.js";
import profileStore from "../store/store.js"
import { getData } from "../store/store.js";

const counselingTypes = {
  상담중: { className: 'btn-primary' },
  치료중: { className: 'btn-danger' },
  종결: { className: 'btn-warning' }
};

function checkSelectAll() {
  // 전체 체크박스
  const checkboxes = document.querySelectorAll('input[name="selection"]');
  // 선택된 체크박스
  const checked = document.querySelectorAll('input[name="selection"]:checked');
  // select all 체크박스
  const selectAll = document.querySelector('input[name="selectall"]');



  if (checkboxes.length === checked.length) {
    selectAll.checked = true;
  } else {
    selectAll.checked = false;
  }
}

export default class ProfileItem extends Component {
  constructor(){
    super({
      tagName: 'a'
    })
  }

  async render()  {
    
    let profileList = '';

    try{
      const {urlId} = await getData();
      const { members } = profileStore.state;

      members.forEach((doc, index) => {
        const counselingType = counselingTypes[doc.sort];
        const btnClass = counselingType ? counselingType.className : '';

        profileList += `
          <a href="#/detail?id=${urlId[index]}" class="list-item card">
            <input type="checkbox" name="selection" value="${doc.name}" onclick="${checkSelectAll()}"/>
            <p class="card-img-wrap">
              <img src="${doc.image}" class="card-img-top" />
            </p>
            <div class="card-body">
              <span class="card-text">${doc.name}</span>
              <span class="card-text">/ ${doc.gender}</span>
              <span class="card-text">/ ${doc.age}</span>
              <p class="card-text user-text">담당 상담사 : ${doc.currentUser}</p>
              <p class="card-text memo-text">${doc.memo}</p>
              <p class="btn ${btnClass}">${doc.sort}</p>
            </div>
          </a>
        `;
      });

    } catch(error) {
      console.log(error)
    }

    // 가져온 데이터를 프로필 목록에 설정
    const profileListWrap = document.getElementById('list-area');
    profileListWrap.innerHTML = profileList;
    // hideLoadingImage();

    // S : 전체 체크박스 클릭
    const checkboxes = document.getElementsByName('selection');
    const selectAll = document.querySelector('input[name="selectall"]');

    selectAll.checked = false;
    
    selectAll.addEventListener('click', function () {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
      });
    });
    // E : 전체 체크박스 클릭

    // S : 개별 체크박스 클릭
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('click', function () {
        const checkedCheckboxes = document.querySelectorAll('input[name="selection"]:checked');
        selectAll.checked = checkboxes.length === checkedCheckboxes.length;
      });
    });
    // E : 개별 체크박스 클릭
  }
}


