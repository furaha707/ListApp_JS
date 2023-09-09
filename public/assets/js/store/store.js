import { Store } from "../core/core.js";

const store = new Store({
  members: [],
  loading: false
})

export default store

// 파베에 있는 현재 데이터 가져오는 함수?
export const getData = async () => {
  try{
  const result = await db.collection('person')
  .get();

  const dataArray = [];
  let urlId = [];

  result.forEach((item) => {
    dataArray.push(item.data());
    urlId.push(item.id)
  });

  store.state.members = dataArray;
  return {urlId, dataArray};
  } catch (error) {
    console.log(error)
    return [];
  }
}
