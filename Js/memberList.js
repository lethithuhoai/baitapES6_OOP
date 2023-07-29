class Member {
  constructor(name, desc, type, image) {
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.image = image;
  }
  mapLoai() {
    // if (this.loai === 'loai1') return Iphone
    // if (this.loai === 'loai2') return Samsung

    return this.loai === "loai1"
      ? "Khoa công nghệ thông tin"
      : "Khoa an toàn thông tin";
  }
}

export default Member;
