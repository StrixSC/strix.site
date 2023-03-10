import Link from 'next/link';
import { useEffect, useState } from 'react';
import Tagline from './Tagline';

const About = (props: any) => {
    const { profileImage } = props;
    const [isMounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex flex-col flex-wrap items-center justify-between gap-8 my-20 lg:gap-0 md:flex-row">
            <div id="profile-image" className="flex justify-center w-full lg:w-1/2">
                <img
                    className="rounded-full object-cover w-[275px] h-[275px] max-w-full"
                    src={profileImage}></img>
            </div>
            <div id="about" className="lg:w-1/2">
                <h1 className="mb-1 text-6xl font-extrabold text-black dark:text-white">
                    Nawras M.A.
                </h1>
                <h3 className="text-2xl dark:text-zinc-500 text-zinc-600">
                    {isMounted && <Tagline></Tagline>}
                </h3>

                <p className="mt-8 text-xl text-justify text-zinc-800 dark:text-zinc-400">
                    My name is Nawras{' '}
                    <span>
                        <Link
                            className="underline"
                            href="https://www.youtube.com/watch?v=1J_Z0Ng2DQU">
                            (/nɔ:ræs/)
                        </Link>
                    </span>
                    , I'm a software engineering student at Polytechnique Montreal. I have a strong
                    background in full-stack development and blockchain development, as well as in
                    cybersecurity engineering.
                    <br></br>
                    <br></br>
                    On this blog, you can expect to find posts containing write-ups and solutions to{' '}
                    <abbr title="Capture the Flag">CTFs</abbr>, algorithmic problems, programming
                    competitions and some other stuff.
                </p>
            </div>
        </div>
    );
};

export default About;
