export default function OtherText(props: { data: string }) {
  return (
    <div className="text w-full h-fit flex">
      <div className="w-1/12 h-16 bg-slate-50" />
      {/* <Image src={myungttak} alt='img' className="w-1/12 h-16" /> */}
      <span className="w-11/12 mx-10">{props.data}</span>
    </div>
  );
}
