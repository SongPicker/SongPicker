import Text30 from "../atoms/Text36"
import { TextProps } from "../shared/Types"

const ChartName = (props: TextProps) => {
  return (
    <div className="flex h-[70px] px-5 rounded-box border-2 border-solid border-white justify-center items-center text-[#80F9C6] bg-black/60">
        <Text30 text={props.text}/>
    </div>
  )
}

export default ChartName