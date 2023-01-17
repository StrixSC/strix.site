import LayoutTemplate from '@components/LayoutTemplate';
import Projects from '@components/Projects';
import ProjectsList from '@components/ProjectsList';
import Title from '@components/Title';
const ProjectsPage = () => {
    return (
        <LayoutTemplate title="Portfolio & Projects | Strix.Site">
            <div className="flex flex-col gap-8 mt-16 wrap">
                <div>
                    <Title text="Portfolio & Projects"></Title>
                </div>
                <div className="hidden lg:block">
                    <Projects></Projects>
                </div>
                <hr></hr>
                <div className="">
                    <ProjectsList cols={2}></ProjectsList>
                </div>
            </div>
        </LayoutTemplate>
    );
};
export default ProjectsPage;
