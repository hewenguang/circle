export default function (details: { reason: string }) {
  this.fire(details.reason);
}
