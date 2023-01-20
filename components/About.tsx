import Link from 'next/link';
import { useEffect, useState } from 'react';

const dictionary = {
    0: ['Build', 'Construct', 'Create', 'Develop', 'Fabricate', 'Assemble'],
    1: [
        'Invert',
        'Reverse',
        'Decompile',
        'Reverse-engineer',
        'Unravel',
        'Deconstruct',
        'Disassemble',
        'Disrupt',
        'Break',
        'Crack',
        'Shatter',
        'Hack',
        'Teardown'
    ],
    2: ['Innovate', 'Pioneer', 'Progress', 'Invent', 'Imagine', 'Originate', 'Create', 'Trailblaze']
};

const About = (props: any) => {
    const { profileImage } = props;
    const [isMounted, setMounted] = useState(false);
    useEffect(() => setMounted(true));

    const renderTagLine = () => {
        let tagline = '';
        tagline += `${dictionary[0][Math.floor(Math.random() * dictionary[0].length)]}. `;
        tagline += `${dictionary[1][Math.floor(Math.random() * dictionary[1].length)]}. `;
        tagline += `${dictionary[2][Math.floor(Math.random() * dictionary[2].length)]}. `;
        return tagline;
    };

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
                    {isMounted && renderTagLine()}
                </h3>

                <p className="mt-8 text-xl text-justify text-zinc-800 dark:text-zinc-400">
                    My name is Nawras{' '}
                    <span>
                        <Link
                            className="underline"
                            href="https://www.youtube.com/watch?v=3rkUbeGAwOY">
                            (/nɔ:ræs/)
                        </Link>
                    </span>
                    , I'm a software engineering student here in Montréal at the École Polytechnique
                    de Montréal. I hold a strong background in full-stack development, as well as
                    security engineering and blockchain development.
                    <br></br>
                    <br></br>
                    On this blog, you can expect to find posts containing write-ups and solutions to{' '}
                    <abbr title="Capture the Flag">CTFs</abbr>, algorithmic problems, programming
                    competitions and some other stuff. This site is still in development, so if
                    there are any issues, letting me know would be a great help!
                </p>
            </div>
        </div>
    );
};

export default About;
