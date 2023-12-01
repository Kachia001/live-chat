import type { Message } from '../socket';

export function MyText(props: { data: Message }) {
  return (
    <div className="text-end w-full h-fit flex bg-slate-200">
      <span className="w-11/12 mx-10">{props.data.text}</span>
      <span>{props.data.nickname}</span>
      <div className="w-1/12 h-16 bg-slate-50" />
      {/* <Image src={janimal} alt='img' className="w-1/12 h-16" /> */}
    </div>
  );
}
