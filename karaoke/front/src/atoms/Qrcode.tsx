import { QRCodeSVG } from "qrcode.react"

const Qrcode = () => {
  return (
    <QRCodeSVG value={JSON.stringify({serialNumber: 'D208-SongPicker'})} className="size-72" bgColor="transparent" />
  )
}

export default Qrcode