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

const Tagline = () => {
    let tagline = '';
    tagline += `${dictionary[0][Math.floor(Math.random() * dictionary[0].length)]}. `;
    tagline += `${dictionary[1][Math.floor(Math.random() * dictionary[1].length)]}. `;
    tagline += `${dictionary[2][Math.floor(Math.random() * dictionary[2].length)]}. `;
    return <>{tagline}</>;
};

export default Tagline;
