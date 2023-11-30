interface Message {
  date: Date;
  nickname: string;
  text: string;
}

export default function MyText(props: Message) {
  return (
    <div className="text-end w-full h-fit flex">
      <span className="w-11/12 mx-10">{props.data}</span>
      <div className="w-1/12 h-16 bg-slate-50" />
      {/* <Image src={janimal} alt='img' className="w-1/12 h-16" /> */}
    </div>
  );
}
