const Tag = (props: any) => {
    const { iconSrc, text } = props;
    return (
        <div className="text-white rounded-md border-neutral-900">
            <img
                height="20"
                width="20"
                title={text}
                className="hover:cursor-pointer"
                alt={text}
                src={`https://cdn.simpleicons.org/${iconSrc}/a3a3a3`}
            />
        </div>
    );
};

export default Tag;
