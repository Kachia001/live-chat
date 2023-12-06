import type { Message } from '../socket';

export function MyText(props: { data: Message }) {
  return (
    <div className="text-end w-fit h-fit flex bg-slate-200 ms-auto my-2 rounded-md">
      <span className="w-fit mx-10"><pre>{props.data.text}</pre></span>
      <span>{props.data.nickname}</span>
      <div className="w-20 h-16 bg-slate-50 rounded-e-md" />
      {/* <Image src={janimal} alt='img' className="w-1/12 h-16" /> */}
    </div>
  );
}
