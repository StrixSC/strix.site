import About from '@components/About';
import Title from '@components/Title';
import LayoutTemplate from '../components/LayoutTemplate';
import { ComponentProps } from 'react';
import LinksGrid from '@components/LinksGrid';

const IndexPage = (props?: ComponentProps<any>) => (
    <LayoutTemplate title="Home | Strix.Site">
        <About profileImage="https://avatars.githubusercontent.com/u/29717413?v=4"></About>
        <div id="#links">
            <div className="flex flex-col gap-4 mt-8">
                <Title text="Links"></Title>
            </div>
            <div className="mt-8">
                <LinksGrid></LinksGrid>
            </div>
        </div>
    </LayoutTemplate>
);

export default IndexPage;
