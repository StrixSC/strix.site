const About = (props: any) => {
    const { profileImage } = props;

    return (
        <div className="my-20 flex gap-8 lg:gap-0 flex-col md:flex-row justify-between items-center flex-wrap">
            <div id="profile-image" className="flex justify-center w-full lg:w-1/2">
                <img
                    className="rounded-full object-cover w-[275px] h-[275px] max-w-full"
                    src={profileImage}></img>
            </div>
            <div id="about" className="lg:w-1/2">
                <h1 className="mb-1 text-6xl dark:text-white text-black font-extrabold">
                    Nawras M.A.
                </h1>
                <h3 className="text-2xl dark:text-zinc-500 text-zinc-600">
                    Build. Reverse. Innovate.
                </h3>

                <p className="mt-8 text-2xl text-zinc-800 dark:text-zinc-400 text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        </div>
    );
};

export default About;
