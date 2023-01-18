import LinksGrid from '@components/LinksGrid';
import LayoutTemplate from '@components/LayoutTemplate';
import Title from '@components/Title';
const LinksPage = () => {
    return (
        <LayoutTemplate title="Links | Strix.Site">
            <div className="flex flex-col gap-8 mt-16 wrap">
                <div>
                    <Title text="Links"></Title>
                </div>
                <div className="">
                    <LinksGrid col={4}></LinksGrid>
                </div>
            </div>
        </LayoutTemplate>
    );
};
export default LinksPage;
