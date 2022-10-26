class Steps {
  constructor(containerId, data) {
    this.$container = document.querySelector(`#${containerId}`)
    this.data = data
    this.active = 0
  }
  get data() {
    return this._data
  }
  set data(val) {
    this._data = val
    this.render(val)
  }
  get active() {
    return this._active
  }
  set active(val) {
    this._active = val
    this.render(this._data)
  }
  render(data) {
    let template = ''
    data.forEach((item, i) => {
      template += `<li class="${this.active === i ? 'active' : this.active - 1 === i ? 'before-active' : ''}"><p class="status">${item.status}</p>`
      item.info.forEach(info => template += `<p>${info}</p>`)
      template += `</li>`
    })
    this.$container.innerHTML = template;
  }
}


const data = [
  { status: "待入账", info: ['美国，芝加哥商业银行总行', '李四，4545754565'] },
  { status: "待入账", info: ['汇出汇款长沙支行发起'] }
]

const s = new Steps("steps", data)

console.log(s.data);

setTimeout(() => {
  data.push({ status: "xx", info: ['xxx'] })
  s.data = data
  s.active = 1
}, 1000);