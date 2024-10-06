type TopGenreItemProps = {
  name: string;
};

const TopGenreItem = (props: TopGenreItemProps) => {
  return (
    <div className="text-center w-fit px-3 py-1 rounded-full bg-[#1F222A]">{`# ${props.name}`}</div>
  );
};

export default TopGenreItem;
