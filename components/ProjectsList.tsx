import { useRouter } from 'next/router';
import projects from '@public/data/data.json';
import { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Tag from './Tag';

const ProjectsList = (props: any) => {
    let { main, limit, cols, ...customMeta } = props;
    const gStyle = {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
    } as CSSProperties;

    const renderProjects = () => {
        if (limit > projects.length) {
            limit = projects.length;
        }

        let p = projects;
        if (main) {
            p = projects.filter((p) => p.isMain);
        }

        let content = [];
        for (let i = 0; limit ? i < limit : i < p.length; i++) {
            let style = {
                // background: `linear-gradient(45deg, ${p[i].primaryColor}, ${p[i].fallbackColor})`,
                // color: p[i].textColor
            } as CSSProperties;
            let tags = [];

            for (let tech of p[i].tech) {
                tags.push(<Tag iconSrc={tech.slug} text={tech.name}></Tag>);
            }
            content.push(
                <div
                    key={p[i].id}
                    className="flex items-center justify-start w-full h-full gap-2 px-3 border-2 rounded-md bg-neutral-200 dark:bg-neutral-900 hover:ring-2 border-neutral-400 dark:border-zinc-600"
                    style={style}>
                    <div className="w-[50px]">
                        <img
                            className="inset-0 object-contain w-full h-full text-transparent"
                            src={p[i].iconUrlMedium}></img>
                    </div>
                    <div className="p-4 w-[80%]">
                        <h1 className="text-md font grid-cols ">{p[i].name}</h1>
                        <p className="text-sm"> {p[i].summary} </p>
                        <div className="flex flex-wrap justify-start gap-1 mt-2">{tags}</div>
                    </div>
                    <div></div>
                    <Link href={p[i].url} className="link">
                        <FontAwesomeIcon icon={faLink} />
                    </Link>
                </div>
            );
        }

        return content;
    };

    return (
        <div
            style={gStyle}
            className={`flex flex-row flex-wrap lg:grid auto-cols-rows justify-center gap-4`}>
            {renderProjects()}
        </div>
    );
};

export default ProjectsList;
