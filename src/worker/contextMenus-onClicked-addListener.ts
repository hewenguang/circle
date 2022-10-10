export default function (info: any, tab: any) {
  this.send(`m_${info.menuItemId}`, { tab, info });
}
