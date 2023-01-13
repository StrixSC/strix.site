import { useRouter } from 'next/router';
import Link from 'next/link';

const ModeToggleButton = (props: any) => {
    const { children, ...customMeta } = props;
    const router = useRouter();

    return <div>Mode Toggle Button</div>;
};

export default ModeToggleButton;
