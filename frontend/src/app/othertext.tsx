interface Message {
  date: Date;
  nickname: string;
  text: string;
}
export default function OtherText(props: { data: Message }) {
  return (
    <div className="text w-full h-fit flex bg-slate-200">
      <div className="w-1/12 h-16 bg-slate-50" />
      {/* <Image src={myungttak} alt='img' className="w-1/12 h-16" /> */}
      <span>{props.data.nickname}</span>
      <span className="w-11/12 mx-10">{props.data.text}</span>
    </div>
  );
}
