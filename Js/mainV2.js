import { DOMAIN } from "../Js/api.js";
import Member from "./memberList.js";
const getElement = (selector) => {
  return document.querySelector(selector);
};

let dataMembers = [];

const getMemberList = () => {
  const promise = axios({
    url: DOMAIN,
    method: "GET",
  });

  promise
    .then((result) => {
      renderTable(result.data);
      dataMembers.push(...result.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
getMemberList();

const renderTable = (arr) => {
  let htmlContent = "";
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    htmlContent += `
<tr>
<td>${item.id}</td>
<td>${item.name}</td>
<td>${item.desc}</td>
<td>${
      item.type === "loai1"
        ? "Khoa công nghệ thông tin"
        : "Khoa an toàn thông tin"
    }</td>
<td>
<image style="width: 100px; height: 100px" src="${item.image}" ></image>
</td>

<td>
<button class='btn btn-danger' onclick="deleteMember(${
      item.id
    })">Delete</button>
<button class='btn btn-success nl-3' data-toggle="modal" data-target = "#exampleModal" onclick="editMember(${
      item.id
    })"> Edit </button>
</td>
</tr>
`;
  }

  getElement("#tbodyMember").innerHTML = htmlContent;
};

getElement("#search").onclick = () => {
  let valueSearch = getElement("#searchName").value;
  let newArrSearch = [];
  if (dataMembers?.length > 0) {
    dataMembers.forEach((e) => {
      const name = e?.name?.toUpperCase();
      if (name?.match(valueSearch?.toUpperCase())?.[0]) {
        newArrSearch.push(e);
      }
    });
  }

  renderTable(newArrSearch?.length > 0 ? newArrSearch : dataMembers);
};

getElement("#selLoai").onchange = () => {
  let valueSelected = getElement("#selLoai").value;
  let newArrFilterType = [];
  if (dataMembers?.length > 0) {
    dataMembers.forEach((e) => {
      if (e?.type === valueSelected) {
        newArrFilterType.push(e);
      }
    });
  }

  renderTable(newArrFilterType?.length > 0 ? newArrFilterType : dataMembers);
};

const layThongTinMember = () => {
  const elements = document.querySelectorAll(
    "#membersForm input, #membersForm select, #membersForm textarea"
  );

  let memberData = [];
  elements.forEach((ele) => {
    const { id, value } = ele;
    memberData[id] = value;
  });

  const { name, desc, type, image } = memberData;
  return new Member(name, desc, type, image);
};

// ẩn btn cập nhật khi click vào thêm sp
getElement("#btnThem").onclick = () => {
  // ẩn btn cập nhật
  getElement("#btnCapNhat").style.display = "none";
  getElement("#btnThemMember").style.display = "inline-block";
};

getElement("#btnThemMember").onclick = () => {
  console.log("tests");

  if (checkValid()) return alert("Vui lòng nhập đầy đủ thông tin!");
  // lấy thông tin san pham từ input
  const member = layThongTinMember();

  // call API thêm sp
  const promise = axios({
    url: DOMAIN,
    method: "POST",
    data: member,
  });

  promise
    .then((result) => {
      getMemberList();
    })

    .catch((err) => {
      console.log("err: ", err);
    });
  getElement("#membersForm").reset();
};

window.deleteMember = (id) => {
  const promise = axios({
    url: `${DOMAIN}/${id}`,
    method: "DELETE",
  });

  promise
    // xóa thành công
    .then(() => {
      getMemberList();
    })
    // xóa thất bại
    .catch((err) => {
      console.log(err);
    });
};

window.editMember = (id) => {
  // ẩn btn thêm sp
  getElement("#btnThemMember").style.display = "none";

  // show lại btn cập nhật
  getElement("#btnCapNhat").style.display = "inline-block";

  // set data-id vào btn cập nhật
  getElement("#btnCapNhat").setAttribute("data-id", id);

  console.log(id);

  // call api lấy thông tin sp
  const promise = axios({
    url: `${DOMAIN}/${id}`,
    method: "GET",
  });
  promise
    .then((result) => {
      let sp = result.data;
      getElement("#name").value = sp.name;
      getElement("#desc").value = sp.desc;
      getElement("#type").value = sp.type;
      getElement("#image").value = sp.image;
    })
    .catch((er) => {
      console.log(err);
    });
};

getElement("#btnCapNhat").onclick = () => {
  if (checkValid()) return;
  const dataMember = layThongTinMember();
  //  lấy id thông qua attribute data-id đã set ở hàm editMember
  const id = getElement("#btnCapNhat").getAttribute("data-id");
  // call api cap nhat DB
  const promise = axios({
    url: `${DOMAIN}/${id}`, // id từ đâu chưa biết
    method: "PUT",
    data: dataMember,
  });
  promise.then(() => {
    getMemberList();
  });
};
// nutation: Create, edit, delete

// Validation--------------------------------------------------------------

const checkEmty = (value, alert, name) => {
  if (!value) {
    if (alert === "#invalidLoai") {
      getElement(alert).innerHTML = "Chọn khoa";
    } else {
      getElement(alert).innerHTML = name;
    }
  } else {
    getElement(alert).innerHTML = "";
  }
};

//Kiểm tra name , img , thương hiệu không được bỏ trống
getElement("#name").onblur = function () {
  let name = getElement("#name").placeholder;
  let value = getElement("#name").value;
  let alert = "#invalidTen";
  checkEmty(value, alert, name);
};
getElement("#image").onblur = function () {
  let name = getElement("#image").placeholder;
  let value = getElement("#image").value;
  let alert = "#invalidHinh";
  checkEmty(value, alert, name);
};
getElement("#type").onblur = function () {
  let name = getElement("#type").placeholder;
  let value = getElement("#type").value;
  let alert = "#invalidLoai";
  checkEmty(value, alert, name);
};

//Kiểm tra desc không được bỏ trống,
getElement("#desc").onblur = function () {
  let name = getElement("#desc").placeholder;
  let value = getElement("#desc").value;
  let alert = "#invalidMoTa";
  checkEmty(value, alert, name);
};

function checkValid() {
  let name = getElement("#name").value;
  let img = getElement("#image").value;
  let desc = getElement("#desc").value;
  let type = getElement("#type").value;

  if (!name || !img || !desc || !type) {
    return true;
  }
}
