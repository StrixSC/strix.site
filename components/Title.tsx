import { useRouter } from 'next/router';
import Link from 'next/link';

const Title = (props: any) => {
    const { text } = props;
    return <div className="font-extrabold text-5xl dark:text-white text-black">{text}</div>;
};

export default Title;
