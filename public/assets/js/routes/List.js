import { Component } from "../core/core.js";
import ProfileItem from "../components/profileItem.js";
import SearchItem from "../components/SearchItem.js";

const counselingTypes = {
  상담중: { className: 'btn-primary' },
  치료중: { className: 'btn-danger' },
  종결: { className: 'btn-warning' }
};

export default class Profile extends Component {

  constructor(){
    super()
  }

  render(){
    this.el.innerHTML = /* html */ `
    	<main>
			<div class="list-container">
			</div>
		</main>
    `
    
      let profileContainer = this.el.querySelector('.list-container');

      profileContainer.append(new SearchItem().el, new ProfileItem().el);

      // showLoadingImage();

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
      
      function sortFiltering() {
        const filterCheckboxes = document.querySelectorAll('#filter-area input[type="checkbox"]');
        let checkedList = [];
      
        filterCheckboxes.forEach((checkbox) => {
          checkbox.addEventListener('change', () => {
            // 체크박스 상태에 따라 원하는 작업을 수행하도록 작성
            if (checkbox.checked) {
              // 체크될 때의 동작
              checkedList.push(checkbox.value);
      
              // 추가 작업을 여기에 작성
            } else {
              // 체크 해제될 때의 동작
              checkedList = checkedList.filter((item) => item !== checkbox.value);
      
              // 추가 작업을 여기에 작성
            }
            filteredRender(checkedList);
          });
        });
      }
      
      // 상담종류 필터링
      function filteredRender(selectedSorts) {
        let query = db.collection('person');
        let profileListWrap = document.querySelector('#list-area');
        if (selectedSorts.length > 0) {
          query = query.where('sort', 'in', selectedSorts);
        }
      
        query.get().then((result) => {
          let profileList = '';
          result.forEach((doc) => {
      
            const counselingType = counselingTypes[doc.data().sort];
            const btnClass = counselingType ? counselingType.className : '';
      
            profileList += `
                <a href="./sub/sub.html?id=${doc.id}" class="list-item card">
                <input type="checkbox" name="selection" value="${doc.data().name}" onclick="${checkSelectAll()}"/>
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
      
          profileListWrap.innerHTML = profileList;
          // hideLoadingImage();
        });
      }
      
      // 페이지 로드 시 체크박스 변경 이벤트 핸들러를 등록
      window.addEventListener('DOMContentLoaded', sortFiltering);
    }
}
